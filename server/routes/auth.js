import express from 'express';
import bcrypt from 'bcryptjs';
import { readDB, writeDB } from '../db.js';
import pool, { isTiDBConnected, updateUserPasswordHash } from '../database.js';
import { validateRegister, validateLogin } from '../middleware/validation.js';
import { sendWelcomeEmail } from '../email.js';
import { generateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Helper: Check if string is bcrypt hash
function isBcryptHash(str) {
  return typeof str === 'string' && (str.startsWith('$2a$') || str.startsWith('$2b$') || str.startsWith('$2y$'));
}

/**
 * 🔐 POST /api/auth/register
 */
router.post('/register', validateRegister, async (req, res, next) => {
  const { name, email, password, role } = req.body;
  const userRole = (role && ['ADMIN', 'TEACHER', 'STUDENT'].includes(role.toUpperCase())) ? role.toUpperCase() : 'STUDENT';
  const studentId = userRole === 'STUDENT' ? `STU-2026-${Math.floor(100 + Math.random() * 900)}` : null;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    let userId = Date.now();

    if (isTiDBConnected) {
      const [existing] = await pool.query('SELECT id FROM users WHERE LOWER(email) = LOWER(?)', [email]);
      if (existing.length > 0) {
        return res.status(400).json({ success: false, message: 'An account with this email already exists!' });
      }

      const [result] = await pool.query(
        'INSERT INTO users (name, email, password, role, studentId) VALUES (?, ?, ?, ?, ?)',
        [name, email, hashedPassword, userRole, studentId]
      );

      userId = result.insertId;
    } else {
      const db = readDB();
      const existingUser = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());

      if (existingUser) {
        return res.status(400).json({ success: false, message: 'An account with this email already exists!' });
      }

      const newUser = {
        id: userId,
        name,
        email,
        password: hashedPassword,
        role: userRole,
        studentId,
        createdAt: new Date().toISOString()
      };

      db.users.push(newUser);
      writeDB(db);
    }

    const userData = { id: userId, name, email, role: userRole, studentId };
    const token = generateToken(userData);

    // Async trigger welcome email
    sendWelcomeEmail({ name, email }).catch(err => console.error('Welcome email error:', err.message));

    return res.json({
      success: true,
      message: 'Account created successfully!',
      token,
      user: userData
    });
  } catch (error) {
    next(error);
  }
});

/**
 * 🔐 POST /api/auth/login
 */
router.post('/login', validateLogin, async (req, res, next) => {
  const { email, password } = req.body;

  try {
    let user = null;

    if (isTiDBConnected) {
      const [users] = await pool.query(
        'SELECT id, name, email, password, role, studentId FROM users WHERE LOWER(email) = LOWER(?)',
        [email]
      );
      if (users.length > 0) {
        user = users[0];
      }
    } else {
      const db = readDB();
      const found = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (found) {
        user = { ...found };
      }
    }

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    let isPasswordValid = false;

    if (isBcryptHash(user.password)) {
      isPasswordValid = await bcrypt.compare(password, user.password);
    } else {
      // Legacy dev account plain-text check
      if (password === user.password) {
        isPasswordValid = true;

        // Auto-upgrade legacy plain-text password to bcrypt hash
        const newHash = await bcrypt.hash(password, 10);
        if (isTiDBConnected) {
          await updateUserPasswordHash(user.id, newHash);
        } else {
          const db = readDB();
          const dbUser = db.users.find(u => u.id === user.id);
          if (dbUser) {
            dbUser.password = newHash;
            writeDB(db);
          }
        }
      }
    }

    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const userData = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role || 'STUDENT',
      studentId: user.studentId || (user.email === 'aarav@backbone.edu' ? 'STU-2026-001' : null)
    };

    const token = generateToken(userData);

    return res.json({
      success: true,
      message: `Welcome back, ${user.name}!`,
      token,
      user: userData
    });
  } catch (error) {
    next(error);
  }
});

export default router;
