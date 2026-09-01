import express from 'express';
import pool, { isTiDBConnected } from '../database.js';
import { readDB } from '../db.js';
import { getTeacherAssignedClasses } from '../services/teacherService.js';

const router = express.Router();

/**
 * 🔍 GET /api/search - Role-Based Global Search (Strict Backend Authorization Enforced)
 */
router.get('/search', async (req, res, next) => {
  const query = (req.query.q || '').trim();
  if (!query || query.length < 2) {
    return res.json({ success: true, count: 0, results: {} });
  }

  const userRole = (req.user?.role || 'GUEST').toUpperCase();
  const verifiedStudentId = req.user?.studentId;
  const userEmail = req.user?.email;

  try {
    let studentClass = null;
    let teacherAssignedClasses = [];

    if (userRole === 'STUDENT' && verifiedStudentId) {
      if (isTiDBConnected) {
        const [stRows] = await pool.query('SELECT className FROM students WHERE studentId = ?', [verifiedStudentId]);
        if (stRows.length > 0) studentClass = stRows[0].className;
      } else {
        const db = readDB();
        const st = (db.students || []).find(s => s.studentId === verifiedStudentId);
        if (st) studentClass = st.className;
      }
    } else if (userRole === 'TEACHER') {
      teacherAssignedClasses = await getTeacherAssignedClasses(userEmail, req.user?.id);
    }

    const searchTerm = `%${query}%`;
    const results = {
      students: [],
      teachers: [],
      materials: [],
      assignments: [],
      fees: [],
      calendar: [],
      notifications: []
    };

    if (isTiDBConnected) {
      // 1. STUDENTS SEARCH
      if (userRole === 'ADMIN') {
        const [rows] = await pool.query(
          'SELECT studentId, name, className, board, mobile FROM students WHERE name LIKE ? OR studentId LIKE ? OR className LIKE ? OR mobile LIKE ? LIMIT 10',
          [searchTerm, searchTerm, searchTerm, searchTerm]
        );
        results.students = rows;
      } else if (userRole === 'TEACHER' && teacherAssignedClasses.length > 0) {
        const [rows] = await pool.query(
          `SELECT studentId, name, className, board, mobile FROM students WHERE (name LIKE ? OR studentId LIKE ?) AND className IN (${teacherAssignedClasses.map(() => '?').join(',')}) LIMIT 10`,
          [searchTerm, searchTerm, ...teacherAssignedClasses]
        );
        results.students = rows;
      } else if (userRole === 'STUDENT' && verifiedStudentId) {
        const [rows] = await pool.query(
          'SELECT studentId, name, className, board FROM students WHERE studentId = ? AND (name LIKE ? OR studentId LIKE ?)',
          [verifiedStudentId, searchTerm, searchTerm]
        );
        results.students = rows;
      }

      // 2. TEACHERS SEARCH (Admin & Teacher only)
      if (userRole === 'ADMIN' || userRole === 'TEACHER') {
        const [rows] = await pool.query(
          'SELECT teacherId, name, email, subjects, classes FROM teachers WHERE name LIKE ? OR teacherId LIKE ? OR subjects LIKE ? LIMIT 10',
          [searchTerm, searchTerm, searchTerm]
        );
        results.teachers = rows;
      }

      // 3. MATERIALS SEARCH
      let matQuery = 'SELECT id, title, category, className, fileUrl FROM materials WHERE (title LIKE ? OR category LIKE ? OR className LIKE ?)';
      const matParams = [searchTerm, searchTerm, searchTerm];

      if (userRole === 'STUDENT' && studentClass) {
        matQuery += ' AND (className = ? OR className = "All Classes" OR className IS NULL)';
        matParams.push(studentClass);
      } else if (userRole === 'TEACHER' && teacherAssignedClasses.length > 0) {
        matQuery += ` AND (className = "All Classes" OR className IN (${teacherAssignedClasses.map(() => '?').join(',')}))`;
        matParams.push(...teacherAssignedClasses);
      }
      matQuery += ' LIMIT 10';
      const [matRows] = await pool.query(matQuery, matParams);
      results.materials = matRows;

      // 4. ASSIGNMENTS SEARCH
      let asQuery = 'SELECT id, title, description, className, subject, dueDate FROM assignments WHERE (title LIKE ? OR description LIKE ? OR subject LIKE ?)';
      const asParams = [searchTerm, searchTerm, searchTerm];

      if (userRole === 'STUDENT' && studentClass) {
        asQuery += ' AND (className = ? OR className = "All Classes")';
        asParams.push(studentClass);
      } else if (userRole === 'TEACHER' && teacherAssignedClasses.length > 0) {
        asQuery += ` AND (className = "All Classes" OR className IN (${teacherAssignedClasses.map(() => '?').join(',')}))`;
        asParams.push(...teacherAssignedClasses);
      }
      asQuery += ' LIMIT 10';
      const [asRows] = await pool.query(asQuery, asParams);
      results.assignments = asRows;

      // 5. FEES SEARCH (Admin & Student own records)
      if (userRole === 'ADMIN') {
        const [feeRows] = await pool.query(
          'SELECT receiptNo, studentId, studentName, className, totalAmount, paidAmount, pendingAmount, paymentStatus FROM fees WHERE receiptNo LIKE ? OR studentName LIKE ? OR studentId LIKE ? LIMIT 10',
          [searchTerm, searchTerm, searchTerm]
        );
        results.fees = feeRows;
      } else if (userRole === 'STUDENT' && verifiedStudentId) {
        const [feeRows] = await pool.query(
          'SELECT receiptNo, studentId, studentName, totalAmount, paidAmount, pendingAmount, paymentStatus FROM fees WHERE studentId = ? AND (receiptNo LIKE ? OR studentName LIKE ?)',
          [verifiedStudentId, searchTerm, searchTerm]
        );
        results.fees = feeRows;
      }

      // 6. CALENDAR EVENTS SEARCH
      let calQuery = 'SELECT id, title, description, eventDate, eventType, targetClass FROM calendar_events WHERE (title LIKE ? OR description LIKE ? OR eventType LIKE ?)';
      const calParams = [searchTerm, searchTerm, searchTerm];

      if (userRole === 'STUDENT') {
        calQuery += ' AND (status = "PUBLISHED" OR status IS NULL)';
        if (studentClass) {
          calQuery += ' AND (targetClass = ? OR targetClass = "All Classes" OR targetClass IS NULL)';
          calParams.push(studentClass);
        }
      }
      calQuery += ' LIMIT 10';
      const [calRows] = await pool.query(calQuery, calParams);
      results.calendar = calRows;

      const totalCount = Object.values(results).reduce((acc, arr) => acc + arr.length, 0);
      return res.json({ success: true, count: totalCount, results });
    }

    // Local DB Fallback
    const db = readDB();
    const qLower = query.toLowerCase();

    // Students
    let dbStudents = db.students || [];
    if (userRole === 'STUDENT' && verifiedStudentId) {
      dbStudents = dbStudents.filter(s => s.studentId === verifiedStudentId);
    } else if (userRole === 'TEACHER' && teacherAssignedClasses.length > 0) {
      dbStudents = dbStudents.filter(s => teacherAssignedClasses.includes(s.className));
    }
    results.students = dbStudents.filter(s =>
      s.name.toLowerCase().includes(qLower) || s.studentId.toLowerCase().includes(qLower) || s.className.toLowerCase().includes(qLower)
    ).slice(0, 10);

    // Materials
    let dbMaterials = db.materials || [];
    if (userRole === 'STUDENT' && studentClass) {
      dbMaterials = dbMaterials.filter(m => !m.className || m.className === 'All Classes' || m.className === studentClass);
    }
    results.materials = dbMaterials.filter(m =>
      m.title.toLowerCase().includes(qLower) || m.category.toLowerCase().includes(qLower)
    ).slice(0, 10);

    // Assignments
    let dbAssignments = db.assignments || [];
    if (userRole === 'STUDENT' && studentClass) {
      dbAssignments = dbAssignments.filter(a => !a.className || a.className === 'All Classes' || a.className === studentClass);
    }
    results.assignments = dbAssignments.filter(a =>
      a.title.toLowerCase().includes(qLower) || (a.description || '').toLowerCase().includes(qLower)
    ).slice(0, 10);

    // Fees
    if (userRole === 'ADMIN') {
      results.fees = (db.fees || []).filter(f =>
        (f.receiptNo || '').toLowerCase().includes(qLower) || f.studentName.toLowerCase().includes(qLower)
      ).slice(0, 10);
    } else if (userRole === 'STUDENT' && verifiedStudentId) {
      results.fees = (db.fees || []).filter(f =>
        f.studentId === verifiedStudentId && ((f.receiptNo || '').toLowerCase().includes(qLower) || f.studentName.toLowerCase().includes(qLower))
      ).slice(0, 10);
    }

    const totalCount = Object.values(results).reduce((acc, arr) => acc + arr.length, 0);
    return res.json({ success: true, count: totalCount, results });
  } catch (error) {
    next(error);
  }
});

export default router;
