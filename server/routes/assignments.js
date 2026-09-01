import express from 'express';
import { readDB, writeDB } from '../db.js';
import pool, { isTiDBConnected } from '../database.js';
import { verifyRole } from '../middleware/authMiddleware.js';

const router = express.Router();

// GET /api/assignments
router.get('/assignments', async (req, res, next) => {
  const { className } = req.query;

  try {
    if (isTiDBConnected) {
      let query = 'SELECT * FROM assignments';
      const params = [];
      if (className) { query += ' WHERE className = ?'; params.push(className); }
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

// POST /api/assignments
router.post('/assignments', verifyRole(['ADMIN', 'TEACHER']), async (req, res, next) => {
  const { title, description, subject, className, dueDate, createdBy } = req.body;
  if (!title || !className) {
    return res.status(400).json({ success: false, message: 'Assignment Title and Target Class are required.' });
  }

  try {
    if (isTiDBConnected) {
      const [result] = await pool.query(
        'INSERT INTO assignments (title, description, subject, className, dueDate, createdBy, fileUrl) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [title, description || '', subject || 'General', className, dueDate || '2026-09-10', createdBy || 'Rahul Verma Sir', '#']
      );
      return res.json({ success: true, message: 'Assignment published successfully!' });
    }

    const db = readDB();
    if (!db.assignments) db.assignments = [];
    const newAssignment = {
      id: Date.now(),
      title,
      description: description || '',
      subject: subject || 'General',
      className,
      dueDate: dueDate || '2026-09-10',
      createdBy: createdBy || 'Rahul Verma Sir',
      fileUrl: '#'
    };
    db.assignments.unshift(newAssignment);
    writeDB(db);

    return res.json({ success: true, message: 'Assignment published successfully!', assignment: newAssignment });
  } catch (error) {
    next(error);
  }
});

// GET /api/materials - Study resources & notes
router.get('/materials', async (req, res, next) => {
  const { className, category } = req.query;

  try {
    if (isTiDBConnected) {
      let query = 'SELECT * FROM materials WHERE 1=1';
      const params = [];
      if (className) { query += ' AND className = ?'; params.push(className); }
      if (category) { query += ' AND category = ?'; params.push(category); }
      query += ' ORDER BY id DESC';

      const [rows] = await pool.query(query, params);
      return res.json({ success: true, count: rows.length, materials: rows });
    }

    const db = readDB();
    let result = db.materials || [];
    if (className) result = result.filter(m => m.className === className);
    if (category) result = result.filter(m => m.category === category);
    return res.json({ success: true, count: result.length, materials: result });
  } catch (error) {
    next(error);
  }
});

export default router;
