import express from 'express';
import { readDB } from '../db.js';
import pool, { isTiDBConnected } from '../database.js';
import { verifyRole } from '../middleware/authMiddleware.js';

const router = express.Router();

// GET /api/reports/summary - Executive Metrics (Admin Only)
router.get('/reports/summary', verifyRole(['ADMIN']), async (req, res, next) => {
  try {
    if (isTiDBConnected) {
      const [[{ totalStudents }]] = await pool.query('SELECT COUNT(*) as totalStudents FROM students WHERE status = "ACTIVE"');
      const [[{ totalTeachers }]] = await pool.query('SELECT COUNT(*) as totalTeachers FROM teachers WHERE status = "ACTIVE"');
      const [[{ totalBookings }]] = await pool.query('SELECT COUNT(*) as totalBookings FROM demo_bookings');
      const [[{ totalFeeCollected }]] = await pool.query('SELECT COALESCE(SUM(paidAmount), 0) as totalFeeCollected FROM fees');
      const [[{ totalFeePending }]] = await pool.query('SELECT COALESCE(SUM(pendingAmount), 0) as totalFeePending FROM fees');

      return res.json({
        success: true,
        summary: {
          totalStudents,
          totalTeachers,
          totalBookings,
          totalFeeCollected: Number(totalFeeCollected),
          totalFeePending: Number(totalFeePending),
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

    return res.json({
      success: true,
      summary: {
        totalStudents,
        totalTeachers,
        totalBookings,
        totalFeeCollected,
        totalFeePending,
        activeCoursesCount: 12
      }
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/reports/audit-logs - Administrative Audit Logs (Admin Only)
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

// GET /api/reports/export/students - CSV Export (Admin Only)
router.get('/reports/export/students', verifyRole(['ADMIN']), async (req, res, next) => {
  try {
    let students = [];
    if (isTiDBConnected) {
      const [rows] = await pool.query('SELECT * FROM students ORDER BY id DESC');
      students = rows;
    } else {
      students = readDB().students || [];
    }

    let csv = 'Student ID,Name,Parent Name,Class,Board,Mobile,Status\n';
    students.forEach(s => {
      csv += `"${s.studentId}","${s.name}","${s.parentName || ''}","${s.className}","${s.board}","${s.mobile}","${s.status}"\n`;
    });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="Backbone_Academy_Students.csv"');
    return res.status(200).send(csv);
  } catch (error) {
    next(error);
  }
});

// GET /api/reports/export/fees - CSV Export (Admin Only)
router.get('/reports/export/fees', verifyRole(['ADMIN']), async (req, res, next) => {
  try {
    let fees = [];
    if (isTiDBConnected) {
      const [rows] = await pool.query('SELECT * FROM fees ORDER BY id DESC');
      fees = rows;
    } else {
      fees = readDB().fees || [];
    }

    let csv = 'Receipt No,Student Name,Class,Total Fee,Paid Fee,Pending Fee,Status\n';
    fees.forEach(f => {
      csv += `"${f.receiptNo || 'N/A'}","${f.studentName}","${f.className}",${f.totalAmount},${f.paidAmount},${f.pendingAmount},"${f.paymentStatus}"\n`;
    });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="Backbone_Academy_Fees.csv"');
    return res.status(200).send(csv);
  } catch (error) {
    next(error);
  }
});

export default router;
