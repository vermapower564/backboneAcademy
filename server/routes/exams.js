import express from 'express';
import { readDB, writeDB } from '../db.js';
import pool, { isTiDBConnected } from '../database.js';
import { verifyRole } from '../middleware/authMiddleware.js';

const router = express.Router();

// Helper: Calculate Grade from Percentage
function calculateGrade(pct) {
  if (pct >= 90) return 'A+';
  if (pct >= 80) return 'A';
  if (pct >= 70) return 'B';
  if (pct >= 50) return 'C';
  return 'F';
}

// GET /api/exams - List all exams
router.get('/exams', async (req, res, next) => {
  try {
    if (isTiDBConnected) {
      const [rows] = await pool.query('SELECT * FROM exams ORDER BY id DESC');
      return res.json({ success: true, count: rows.length, exams: rows });
    }
    const db = readDB();
    return res.json({ success: true, count: (db.exams || []).length, exams: db.exams || [] });
  } catch (error) {
    next(error);
  }
});

// GET /api/exams/results - Get exam results & report cards
router.get('/exams/results', async (req, res, next) => {
  const { studentId, examId } = req.query;

  try {
    if (isTiDBConnected) {
      let query = 'SELECT * FROM exam_results WHERE 1=1';
      const params = [];
      if (studentId) { query += ' AND studentId = ?'; params.push(studentId); }
      if (examId) { query += ' AND examId = ?'; params.push(examId); }

      const [rows] = await pool.query(query, params);
      return res.json({ success: true, count: rows.length, results: rows });
    }

    const db = readDB();
    let result = db.examResults || [];
    if (studentId) result = result.filter(r => r.studentId === studentId);
    if (examId) result = result.filter(r => String(r.examId) === String(examId));

    return res.json({ success: true, count: result.length, results: result });
  } catch (error) {
    next(error);
  }
});

// POST /api/exams/results - Submit marks for student
router.post('/exams/results', verifyRole(['ADMIN', 'TEACHER']), async (req, res, next) => {
  const { examId, studentId, studentName, className, subject, marksObtained, maxMarks } = req.body;
  if (!studentId || marksObtained === undefined) {
    return res.status(400).json({ success: false, message: 'Student ID and Marks obtained are required.' });
  }

  const max = Number(maxMarks) || 100;
  const marks = Number(marksObtained);
  const percentage = Number(((marks / max) * 100).toFixed(2));
  const grade = calculateGrade(percentage);

  try {
    if (isTiDBConnected) {
      const [result] = await pool.query(
        `INSERT INTO exam_results (examId, studentId, studentName, className, subject, marksObtained, maxMarks, percentage, grade)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [examId || 1, studentId, studentName || 'Student', className || 'Class 10', subject || 'Mathematics', marks, max, percentage, grade]
      );
      return res.json({ success: true, message: `Marks submitted! Percentage: ${percentage}%, Grade: ${grade}` });
    }

    const db = readDB();
    if (!db.examResults) db.examResults = [];

    const newResult = {
      id: Date.now(),
      examId: examId || 1,
      studentId,
      studentName: studentName || 'Student',
      className: className || 'Class 10',
      subject: subject || 'Mathematics',
      marksObtained: marks,
      maxMarks: max,
      percentage,
      grade
    };

    db.examResults.unshift(newResult);
    writeDB(db);

    return res.json({ success: true, message: `Marks submitted! Percentage: ${percentage}%, Grade: ${grade}`, result: newResult });
  } catch (error) {
    next(error);
  }
});

export default router;
