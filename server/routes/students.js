import express from 'express';
import { readDB, writeDB } from '../db.js';
import pool, { isTiDBConnected } from '../database.js';
import { verifyRole } from '../middleware/authMiddleware.js';
import { recordAuditLog } from '../middleware/auditLogger.js';

import { getTeacherAssignedClasses } from '../services/teacherService.js';

const router = express.Router();

// GET /api/students - List students (RBAC, Program Separation & Privacy enforced)
router.get('/students', async (req, res, next) => {
  const { search, programType, className, board, batch, status } = req.query;
  const userRole = (req.user?.role || 'GUEST').toUpperCase();
  const verifiedStudentId = req.user?.studentId;
  const userEmail = req.user?.email;

  try {
    let teacherAssignedClasses = [];
    if (userRole === 'TEACHER') {
      teacherAssignedClasses = await getTeacherAssignedClasses(userEmail, req.user?.id);
      if (className && !teacherAssignedClasses.includes(className)) {
        return res.status(403).json({
          success: false,
          message: `Access denied. You are only authorized to access assigned programs/classes: ${teacherAssignedClasses.join(', ')}`
        });
      }
    }

    if (isTiDBConnected) {
      let query = 'SELECT * FROM students WHERE 1=1';
      const params = [];

      if (userRole === 'STUDENT' && verifiedStudentId) {
        query += ' AND studentId = ?';
        params.push(verifiedStudentId);
      } else if (userRole === 'ADMIN') {
        if (programType) { query += ' AND programType = ?'; params.push(programType); }
        if (className) { query += ' AND className = ?'; params.push(className); }
        if (board) { query += ' AND board = ?'; params.push(board); }
        if (batch) { query += ' AND batch LIKE ?'; params.push(`%${batch}%`); }
        if (status) { query += ' AND status = ?'; params.push(status); }
        if (search) {
          query += ' AND (name LIKE ? OR studentId LIKE ? OR mobile LIKE ? OR className LIKE ?)';
          params.push(`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`);
        }
      } else if (userRole === 'TEACHER') {
        if (programType) { query += ' AND programType = ?'; params.push(programType); }
        if (className) {
          query += ' AND className = ?';
          params.push(className);
        } else if (teacherAssignedClasses.length > 0) {
          query += ` AND className IN (${teacherAssignedClasses.map(() => '?').join(',')})`;
          params.push(...teacherAssignedClasses);
        }
        if (board) { query += ' AND board = ?'; params.push(board); }
        if (batch) { query += ' AND batch LIKE ?'; params.push(`%${batch}%`); }
        if (status) { query += ' AND status = ?'; params.push(status); }
        if (search) {
          query += ' AND (name LIKE ? OR studentId LIKE ? OR mobile LIKE ?)';
          params.push(`%${search}%`, `%${search}%`, `%${search}%`);
        }
      } else {
        return res.status(403).json({ success: false, message: 'Access denied.' });
      }

      query += ' ORDER BY id DESC';
      const [rows] = await pool.query(query, params);
      return res.json({ success: true, count: rows.length, students: rows });
    }

    const db = readDB();
    let result = db.students || [];

    if (userRole === 'STUDENT' && verifiedStudentId) {
      result = result.filter(s => s.studentId === verifiedStudentId);
    } else if (userRole === 'ADMIN') {
      if (programType) result = result.filter(s => s.programType === programType);
      if (className) result = result.filter(s => s.className === className);
      if (board) result = result.filter(s => s.board === board);
      if (batch) result = result.filter(s => (s.batch || '').toLowerCase().includes(batch.toLowerCase()));
      if (status) result = result.filter(s => s.status === status);
      if (search) {
        const q = search.toLowerCase();
        result = result.filter(s =>
          s.name.toLowerCase().includes(q) ||
          s.studentId.toLowerCase().includes(q) ||
          s.mobile.includes(q) ||
          s.className.toLowerCase().includes(q)
        );
      }
    } else if (userRole === 'TEACHER') {
      if (programType) result = result.filter(s => s.programType === programType);
      if (className) {
        result = result.filter(s => s.className === className);
      } else if (teacherAssignedClasses.length > 0) {
        result = result.filter(s => teacherAssignedClasses.includes(s.className));
      }
      if (board) result = result.filter(s => s.board === board);
      if (batch) result = result.filter(s => (s.batch || '').toLowerCase().includes(batch.toLowerCase()));
      if (status) result = result.filter(s => s.status === status);
      if (search) {
        const q = search.toLowerCase();
        result = result.filter(s =>
          s.name.toLowerCase().includes(q) ||
          s.studentId.toLowerCase().includes(q) ||
          s.mobile.includes(q)
        );
      }
    } else {
      return res.status(403).json({ success: false, message: 'Access denied.' });
    }

    return res.json({ success: true, count: result.length, students: result });
  } catch (error) {
    next(error);
  }
});

