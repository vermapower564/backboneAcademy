import express from 'express';
import pool, { isTiDBConnected } from '../database.js';
import { readDB, writeDB } from '../db.js';
import { verifyRole } from '../middleware/authMiddleware.js';
import { recordAuditLog } from '../middleware/auditLogger.js';
import { getTeacherAssignedClasses } from '../services/teacherService.js';

const router = express.Router();

/**
 * 🔔 GET /api/notifications - List & Query Centralized Notifications (RBAC Enforced)
 */
router.get('/notifications', async (req, res, next) => {
  const { type, isRead } = req.query;
  const userRole = (req.user?.role || 'GUEST').toUpperCase();
  const studentId = req.user?.studentId;
  const userEmail = req.user?.email;

  try {
    let studentClass = null;
    let teacherAssignedClasses = [];

    if (userRole === 'STUDENT' && studentId) {
      if (isTiDBConnected) {
        const [stRows] = await pool.query('SELECT className FROM students WHERE studentId = ?', [studentId]);
        if (stRows.length > 0) studentClass = stRows[0].className;
      } else {
        const db = readDB();
        const st = (db.students || []).find(s => s.studentId === studentId);
        if (st) studentClass = st.className;
      }
    } else if (userRole === 'TEACHER') {
      teacherAssignedClasses = await getTeacherAssignedClasses(userEmail, req.user?.id);
    }

    if (isTiDBConnected) {
      let query = 'SELECT * FROM notifications WHERE 1=1';
      const params = [];

      if (userRole === 'STUDENT') {
        query += ' AND (studentId = ? OR targetClass = ? OR targetClass = "All Classes" OR targetClass IS NULL OR targetClass = "")';
        params.push(studentId || '', studentClass || '');
      } else if (userRole === 'TEACHER') {
        if (teacherAssignedClasses.length > 0) {
          query += ` AND (targetClass = "All Classes" OR targetClass IN (${teacherAssignedClasses.map(() => '?').join(',')}))`;
          params.push(...teacherAssignedClasses);
        }
      }

      if (type) {
        query += ' AND type = ?';
        params.push(type);
      }

      if (isRead !== undefined) {
        query += ' AND isRead = ?';
        params.push(isRead === 'true' || isRead === '1' ? 1 : 0);
      }

      query += ' ORDER BY id DESC';

      const [rows] = await pool.query(query, params);
      const unreadCount = rows.filter(n => !n.isRead).length;
      return res.json({ success: true, unreadCount, count: rows.length, notifications: rows });
    }

    // Local DB Fallback
    const db = readDB();
    let notifs = [...(db.notifications || [])];

    if (userRole === 'STUDENT') {
      notifs = notifs.filter(n => 
        (n.studentId && n.studentId === studentId) ||
        !n.targetClass || n.targetClass === 'All Classes' ||
        (studentClass && n.targetClass === studentClass)
      );
    } else if (userRole === 'TEACHER') {
      notifs = notifs.filter(n => 
        !n.targetClass || n.targetClass === 'All Classes' || teacherAssignedClasses.includes(n.targetClass)
      );
    }

    if (type) {
      notifs = notifs.filter(n => n.type === type);
    }

    if (isRead !== undefined) {
      const boolRead = isRead === 'true' || isRead === '1';
      notifs = notifs.filter(n => Boolean(n.isRead) === boolRead);
    }

    notifs.reverse();
    const unreadCount = notifs.filter(n => !n.isRead).length;

    return res.json({ success: true, unreadCount, count: notifs.length, notifications: notifs });
  } catch (error) {
    next(error);
  }
});

/**
 * 📢 POST /api/notifications - Broadcast Notification (Admin & Teacher Only)
 */
