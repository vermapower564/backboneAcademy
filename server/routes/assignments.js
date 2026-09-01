import express from 'express';
import { readDB, writeDB } from '../db.js';
import pool, { isTiDBConnected } from '../database.js';
import { verifyRole } from '../middleware/authMiddleware.js';
import { recordAuditLog } from '../middleware/auditLogger.js';

const router = express.Router();

// GET /api/assignments - Get active assignments
router.get('/assignments', async (req, res, next) => {
  const { className } = req.query;

  try {
    if (isTiDBConnected) {
      let query = 'SELECT * FROM assignments WHERE 1=1';
      const params = [];
      if (className) { query += ' AND className = ?'; params.push(className); }
      query += ' ORDER BY id DESC';

      const [rows] = await pool.query(query, params);
      return res.json({ success: true, count: rows.length, assignments: rows });
    }

    const db = readDB();
    let result = db.assignments || [];
    if (className) result = result.filter(a => a.className === className);

    return res.json({ success: true, count: result.length, assignments: result });
  } catch (error) {
    next(error);
  }
});

// POST /api/assignments - Create new assignment task (Admin & Teacher Only)
router.post('/assignments', verifyRole(['ADMIN', 'TEACHER']), async (req, res, next) => {
  const { title, description, subject, className, dueDate, createdBy, fileUrl } = req.body;
  if (!title) return res.status(400).json({ success: false, message: 'Assignment Title is required.' });

  try {
    if (isTiDBConnected) {
      const [result] = await pool.query(
        `INSERT INTO assignments (title, description, subject, className, dueDate, createdBy, fileUrl)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [title, description || '', subject || 'General', className || 'Class 10', dueDate || '2026-09-10', createdBy || 'Rahul Verma Sir', fileUrl || '#']
      );

      const newAssignment = { id: result.insertId, title, description, subject, className, dueDate, createdBy, fileUrl };
      await recordAuditLog({ req, action: 'PUBLISH_ASSIGNMENT', targetEntity: 'assignments', targetRecordId: title, metadata: { className, subject } });
      return res.json({ success: true, message: 'Homework assignment published successfully!', assignment: newAssignment });
    }

    const db = readDB();
    if (!db.assignments) db.assignments = [];

    const newAssignment = {
      id: Date.now(), title, description, subject: subject || 'General', className: className || 'Class 10', dueDate: dueDate || '2026-09-10', createdBy: createdBy || 'Rahul Verma Sir', fileUrl: fileUrl || '#'
    };

    db.assignments.unshift(newAssignment);
    writeDB(db);

    await recordAuditLog({ req, action: 'PUBLISH_ASSIGNMENT', targetEntity: 'assignments', targetRecordId: title, metadata: { className, subject } });
    return res.json({ success: true, message: 'Homework assignment published successfully!', assignment: newAssignment });
  } catch (error) {
    next(error);
  }
});

// GET /api/materials - Get study materials & PDFs
router.get('/materials', async (req, res, next) => {
  const { className } = req.query;

  try {
    if (isTiDBConnected) {
      let query = 'SELECT * FROM materials WHERE 1=1';
      const params = [];
      if (className) { query += ' AND className = ?'; params.push(className); }
      query += ' ORDER BY id DESC';

      const [rows] = await pool.query(query, params);
      return res.json({ success: true, count: rows.length, materials: rows });
    }

    const db = readDB();
    let result = db.materials || [];
    if (className) result = result.filter(m => m.className === className);

    return res.json({ success: true, count: result.length, materials: result });
  } catch (error) {
    next(error);
  }
});

export default router;
