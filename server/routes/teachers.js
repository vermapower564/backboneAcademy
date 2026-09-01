import express from 'express';
import { readDB, writeDB } from '../db.js';
import pool, { isTiDBConnected } from '../database.js';
import { verifyRole } from '../middleware/authMiddleware.js';

const router = express.Router();

// GET /api/teachers - List faculty members
router.get('/teachers', async (req, res, next) => {
  try {
    if (isTiDBConnected) {
      const [rows] = await pool.query('SELECT * FROM teachers ORDER BY id DESC');
      return res.json({ success: true, count: rows.length, teachers: rows });
    }

    const db = readDB();
    return res.json({ success: true, count: db.teachers.length, teachers: db.teachers });
  } catch (error) {
    next(error);
  }
});

// POST /api/teachers - Add new faculty member
router.post('/teachers', verifyRole(['ADMIN']), async (req, res, next) => {
  const { name, mobile, email, subjects, classes } = req.body;
  if (!name || !mobile) {
    return res.status(400).json({ success: false, message: 'Teacher Name and Mobile are required.' });
  }

  const teacherId = `TCH-2026-${Math.floor(100 + Math.random() * 900)}`;
  const joiningDate = new Date().toISOString().split('T')[0];
  const subjectList = Array.isArray(subjects) ? subjects : [subjects || 'General Academics'];
  const classList = Array.isArray(classes) ? classes : [classes || 'Class 10'];

  try {
    if (isTiDBConnected) {
      const [result] = await pool.query(
        `INSERT INTO teachers (teacherId, name, photo, mobile, email, subjects, classes, joiningDate, status)
         VALUES (?, ?, '/logo.jpg', ?, ?, ?, ?, ?, 'ACTIVE')`,
        [teacherId, name, mobile, email || '', JSON.stringify(subjectList), JSON.stringify(classList), joiningDate]
      );

      const newTeacher = { id: result.insertId, teacherId, name, photo: '/logo.jpg', mobile, email, subjects: subjectList, classes: classList, joiningDate, status: 'ACTIVE' };
      return res.json({ success: true, message: 'Faculty member added successfully!', teacher: newTeacher });
    }

    const db = readDB();
    const newTeacher = { id: Date.now(), teacherId, name, photo: '/logo.jpg', mobile, email, subjects: subjectList, classes: classList, joiningDate, status: 'ACTIVE' };
    db.teachers.unshift(newTeacher);
    writeDB(db);

    return res.json({ success: true, message: 'Faculty member added successfully!', teacher: newTeacher });
  } catch (error) {
    next(error);
  }
});

export default router;