// POST /api/students - Add new student (Admin / Teacher only)
router.post('/students', verifyRole(['ADMIN', 'TEACHER']), async (req, res, next) => {
  const { name, dob, gender, parentName, mobile, email, address, className, board, course, batch } = req.body;

  if (!name || !mobile) {
    return res.status(400).json({ success: false, message: 'Student Name and Mobile number are required.' });
  }

  const studentId = `STU-2026-${Math.floor(100 + Math.random() * 900)}`;
  const admissionDate = new Date().toISOString().split('T')[0];

  try {
    if (isTiDBConnected) {
      const [result] = await pool.query(
        `INSERT INTO students (studentId, name, dob, gender, parentName, mobile, email, address, className, board, course, batch, admissionDate, status)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'ACTIVE')`,
        [studentId, name, dob || '', gender || 'Male', parentName || '', mobile, email || '', address || '', className || 'Class 10', board || 'CBSE', course || 'Class 5th to 10th Academics', batch || 'Morning (8:00 AM - 11:00 AM)', admissionDate]
      );

      const newStudent = {
        id: result.insertId, studentId, name, dob, gender, parentName, mobile, email, address, className, board, course, batch, admissionDate, status: 'ACTIVE'
      };

      await recordAuditLog({ req, action: 'CREATE_STUDENT', targetEntity: 'students', targetRecordId: studentId, metadata: { name, className, mobile } });

      return res.json({ success: true, message: 'Student enrolled successfully!', student: newStudent });
    }

    const db = readDB();
    const newStudent = {
      id: Date.now(), studentId, name, dob, gender, parentName, mobile, email, address, className, board, course, batch, admissionDate, status: 'ACTIVE'
    };

    db.students.unshift(newStudent);
    writeDB(db);

    await recordAuditLog({ req, action: 'CREATE_STUDENT', targetEntity: 'students', targetRecordId: studentId, metadata: { name, className, mobile } });

    return res.json({ success: true, message: 'Student enrolled successfully!', student: newStudent });
  } catch (error) {
    next(error);
  }
});

// PUT /api/students/:id - Edit student (Admin only)
router.put('/students/:id', verifyRole(['ADMIN']), async (req, res, next) => {
  const { id } = req.params;
  const { name, parentName, mobile, email, className, board, course, status } = req.body;

  try {
    if (isTiDBConnected) {
      await pool.query(
        `UPDATE students SET name=?, parentName=?, mobile=?, email=?, className=?, board=?, course=?, status=? WHERE id=?`,
        [name, parentName, mobile, email, className, board, course, status, id]
      );
      await recordAuditLog({ req, action: 'UPDATE_STUDENT', targetEntity: 'students', targetRecordId: id, metadata: { name, status } });
      return res.json({ success: true, message: 'Student details updated successfully!' });
    }

    const db = readDB();
    const index = db.students.findIndex(s => String(s.id) === String(id));
    if (index !== -1) {
      db.students[index] = { ...db.students[index], name, parentName, mobile, email, className, board, course, status };
      writeDB(db);
    }
    await recordAuditLog({ req, action: 'UPDATE_STUDENT', targetEntity: 'students', targetRecordId: id, metadata: { name, status } });
    return res.json({ success: true, message: 'Student details updated successfully!' });
  } catch (error) {
    next(error);
  }
});

export default router;
