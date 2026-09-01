import express from 'express';
import { readDB, writeDB } from '../db.js';
import pool, { isTiDBConnected } from '../database.js';
import { validateReview } from '../middleware/validation.js';

const router = express.Router();

/**
 * ⭐ GET /api/reviews
 */
router.get('/reviews', async (req, res, next) => {
  try {
    if (isTiDBConnected) {
      const [rows] = await pool.query('SELECT * FROM reviews ORDER BY id DESC');
      return res.json({ success: true, reviews: rows });
    }

    const db = readDB();
    return res.json({ success: true, reviews: db.reviews });
  } catch (error) {
    next(error);
  }
});

/**
 * ⭐ POST /api/reviews
 */
router.post('/reviews', validateReview, async (req, res, next) => {
  const { name, course, rating, comment } = req.body;

  try {
    if (isTiDBConnected) {
      const [result] = await pool.query(
        'INSERT INTO reviews (name, course, rating, comment, date) VALUES (?, ?, ?, ?, ?)',
        [name, course, rating, comment, 'Just now']
      );

      const newReview = {
        id: result.insertId,
        name,
        course,
        rating,
        date: 'Just now',
        comment
      };

      return res.json({
        success: true,
        message: 'Thank you for your feedback!',
        review: newReview
      });
    }

    // Fallback JSON DB
    const db = readDB();
    const newReview = {
      id: Date.now(),
      name,
      course,
      rating,
      date: 'Just now',
      comment
    };

    db.reviews.unshift(newReview);
    writeDB(db);

    return res.json({
      success: true,
      message: 'Thank you for your feedback!',
      review: newReview
    });
  } catch (error) {
    next(error);
  }
});

export default router;
