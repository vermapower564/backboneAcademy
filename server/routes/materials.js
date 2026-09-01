import express from 'express';
import pool, { isTiDBConnected } from '../database.js';
import { readDB, writeDB } from '../db.js';
import { verifyRole } from '../middleware/authMiddleware.js';
import { recordAuditLog } from '../middleware/auditLogger.js';

const router = express.Router();

/**
 * 📚 GET /api/materials - List & Search PDF Documents (RBAC Enforced)
 */
router.get('/materials', async (req, res, next) => {
  const { search, category, className, subject, status } = req.query;
  const userRole = (req.user?.role || 'GUEST').toUpperCase();
  const studentId = req.user?.studentId;

  try {
    let studentClass = null;

    // Fetch student's assigned class if user is a STUDENT
    if (userRole === 'STUDENT') {
      if (isTiDBConnected && studentId) {
        const [stRows] = await pool.query('SELECT className FROM students WHERE studentId = ?', [studentId]);
        if (stRows.length > 0) studentClass = stRows[0].className;
      } else if (studentId) {
        const db = readDB();
        const st = (db.students || []).find(s => s.studentId === studentId);
        if (st) studentClass = st.className;
      }
    }

    if (isTiDBConnected) {
      let query = 'SELECT * FROM materials WHERE 1=1';
      const params = [];

      // Privacy rule for students: Only published documents matching their class or "All Classes"
      if (userRole === 'STUDENT') {
        query += ' AND (status = "PUBLISHED" OR status IS NULL)';
        if (studentClass) {
          query += ' AND (className = ? OR className = "All Classes" OR className IS NULL OR className = "")';
          params.push(studentClass);
        }
      } else if (status) {
        query += ' AND status = ?';
        params.push(status);
      }

      if (category && category !== 'All') {
        query += ' AND category = ?';
        params.push(category);
      }

      if (className && className !== 'All') {
        query += ' AND className = ?';
        params.push(className);
      }

      if (subject && subject !== 'All') {
        query += ' AND subject = ?';
        params.push(subject);
      }

      if (search) {
        query += ' AND (title LIKE ? OR description LIKE ? OR subject LIKE ?)';
        params.push(`%${search}%`, `%${search}%`, `%${search}%`);
      }

      query += ' ORDER BY id DESC';

      const [rows] = await pool.query(query, params);
      return res.json({ success: true, materials: rows });
    }

    // Local DB Fallback
    const db = readDB();
    let materials = [...(db.materials || [])];

    if (userRole === 'STUDENT') {
      materials = materials.filter(m => 
        (m.status === 'PUBLISHED' || !m.status) &&
        (!studentClass || !m.className || m.className === 'All Classes' || m.className === studentClass)
      );
    } else if (status) {
      materials = materials.filter(m => m.status === status);
    }

    if (category && category !== 'All') {
      materials = materials.filter(m => m.category === category);
    }

    if (className && className !== 'All') {
      materials = materials.filter(m => m.className === className);
    }

    if (subject && subject !== 'All') {
      materials = materials.filter(m => m.subject === subject);
    }

    if (search) {
      const q = search.toLowerCase();
      materials = materials.filter(m => 
        (m.title && m.title.toLowerCase().includes(q)) ||
        (m.description && m.description.toLowerCase().includes(q)) ||
        (m.subject && m.subject.toLowerCase().includes(q))
      );
    }

    materials.reverse();
    return res.json({ success: true, materials });
  } catch (error) {
    next(error);
  }
});

/**
 * 📤 POST /api/materials - Upload & Publish New PDF Document (Admin & Teacher Only)
 */
