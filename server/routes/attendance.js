import express from 'express';
import { readDB, writeDB } from '../db.js';
import pool, { isTiDBConnected } from '../database.js';
import { verifyRole } from '../middleware/authMiddleware.js';

const router = express.Router();

// GET /api/attendance - Query attendance (Cryptographic Data Isolation)
router.get('/attendance', async (req, res, next) => {
  const { date, className, studentId } = req.query;
  const userRole = (req.user?.role || 'GUEST').toUpperCase();
  const verifiedStudentId = req.user?.studentId;

  try {
    if (isTiDBConnected) {
      let query = 'SELECT * FROM attendance WHERE 1=1';
      const params = [];

      if (userRole === 'STUDENT' && verifiedStudentId) {
        query += ' AND studentId = ?';
        params.push(verifiedStudentId);
      } else if (userRole === 'ADMIN' || userRole === 'TEACHER') {
        if (date) { query += ' AND date = ?'; params.push(date); }
        if (className) { query += ' AND className = ?'; params.push(className); }
        if (studentId) { query += ' AND studentId = ?'; params.push(studentId); }
      } else {
        return res.status(403).json({ success: false, message: 'Access denied.' });
      }

      const [rows] = await pool.query(query, params);
      return res.json({ success: true, count: rows.length, attendance: rows });
    }

    const db = readDB();
    let result = db.attendance || [];

    if (userRole === 'STUDENT' && verifiedStudentId) {
      result = result.filter(a => a.studentId === verifiedStudentId);
    } else if (userRole === 'ADMIN' || userRole === 'TEACHER') {
      if (date) result = result.filter(a => a.date === date);
      if (className) result = result.filter(a => a.className === className);
      if (studentId) result = result.filter(a => a.studentId === studentId);
    } else {
      return res.status(403).json({ success: false, message: 'Access denied.' });
    }

    return res.json({ success: true, count: result.length, attendance: result });
  } catch (error) {
    next(error);
  }
});

// POST /api/attendance - Mark attendance (Admin & Teacher Only)
router.post('/attendance', verifyRole(['ADMIN', 'TEACHER']), async (req, res, next) => {
  const { records, date, className, markedBy } = req.body;
  if (!Array.isArray(records) || !date || !className) {
    return res.status(400).json({ success: false, message: 'Invalid payload. Records array, date and className required.' });
  }

  try {
    if (isTiDBConnected) {
      for (const rec of records) {
        await pool.query('DELETE FROM attendance WHERE studentId = ? AND date = ?', [rec.studentId, date]);
        await pool.query(
          'INSERT INTO attendance (studentId, className, date, status, markedBy) VALUES (?, ?, ?, ?, ?)',
          [rec.studentId, className, date, rec.status || 'PRESENT', markedBy || 'Rahul Verma Sir']
        );
      }
      return res.json({ success: true, message: `Attendance marked successfully for ${records.length} students on ${date}!` });
    }

    const db = readDB();
    if (!db.attendance) db.attendance = [];

    for (const rec of records) {
      db.attendance = db.attendance.filter(a => !(a.studentId === rec.studentId && a.date === date));
      db.attendance.push({
        id: Date.now() + Math.random(),
        studentId: rec.studentId,
        className,
        date,
        status: rec.status || 'PRESENT',
        markedBy: markedBy || 'Rahul Verma Sir'
      });
    }

    writeDB(db);
    return res.json({ success: true, message: `Attendance marked successfully for ${records.length} students on ${date}!` });
  } catch (error) {
    next(error);
  }
});

export default router;
