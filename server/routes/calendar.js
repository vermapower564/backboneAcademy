import express from 'express';
import pool, { isTiDBConnected } from '../database.js';
import { readDB, writeDB } from '../db.js';
import { verifyRole } from '../middleware/authMiddleware.js';
import { recordAuditLog } from '../middleware/auditLogger.js';
import { getTeacherAssignedClasses } from '../services/teacherService.js';

const router = express.Router();

/**
 * 📅 GET /api/calendar - List & Query Academic Calendar Events (RBAC & Class Separation Enforced)
 */
router.get('/calendar', async (req, res, next) => {
  const { month, year, className, eventType, status } = req.query;
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
      let query = 'SELECT * FROM calendar_events WHERE 1=1';
      const params = [];

      // Privacy rules
      if (userRole === 'STUDENT') {
        query += ' AND (status = "PUBLISHED" OR status IS NULL)';
        if (studentClass) {
          query += ' AND (targetClass = ? OR targetClass = "All Classes" OR targetClass IS NULL OR targetClass = "")';
          params.push(studentClass);
        }
      } else if (userRole === 'TEACHER') {
        if (teacherAssignedClasses.length > 0) {
          query += ` AND (targetClass = "All Classes" OR targetClass IN (${teacherAssignedClasses.map(() => '?').join(',')}))`;
          params.push(...teacherAssignedClasses);
        }
      } else if (status) {
        query += ' AND status = ?';
        params.push(status);
      }

      if (className && className !== 'All Classes') {
        query += ' AND (targetClass = ? OR targetClass = "All Classes")';
        params.push(className);
      }

      if (eventType && eventType !== 'All') {
        query += ' AND eventType = ?';
        params.push(eventType);
      }

      query += ' ORDER BY eventDate ASC';

      const [rows] = await pool.query(query, params);
      return res.json({ success: true, count: rows.length, events: rows });
    }

    // Local DB Fallback
    const db = readDB();
    let events = [...(db.calendarEvents || [])];

    if (userRole === 'STUDENT') {
      events = events.filter(e => 
        (e.status === 'PUBLISHED' || !e.status) &&
        (!studentClass || !e.targetClass || e.targetClass === 'All Classes' || e.targetClass === studentClass)
      );
    } else if (userRole === 'TEACHER') {
      events = events.filter(e => 
        !e.targetClass || e.targetClass === 'All Classes' || teacherAssignedClasses.includes(e.targetClass)
      );
    } else if (status) {
      events = events.filter(e => e.status === status);
    }

    if (className && className !== 'All Classes') {
      events = events.filter(e => e.targetClass === 'All Classes' || e.targetClass === className);
    }

    if (eventType && eventType !== 'All') {
      events = events.filter(e => e.eventType === eventType);
    }

    events.sort((a, b) => new Date(a.eventDate) - new Date(b.eventDate));
    return res.json({ success: true, count: events.length, events });
  } catch (error) {
    next(error);
  }
});

/**
 * ➕ POST /api/calendar - Create & Publish Academic Event (Admin Only)
 */
