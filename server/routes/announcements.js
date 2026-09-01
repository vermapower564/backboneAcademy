import express from 'express';
import { readDB, writeDB } from '../db.js';
import pool, { isTiDBConnected } from '../database.js';
import { verifyRole } from '../middleware/authMiddleware.js';
import { recordAuditLog } from '../middleware/auditLogger.js';

const router = express.Router();

// GET /api/announcements - Get active announcements
router.get('/announcements', async (req, res, next) => {
  try {
    if (isTiDBConnected) {
      const [rows] = await pool.query('SELECT * FROM announcements WHERE status = "ACTIVE" ORDER BY id DESC');
      return res.json({ success: true, count: rows.length, announcements: rows });
    }

    const db = readDB();
    const result = (db.announcements || []).filter(a => a.status === 'ACTIVE');
    return res.json({ success: true, count: result.length, announcements: result });
  } catch (error) {
    next(error);
  }
});

// POST /api/announcements - Publish announcement notice (Admin & Teacher Only)
router.post('/announcements', verifyRole(['ADMIN', 'TEACHER']), async (req, res, next) => {
  const { title, description, targetClass, publishDate, expiryDate } = req.body;
  if (!title) return res.status(400).json({ success: false, message: 'Announcement Title is required.' });

  const pubDate = publishDate || new Date().toISOString().split('T')[0];
  const expDate = expiryDate || '2026-12-31';

  try {
    if (isTiDBConnected) {
      const [result] = await pool.query(
        `INSERT INTO announcements (title, description, targetClass, publishDate, expiryDate, status)
         VALUES (?, ?, ?, ?, ?, 'ACTIVE')`,
        [title, description || '', targetClass || 'All Classes', pubDate, expDate]
      );

      const newNotice = { id: result.insertId, title, description, targetClass, publishDate: pubDate, expiryDate: expDate, status: 'ACTIVE' };
      await recordAuditLog({ req, action: 'PUBLISH_ANNOUNCEMENT', targetEntity: 'announcements', targetRecordId: title, metadata: { targetClass } });
      return res.json({ success: true, message: 'Announcement published successfully!', announcement: newNotice });
    }

    const db = readDB();
    if (!db.announcements) db.announcements = [];

    const newNotice = {
      id: Date.now(), title, description, targetClass: targetClass || 'All Classes', publishDate: pubDate, expiryDate: expDate, status: 'ACTIVE'
    };

    db.announcements.unshift(newNotice);
    writeDB(db);

    await recordAuditLog({ req, action: 'PUBLISH_ANNOUNCEMENT', targetEntity: 'announcements', targetRecordId: title, metadata: { targetClass } });
    return res.json({ success: true, message: 'Announcement published successfully!', announcement: newNotice });
  } catch (error) {
    next(error);
  }
});

export default router;
