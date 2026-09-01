import express from 'express';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { readDB, writeDB } from '../db.js';
import pool, { isTiDBConnected, updateUserPasswordHash } from '../database.js';
import { validateRegister, validateLogin } from '../middleware/validation.js';
import { sendWelcomeEmail } from '../email.js';
import { generateToken, verifyToken } from '../middleware/authMiddleware.js';
import mailService from '../services/mailService.js';
import { recordAuditLog } from '../middleware/auditLogger.js';

const router = express.Router();

// Helper: Check if string is bcrypt hash
function isBcryptHash(str) {
  return typeof str === 'string' && (str.startsWith('$2a$') || str.startsWith('$2b$') || str.startsWith('$2y$'));
}

// Helper: SHA256 Hash for OTP Code
function hashOTP(otp) {
  return crypto.createHash('sha256').update(String(otp)).digest('hex');
}

/**
 * 🔐 POST /api/auth/register
 */
router.post('/register', validateRegister, async (req, res, next) => {
  const { name, email, password, mobile, className } = req.body;
  // Public registration is strictly locked to STUDENT role for security
  const userRole = 'STUDENT';
  const studentId = `STU-2026-${Math.floor(100 + Math.random() * 900)}`;

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

/**
 * 🔑 POST /api/auth/forgot-password - Send Email OTP
 */
router.post('/forgot-password', async (req, res, next) => {
  const { email } = req.body;
  const genericResponse = {
    success: true,
    message: 'If an account with this email exists, a 6-digit OTP code has been sent to your email.'
  };

  if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    return res.status(400).json({ success: false, message: 'Please enter a valid email address.' });
  }

  const cleanEmail = email.trim().toLowerCase();

  try {
    // Check if user exists (without revealing status to caller)
    let userExists = false;
    let userName = 'Student';

    if (isTiDBConnected) {
      const [users] = await pool.query('SELECT id, name FROM users WHERE LOWER(email) = ?', [cleanEmail]);
      if (users.length > 0) {
        userExists = true;
        userName = users[0].name;
      }
    } else {
      const db = readDB();
      const found = (db.users || []).find(u => u.email.toLowerCase() === cleanEmail);
      if (found) {
        userExists = true;
        userName = found.name;
      }
    }

    if (!userExists) {
      return res.json(genericResponse);
    }

    // Rate Limit Check: 60 seconds cooldown for same email
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 10 * 60 * 1000); // 10 mins expiry

    if (isTiDBConnected) {
      const [recent] = await pool.query(
        'SELECT createdAt FROM password_resets WHERE LOWER(email) = ? AND TIMESTAMPDIFF(SECOND, createdAt, NOW()) < 60',
        [cleanEmail]
      );
      if (recent.length > 0) {
        return res.json(genericResponse);
      }
    } else {
      const db = readDB();
      const recent = (db.passwordResets || []).find(r => r.email.toLowerCase() === cleanEmail && (now - new Date(r.createdAt)) < 60000);
      if (recent) {
        return res.json(genericResponse);
      }
    }

    // Generate cryptographically secure 6-digit OTP
    const rawOtp = crypto.randomInt(100000, 999999).toString();
    const otpHash = hashOTP(rawOtp);

    // Save hashed OTP to database
    if (isTiDBConnected) {
      await pool.query('DELETE FROM password_resets WHERE LOWER(email) = ?', [cleanEmail]);
      await pool.query(
        'INSERT INTO password_resets (email, otpHash, attempts, createdAt, expiresAt) VALUES (?, ?, 0, NOW(), ?)',
        [cleanEmail, otpHash, expiresAt]
      );
    } else {
      const db = readDB();
      if (!db.passwordResets) db.passwordResets = [];
      db.passwordResets = db.passwordResets.filter(r => r.email.toLowerCase() !== cleanEmail);
      db.passwordResets.push({
        id: Date.now(),
        email: cleanEmail,
        otpHash,
        attempts: 0,
        createdAt: now.toISOString(),
        expiresAt: expiresAt.toISOString()
      });
      writeDB(db);
    }

    // Dispatch email via Nodemailer SMTP service asynchronously
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; max-width: 500px; margin: 0 auto; border: 1px solid #eee; border-radius: 12px; padding: 24px;">
        <h2 style="color: #E63946; margin-top: 0;">Password Recovery OTP</h2>
        <p>Hello <strong>${userName}</strong>,</p>
        <p>You have requested to reset your Backbone Academy account password.</p>
        <div style="background: #F8FAFC; padding: 16px; text-align: center; borderRadius: 8px; margin: 20px 0; border: 1px dashed #E63946;">
          <span style="font-size: 2.2rem; fontWeight: 900; letter-spacing: 6px; color: #E63946;">${rawOtp}</span>
        </div>
        <p style="font-size: 0.85rem; color: #666;">This OTP is valid for <strong>10 minutes</strong>. Do not share this code with anyone.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
        <p style="font-size: 0.78rem; color: #888;">Backbone Academy Security Desk | Pandra Ranchi</p>
      </div>
    `;

    mailService.sendEmail({
      to: cleanEmail,
      subject: '🔑 Your Backbone Academy Password Reset OTP Code',
      html: emailHtml
    }).catch(err => console.error('Failed to send OTP email:', err.message));

    return res.json(genericResponse);
  } catch (error) {
    next(error);
  }
});

/**
 * 🔑 POST /api/auth/verify-otp - Verify 6-Digit OTP Code
 */
router.post('/verify-otp', async (req, res, next) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ success: false, message: 'Email and 6-digit OTP code are required.' });
  }

  const cleanEmail = email.trim().toLowerCase();
  const inputHash = hashOTP(otp.trim());

  try {
    let resetRecord = null;

    if (isTiDBConnected) {
      const [rows] = await pool.query(
        'SELECT * FROM password_resets WHERE LOWER(email) = ? AND expiresAt > NOW() ORDER BY id DESC LIMIT 1',
        [cleanEmail]
      );
      if (rows.length > 0) resetRecord = rows[0];
    } else {
      const db = readDB();
      const now = new Date();
      const found = (db.passwordResets || []).find(r => r.email.toLowerCase() === cleanEmail && new Date(r.expiresAt) > now);
      if (found) resetRecord = { ...found };
    }

    if (!resetRecord) {
      return res.status(400).json({ success: false, message: 'Invalid or expired OTP code. Please request a new OTP.' });
    }

    if (Number(resetRecord.attempts) >= 5) {
      return res.status(400).json({ success: false, message: 'Maximum OTP verification attempts exceeded. Please request a new OTP.' });
    }

    if (resetRecord.otpHash !== inputHash) {
      // Increment attempt counter
      const newAttempts = Number(resetRecord.attempts) + 1;
      if (isTiDBConnected) {
        await pool.query('UPDATE password_resets SET attempts = ? WHERE id = ?', [newAttempts, resetRecord.id]);
      } else {
        const db = readDB();
        const rec = db.passwordResets.find(r => r.id === resetRecord.id);
        if (rec) { rec.attempts = newAttempts; writeDB(db); }
      }

      return res.status(400).json({
        success: false,
        message: `Invalid OTP code. Remaining attempts: ${Math.max(0, 5 - newAttempts)}`
      });
    }

    // Generate temporary 15-minute reset token
    const resetToken = generateToken({ email: cleanEmail, type: 'PASSWORD_RESET' });

    return res.json({
      success: true,
      message: 'OTP verified successfully! Please enter your new password.',
      resetToken
    });
  } catch (error) {
    next(error);
  }
});

/**
 * 🔑 POST /api/auth/reset-password - Create New Password
 */
router.post('/reset-password', async (req, res, next) => {
  const { email, resetToken, newPassword } = req.body;

  if (!email || !resetToken || !newPassword) {
    return res.status(400).json({ success: false, message: 'Email, reset token, and new password are required.' });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({ success: false, message: 'New password must be at least 6 characters long.' });
  }

  const cleanEmail = email.trim().toLowerCase();

  try {
    const decoded = verifyToken(resetToken);
    if (!decoded || decoded.type !== 'PASSWORD_RESET' || decoded.email !== cleanEmail) {
      return res.status(401).json({ success: false, message: 'Invalid or expired reset session. Please verify OTP again.' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    if (isTiDBConnected) {
      await pool.query('UPDATE users SET password = ? WHERE LOWER(email) = ?', [hashedPassword, cleanEmail]);
      await pool.query('DELETE FROM password_resets WHERE LOWER(email) = ?', [cleanEmail]);
    } else {
      const db = readDB();
      const user = (db.users || []).find(u => u.email.toLowerCase() === cleanEmail);
      if (user) {
        user.password = hashedPassword;
        db.passwordResets = (db.passwordResets || []).filter(r => r.email.toLowerCase() !== cleanEmail);
        writeDB(db);
      }
    }

    await recordAuditLog({ req, action: 'PASSWORD_RESET', targetEntity: 'users', targetRecordId: cleanEmail, metadata: { email: cleanEmail } });

    return res.json({
      success: true,
      message: 'Password updated successfully! You can now log in with your new password.'
    });
  } catch (error) {
    next(error);
  }
});

export default router;