router.post('/materials', verifyRole(['ADMIN', 'TEACHER']), async (req, res, next) => {
  const { title, category, className, subject, description, fileUrl, fileType, fileSize, status } = req.body;

  if (!title || !fileUrl) {
    return res.status(400).json({ success: false, message: 'Document title and file URL are required.' });
  }

  const dateStr = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const uploaderName = req.user?.name || 'Academy Admin';
  const docStatus = status || 'PUBLISHED';
  const type = fileType || 'pdf';
  const size = fileSize || '1.2 MB';

  try {
    if (isTiDBConnected) {
      const [result] = await pool.query(
        `INSERT INTO materials (title, category, className, subject, description, fileUrl, fileType, fileSize, uploadedBy, status, date)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [title, category || 'Study Materials', className || 'All Classes', subject || 'General', description || '', fileUrl, type, size, uploaderName, docStatus, dateStr]
      );

      await recordAuditLog({ req, action: 'PUBLISH_RESOURCE', targetEntity: 'materials', targetRecordId: result.insertId, metadata: { title, category, className } });
      return res.json({ success: true, message: 'Document uploaded and published successfully!', materialId: result.insertId });
    }

    const db = readDB();
    if (!db.materials) db.materials = [];

    const newDoc = {
      id: Date.now(),
      title,
      category: category || 'Study Materials',
      className: className || 'All Classes',
      subject: subject || 'General',
      description: description || '',
      fileUrl,
      fileType: type,
      fileSize: size,
      uploadedBy: uploaderName,
      status: docStatus,
      date: dateStr,
      createdAt: new Date().toISOString()
    };

    db.materials.unshift(newDoc);
    writeDB(db);

    await recordAuditLog({ req, action: 'PUBLISH_RESOURCE', targetEntity: 'materials', targetRecordId: newDoc.id, metadata: { title, category, className } });
    return res.json({ success: true, message: 'Document uploaded and published successfully!', material: newDoc });
  } catch (error) {
    next(error);
  }
});

/**
 * ✏️ PUT /api/materials/:id - Update Document Metadata or Status (Admin & Teacher Only)
 */
router.put('/materials/:id', verifyRole(['ADMIN', 'TEACHER']), async (req, res, next) => {
  const docId = req.params.id;
  const { title, category, className, subject, description, fileUrl, status } = req.body;

  try {
    if (isTiDBConnected) {
      await pool.query(
        `UPDATE materials 
         SET title = COALESCE(?, title),
             category = COALESCE(?, category),
             className = COALESCE(?, className),
             subject = COALESCE(?, subject),
             description = COALESCE(?, description),
             fileUrl = COALESCE(?, fileUrl),
             status = COALESCE(?, status)
         WHERE id = ?`,
        [title, category, className, subject, description, fileUrl, status, docId]
      );

      await recordAuditLog({ req, action: 'UPDATE_RESOURCE', targetEntity: 'materials', targetRecordId: docId, metadata: { title, status } });
      return res.json({ success: true, message: 'Document details updated successfully.' });
    }

    const db = readDB();
    const index = (db.materials || []).findIndex(m => String(m.id) === String(docId));
    if (index === -1) return res.status(404).json({ success: false, message: 'Document not found.' });

    db.materials[index] = {
      ...db.materials[index],
      title: title !== undefined ? title : db.materials[index].title,
      category: category !== undefined ? category : db.materials[index].category,
      className: className !== undefined ? className : db.materials[index].className,
      subject: subject !== undefined ? subject : db.materials[index].subject,
      description: description !== undefined ? description : db.materials[index].description,
      fileUrl: fileUrl !== undefined ? fileUrl : db.materials[index].fileUrl,
      status: status !== undefined ? status : db.materials[index].status
    };

    writeDB(db);
    await recordAuditLog({ req, action: 'UPDATE_RESOURCE', targetEntity: 'materials', targetRecordId: docId, metadata: { title, status } });
    return res.json({ success: true, message: 'Document details updated successfully.', material: db.materials[index] });
  } catch (error) {
    next(error);
  }
});

/**
 * 🗑️ DELETE /api/materials/:id - Delete Document (Admin & Teacher Only)
 */
router.delete('/materials/:id', verifyRole(['ADMIN', 'TEACHER']), async (req, res, next) => {
  const docId = req.params.id;

  try {
    if (isTiDBConnected) {
      await pool.query('DELETE FROM materials WHERE id = ?', [docId]);
      await recordAuditLog({ req, action: 'DELETE_RESOURCE', targetEntity: 'materials', targetRecordId: docId });
      return res.json({ success: true, message: 'Document deleted successfully.' });
    }

    const db = readDB();
    db.materials = (db.materials || []).filter(m => String(m.id) !== String(docId));
    writeDB(db);

    await recordAuditLog({ req, action: 'DELETE_RESOURCE', targetEntity: 'materials', targetRecordId: docId });
    return res.json({ success: true, message: 'Document deleted successfully.' });
  } catch (error) {
    next(error);
  }
});

export default router;
