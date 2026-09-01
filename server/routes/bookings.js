import express from 'express';
import { readDB, writeDB } from '../db.js';
import pool, { isTiDBConnected } from '../database.js';
import { validateBooking } from '../middleware/validation.js';
import { sendDemoBookingEmail } from '../email.js';

const router = express.Router();

/**
 * 🎁 POST /api/demo-booking
 */
router.post('/demo-booking', validateBooking, async (req, res, next) => {
  const { studentName, phone, course, timeSlot } = req.body;

  try {
    if (isTiDBConnected) {
      const [result] = await pool.query(
        'INSERT INTO demo_bookings (studentName, phone, course, timeSlot) VALUES (?, ?, ?, ?)',
        [studentName, phone, course, timeSlot]
      );

      const newBooking = {
        id: result.insertId,
        studentName,
        phone,
        course,
        timeSlot,
        bookedAt: new Date().toISOString()
      };

      // Async email notification
      sendDemoBookingEmail(newBooking).catch(err => console.error('Demo booking email error:', err.message));

      return res.json({
        success: true,
        message: '3 Free Demo Classes reserved successfully! Our team will contact you shortly.',
        booking: newBooking
      });
    }

    // Fallback JSON DB
    const db = readDB();
    const newBooking = {
      id: Date.now(),
      studentName,
      phone,
      course,
      timeSlot,
      bookedAt: new Date().toISOString()
    };

    db.demoBookings.push(newBooking);
    writeDB(db);

    // Async email notification
    sendDemoBookingEmail(newBooking).catch(err => console.error('Demo booking email error:', err.message));

    return res.json({
      success: true,
      message: '3 Free Demo Classes reserved successfully! Our team will contact you shortly.',
      booking: newBooking
    });
  } catch (error) {
    next(error);
  }
});

/**
 * 🎁 GET /api/demo-bookings
 */
router.get('/demo-bookings', async (req, res, next) => {
  try {
    if (isTiDBConnected) {
      const [rows] = await pool.query('SELECT * FROM demo_bookings ORDER BY id DESC');
      return res.json({ success: true, count: rows.length, bookings: rows });
    }

    const db = readDB();
    return res.json({ success: true, count: db.demoBookings.length, bookings: db.demoBookings });
  } catch (error) {
    next(error);
  }
});

export default router;