router.post('/calendar', verifyRole(['ADMIN']), async (req, res, next) => {
  const { title, description, eventDate, startTime, endTime, eventType, targetClass, status } = req.body;

  if (!title || !eventDate) {
    return res.status(400).json({ success: false, message: 'Event title and date are required.' });
  }

  const creator = req.user?.name || 'Academy Director';
  const eventStatus = status || 'PUBLISHED';
  const type = eventType || 'Academy Event';
  const cls = targetClass || 'All Classes';

  try {
    if (isTiDBConnected) {
      const [result] = await pool.query(
        `INSERT INTO calendar_events (title, description, eventDate, startTime, endTime, eventType, targetClass, status, createdBy)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [title, description || '', eventDate, startTime || '', endTime || '', type, cls, eventStatus, creator]
      );

      await recordAuditLog({ req, action: 'CREATE_CALENDAR_EVENT', targetEntity: 'calendar_events', targetRecordId: result.insertId, metadata: { title, eventDate, targetClass: cls } });
      return res.json({ success: true, message: 'Academic event published successfully!', eventId: result.insertId });
    }

    const db = readDB();
    if (!db.calendarEvents) db.calendarEvents = [];

    const newEvent = {
      id: Date.now(),
      title,
      description: description || '',
      eventDate,
      startTime: startTime || '',
      endTime: endTime || '',
      eventType: type,
      targetClass: cls,
      status: eventStatus,
      createdBy: creator,
      createdAt: new Date().toISOString()
    };

    db.calendarEvents.push(newEvent);
    writeDB(db);

    await recordAuditLog({ req, action: 'CREATE_CALENDAR_EVENT', targetEntity: 'calendar_events', targetRecordId: newEvent.id, metadata: { title, eventDate, targetClass: cls } });
    return res.json({ success: true, message: 'Academic event published successfully!', event: newEvent });
  } catch (error) {
    next(error);
  }
});

/**
 * ✏️ PUT /api/calendar/:id - Update Event Details or Status (Admin Only)
 */
router.put('/calendar/:id', verifyRole(['ADMIN']), async (req, res, next) => {
  const eventId = req.params.id;
  const { title, description, eventDate, startTime, endTime, eventType, targetClass, status } = req.body;

  try {
    if (isTiDBConnected) {
      await pool.query(
        `UPDATE calendar_events 
         SET title = COALESCE(?, title),
             description = COALESCE(?, description),
             eventDate = COALESCE(?, eventDate),
             startTime = COALESCE(?, startTime),
             endTime = COALESCE(?, endTime),
             eventType = COALESCE(?, eventType),
             targetClass = COALESCE(?, targetClass),
             status = COALESCE(?, status)
         WHERE id = ?`,
        [title, description, eventDate, startTime, endTime, eventType, targetClass, status, eventId]
      );

      await recordAuditLog({ req, action: 'UPDATE_CALENDAR_EVENT', targetEntity: 'calendar_events', targetRecordId: eventId, metadata: { title, eventDate } });
      return res.json({ success: true, message: 'Calendar event updated successfully.' });
    }

    const db = readDB();
    const index = (db.calendarEvents || []).findIndex(e => String(e.id) === String(eventId));
    if (index === -1) return res.status(404).json({ success: false, message: 'Calendar event not found.' });

    db.calendarEvents[index] = {
      ...db.calendarEvents[index],
      title: title !== undefined ? title : db.calendarEvents[index].title,
      description: description !== undefined ? description : db.calendarEvents[index].description,
      eventDate: eventDate !== undefined ? eventDate : db.calendarEvents[index].eventDate,
      startTime: startTime !== undefined ? startTime : db.calendarEvents[index].startTime,
      endTime: endTime !== undefined ? endTime : db.calendarEvents[index].endTime,
      eventType: eventType !== undefined ? eventType : db.calendarEvents[index].eventType,
      targetClass: targetClass !== undefined ? targetClass : db.calendarEvents[index].targetClass,
      status: status !== undefined ? status : db.calendarEvents[index].status
    };

    writeDB(db);
    await recordAuditLog({ req, action: 'UPDATE_CALENDAR_EVENT', targetEntity: 'calendar_events', targetRecordId: eventId, metadata: { title, eventDate } });
    return res.json({ success: true, message: 'Calendar event updated successfully.', event: db.calendarEvents[index] });
  } catch (error) {
    next(error);
  }
});

/**
 * 🗑️ DELETE /api/calendar/:id - Remove Calendar Event (Admin Only)
 */
router.delete('/calendar/:id', verifyRole(['ADMIN']), async (req, res, next) => {
  const eventId = req.params.id;

  try {
    if (isTiDBConnected) {
      await pool.query('DELETE FROM calendar_events WHERE id = ?', [eventId]);
      await recordAuditLog({ req, action: 'DELETE_CALENDAR_EVENT', targetEntity: 'calendar_events', targetRecordId: eventId });
      return res.json({ success: true, message: 'Calendar event removed successfully.' });
    }

    const db = readDB();
    db.calendarEvents = (db.calendarEvents || []).filter(e => String(e.id) !== String(eventId));
    writeDB(db);

    await recordAuditLog({ req, action: 'DELETE_CALENDAR_EVENT', targetEntity: 'calendar_events', targetRecordId: eventId });
    return res.json({ success: true, message: 'Calendar event removed successfully.' });
  } catch (error) {
    next(error);
  }
});

export default router;
