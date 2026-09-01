import express from 'express';
import { readDB, writeDB } from '../db.js';
import pool, { isTiDBConnected } from '../database.js';
import { verifyRole } from '../middleware/authMiddleware.js';

const router = express.Router();

// GET /api/announcements
router.get('/announcements', async (req, res, next) => {
  try {
    if (isTiDBConnected) {
      const [rows] = await pool.query('SELECT * FROM announcements ORDER BY id DESC');
      return res.json({ success: true, count: rows.length, announcements: rows });
    }

    const db = readDB();
    return res.json({ success: true, count: (db.announcements || []).length, announcements: db.announcements || [] });
  } catch (error) {
    next(error);
  }
});

// POST /api/announcements
router.post('/announcements', verifyRole(['ADMIN', 'TEACHER']), async (req, res, next) => {
  const { title, description, targetClass, publishDate, expiryDate } = req.body;
  if (!title || !description) {
    return res.status(400).json({ success: false, message: 'Notice Title and Description are required.' });
  }

  const pubDate = publishDate || new Date().toISOString().split('T')[0];
  const expDate = expiryDate || '2026-12-31';

  try {
    if (isTiDBConnected) {
      const [result] = await pool.query(
        'INSERT INTO announcements (title, description, targetClass, publishDate, expiryDate, status) VALUES (?, ?, ?, ?, ?, ?)',
        [title, description, targetClass || 'All Classes', pubDate, expDate, 'ACTIVE']
      );
      return res.json({ success: true, message: 'Announcement published successfully!' });
    }

    const db = readDB();
    if (!db.announcements) db.announcements = [];
    const newNotice = {
      id: Date.now(),
      title,
      description,
      targetClass: targetClass || 'All Classes',
      publishDate: pubDate,
      expiryDate: expDate,
      status: 'ACTIVE'
    };
    db.announcements.unshift(newNotice);
    writeDB(db);

    return res.json({ success: true, message: 'Announcement published successfully!', notice: newNotice });
  } catch (error) {
    next(error);
  }
});

export default router;
