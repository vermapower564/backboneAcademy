import express from 'express';
import { readDB } from '../db.js';
import pool, { isTiDBConnected } from '../database.js';
import { verifyRole } from '../middleware/authMiddleware.js';

const router = express.Router();

// GET /api/reports/summary - Admin Overview Executive Summary
router.get('/reports/summary', verifyRole(['ADMIN']), async (req, res, next) => {
  try {
    if (isTiDBConnected) {
      const [[{ totalStudents }]] = await pool.query('SELECT COUNT(*) as totalStudents FROM students WHERE status="ACTIVE"');
      const [[{ totalTeachers }]] = await pool.query('SELECT COUNT(*) as totalTeachers FROM teachers WHERE status="ACTIVE"');
      const [[{ totalBookings }]] = await pool.query('SELECT COUNT(*) as totalBookings FROM demo_bookings');
      const [[{ totalFeeCollected }]] = await pool.query('SELECT SUM(paidAmount) as totalFeeCollected FROM fees');
      const [[{ totalFeePending }]] = await pool.query('SELECT SUM(pendingAmount) as totalFeePending FROM fees');

      return res.json({
        success: true,
        summary: {
          totalStudents: totalStudents || 0,
          totalTeachers: totalTeachers || 0,
          totalBookings: totalBookings || 0,
          totalFeeCollected: Number(totalFeeCollected || 0),
          totalFeePending: Number(totalFeePending || 0),
          activeCoursesCount: 12
        }
      });
    }

    const db = readDB();
    const students = db.students || [];
    const teachers = db.teachers || [];
    const bookings = db.demoBookings || [];
    const fees = db.fees || [];

    const totalFeeCollected = fees.reduce((acc, f) => acc + Number(f.paidAmount || 0), 0);
    const totalFeePending = fees.reduce((acc, f) => acc + Number(f.pendingAmount || 0), 0);

    return res.json({
      success: true,
      summary: {
        totalStudents: students.length,
        totalTeachers: teachers.length,
        totalBookings: bookings.length,
        totalFeeCollected,
        totalFeePending,
        activeCoursesCount: 12
      }
    });
  } catch (error) {
    next(error);
  }
});

export default router;
