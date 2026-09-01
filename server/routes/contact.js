import express from 'express';
import { readDB, writeDB } from '../db.js';
import pool, { isTiDBConnected } from '../database.js';
import { validateContact } from '../middleware/validation.js';
import { sendContactNotification } from '../email.js';

const router = express.Router();

/**
 * 📞 POST /api/contact
 */
router.post('/contact', validateContact, async (req, res, next) => {
  const { name, email, phone, message } = req.body;

  try {
    if (isTiDBConnected) {
      await pool.query(
        'INSERT INTO contacts (name, email, phone, message) VALUES (?, ?, ?, ?)',
        [name, email, phone, message]
      );

      sendContactNotification({ name, email, phone, message }).catch(err => console.error('Contact email error:', err.message));

      return res.json({ success: true, message: 'Your message has been received by Backbone Academy!' });
    }

    // Fallback JSON DB
    const db = readDB();
    const newContact = {
      id: Date.now(),
      name,
      email,
      phone,
      message,
      receivedAt: new Date().toISOString()
    };

    db.contacts.push(newContact);
    writeDB(db);

    sendContactNotification({ name, email, phone, message }).catch(err => console.error('Contact email error:', err.message));

    return res.json({ success: true, message: 'Your message has been received by Backbone Academy!' });
  } catch (error) {
    next(error);
  }
});

export default router;