router.post('/notifications', verifyRole(['ADMIN', 'TEACHER']), async (req, res, next) => {
  const { title, message, type, targetClass, studentId, relatedId } = req.body;

  if (!title || !message) {
    return res.status(400).json({ success: false, message: 'Notification title and message are required.' });
  }

  const userRole = (req.user?.role || 'GUEST').toUpperCase();
  const userEmail = req.user?.email;

  // Teacher class restriction check
  if (userRole === 'TEACHER') {
    const teacherAssignedClasses = await getTeacherAssignedClasses(userEmail, req.user?.id);
    if (targetClass && targetClass !== 'All Classes' && !teacherAssignedClasses.includes(targetClass)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. You are only authorized to send notifications to assigned classes: ${teacherAssignedClasses.join(', ')}`
      });
    }
  }

  const notifType = type || 'Important academy notice';
  const cls = targetClass || 'All Classes';

  try {
    if (isTiDBConnected) {
      const [result] = await pool.query(
        `INSERT INTO notifications (title, message, type, targetClass, studentId, relatedId, isRead)
         VALUES (?, ?, ?, ?, ?, ?, 0)`,
        [title, message, notifType, cls, studentId || null, relatedId || null]
      );

      await recordAuditLog({ req, action: 'SEND_NOTIFICATION', targetEntity: 'notifications', targetRecordId: result.insertId, metadata: { title, type: notifType, targetClass: cls } });
      return res.json({ success: true, message: 'Notification sent successfully!', notificationId: result.insertId });
    }

    const db = readDB();
    if (!db.notifications) db.notifications = [];

    const newNotif = {
      id: Date.now(),
      studentId: studentId || null,
      targetClass: cls,
      type: notifType,
      title,
      message,
      isRead: false,
      relatedId: relatedId || null,
      createdAt: new Date().toISOString()
    };

    db.notifications.unshift(newNotif);
    writeDB(db);

    await recordAuditLog({ req, action: 'SEND_NOTIFICATION', targetEntity: 'notifications', targetRecordId: newNotif.id, metadata: { title, type: notifType, targetClass: cls } });
    return res.json({ success: true, message: 'Notification sent successfully!', notification: newNotif });
  } catch (error) {
    next(error);
  }
});

/**
 * ☑️ PUT /api/notifications/:id/read - Mark Notification as Read
 */
router.put('/notifications/:id/read', async (req, res, next) => {
  const notifId = req.params.id;

  try {
    if (isTiDBConnected) {
      await pool.query('UPDATE notifications SET isRead = 1 WHERE id = ?', [notifId]);
      return res.json({ success: true, message: 'Notification marked as read.' });
    }

    const db = readDB();
    const index = (db.notifications || []).findIndex(n => String(n.id) === String(notifId));
    if (index !== -1) {
      db.notifications[index].isRead = true;
      writeDB(db);
    }

    return res.json({ success: true, message: 'Notification marked as read.' });
  } catch (error) {
    next(error);
  }
});

/**
 * ☑️ PUT /api/notifications/read-all - Mark All Notifications as Read
 */
router.put('/notifications/read-all', async (req, res, next) => {
  const userRole = (req.user?.role || 'GUEST').toUpperCase();
  const studentId = req.user?.studentId;

  try {
    if (isTiDBConnected) {
      if (userRole === 'STUDENT' && studentId) {
        await pool.query('UPDATE notifications SET isRead = 1 WHERE studentId = ? OR targetClass = "All Classes"', [studentId]);
      } else {
        await pool.query('UPDATE notifications SET isRead = 1');
      }
      return res.json({ success: true, message: 'All notifications marked as read.' });
    }

    const db = readDB();
    (db.notifications || []).forEach(n => {
      if (userRole === 'STUDENT') {
        if (!n.studentId || n.studentId === studentId || n.targetClass === 'All Classes') {
          n.isRead = true;
        }
      } else {
        n.isRead = true;
      }
    });

    writeDB(db);
    return res.json({ success: true, message: 'All notifications marked as read.' });
  } catch (error) {
    next(error);
  }
});

export default router;
