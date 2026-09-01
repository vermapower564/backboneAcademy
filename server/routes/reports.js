import express from 'express';
import { readDB } from '../db.js';
import pool, { isTiDBConnected } from '../database.js';
import { verifyRole } from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * 📊 GET /api/reports/summary - Executive Metrics & Class Analytics (Admin Only)
 */
router.get('/reports/summary', verifyRole(['ADMIN']), async (req, res, next) => {
  try {
    if (isTiDBConnected) {
      const [[{ totalStudents }]] = await pool.query('SELECT COUNT(*) as totalStudents FROM students WHERE status = "ACTIVE"');
      const [[{ totalTeachers }]] = await pool.query('SELECT COUNT(*) as totalTeachers FROM teachers WHERE status = "ACTIVE"');
      const [[{ totalBookings }]] = await pool.query('SELECT COUNT(*) as totalBookings FROM demo_bookings');
      const [[{ totalFeeCollected }]] = await pool.query('SELECT COALESCE(SUM(paidAmount), 0) as totalFeeCollected FROM fees');
      const [[{ totalFeePending }]] = await pool.query('SELECT COALESCE(SUM(pendingAmount), 0) as totalFeePending FROM fees');
      const [[{ totalAssignments }]] = await pool.query('SELECT COUNT(*) as totalAssignments FROM assignments');
      const [[{ totalMaterials }]] = await pool.query('SELECT COUNT(*) as totalMaterials FROM materials');

      return res.json({
        success: true,
        summary: {
          totalStudents,
          totalTeachers,
          totalBookings,
          totalFeeCollected: Number(totalFeeCollected),
          totalFeePending: Number(totalFeePending),
          totalAssignments,
          totalMaterials,
          activeCoursesCount: 12
        }
      });
    }

    const db = readDB();
    const totalStudents = (db.students || []).filter(s => s.status === 'ACTIVE').length;
    const totalTeachers = (db.teachers || []).filter(t => t.status === 'ACTIVE').length;
    const totalBookings = (db.demoBookings || []).length;
    const totalFeeCollected = (db.fees || []).reduce((acc, f) => acc + Number(f.paidAmount || 0), 0);
    const totalFeePending = (db.fees || []).reduce((acc, f) => acc + Number(f.pendingAmount || 0), 0);
    const totalAssignments = (db.assignments || []).length;
    const totalMaterials = (db.materials || []).length;

    return res.json({
      success: true,
      summary: {
        totalStudents,
        totalTeachers,
        totalBookings,
        totalFeeCollected,
        totalFeePending,
        totalAssignments,
        totalMaterials,
        activeCoursesCount: 12
      }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * 📋 GET /api/reports/audit-logs - Administrative Audit Logs (Admin Only)
 */
router.get('/reports/audit-logs', verifyRole(['ADMIN']), async (req, res, next) => {
  try {
    if (isTiDBConnected) {
      const [rows] = await pool.query('SELECT * FROM audit_logs ORDER BY id DESC LIMIT 100');
      return res.json({ success: true, count: rows.length, logs: rows });
    }

    const db = readDB();
    const logs = (db.auditLogs || []).slice(0, 100);
    return res.json({ success: true, count: logs.length, logs });
  } catch (error) {
    next(error);
  }
});

/**
 * 📥 GET /api/reports/export/students - Students Roster CSV Export (Admin Only)
 */
router.get('/reports/export/students', verifyRole(['ADMIN']), async (req, res, next) => {
  try {
    let students = [];
    if (isTiDBConnected) {
      const [rows] = await pool.query('SELECT * FROM students ORDER BY id DESC');
      students = rows;
    } else {
      students = readDB().students || [];
    }

    let csv = 'Student ID,Name,Parent Name,Class,Board,Mobile,Email,Status\n';
    students.forEach(s => {
      csv += `"${s.studentId}","${s.name}","${s.parentName || ''}","${s.className}","${s.board}","${s.mobile}","${s.email || ''}","${s.status}"\n`;
    });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="Backbone_Academy_Students.csv"');
    return res.status(200).send(csv);
  } catch (error) {
    next(error);
  }
});

/**
 * 📥 GET /api/reports/export/fees - Fee Collection CSV Export (Admin Only)
 */
router.get('/reports/export/fees', verifyRole(['ADMIN']), async (req, res, next) => {
  try {
    let fees = [];
    if (isTiDBConnected) {
      const [rows] = await pool.query('SELECT * FROM fees ORDER BY id DESC');
      fees = rows;
    } else {
      fees = readDB().fees || [];
    }

    let csv = 'Receipt No,Student ID,Student Name,Class,Total Fee,Paid Amount,Pending Balance,Status,Due Date\n';
    fees.forEach(f => {
      csv += `"${f.receiptNo || 'N/A'}","${f.studentId}","${f.studentName}","${f.className}",${f.totalAmount},${f.paidAmount},${f.pendingAmount},"${f.paymentStatus}","${f.dueDate || ''}"\n`;
    });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="Backbone_Academy_Fees.csv"');
    return res.status(200).send(csv);
  } catch (error) {
    next(error);
  }
});

/**
 * 📥 GET /api/reports/export/attendance - Class Attendance CSV Export (Admin Only)
 */
router.get('/reports/export/attendance', verifyRole(['ADMIN']), async (req, res, next) => {
  try {
    let attendance = [];
    if (isTiDBConnected) {
      const [rows] = await pool.query('SELECT * FROM attendance ORDER BY date DESC');
      attendance = rows;
    } else {
      attendance = readDB().attendance || [];
    }

    let csv = 'Date,Class,Student ID,Status,Marked By\n';
    attendance.forEach(a => {
      csv += `"${a.date}","${a.className}","${a.studentId}","${a.status}","${a.markedBy || ''}"\n`;
    });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="Backbone_Academy_Attendance.csv"');
    return res.status(200).send(csv);
  } catch (error) {
    next(error);
  }
});

/**
 * 📥 GET /api/reports/export/exams - Exam Results CSV Export (Admin Only)
 */
router.get('/reports/export/exams', verifyRole(['ADMIN']), async (req, res, next) => {
  try {
    let results = [];
    if (isTiDBConnected) {
      const [rows] = await pool.query('SELECT * FROM exam_results ORDER BY id DESC');
      results = rows;
    } else {
      results = readDB().examResults || [];
    }

    let csv = 'Student ID,Student Name,Class,Subject,Marks Obtained,Max Marks,Percentage,Grade\n';
    results.forEach(r => {
      csv += `"${r.studentId}","${r.studentName}","${r.className}","${r.subject}",${r.marksObtained},${r.maxMarks},${r.percentage},"${r.grade}"\n`;
    });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="Backbone_Academy_Exam_Results.csv"');
    return res.status(200).send(csv);
  } catch (error) {
    next(error);
  }
});

export default router;
