import pool, { isTiDBConnected } from '../database.js';
import { readDB } from '../db.js';

/**
 * Get assigned classes array for a teacher by email or teacher ID
 */
export async function getTeacherAssignedClasses(userEmail, teacherId) {
  const emailLower = (userEmail || '').toLowerCase();

  try {
    if (isTiDBConnected) {
      const [rows] = await pool.query(
        'SELECT classes FROM teachers WHERE LOWER(email) = ? OR teacherId = ?',
        [emailLower, teacherId || '']
      );
      if (rows.length > 0 && rows[0].classes) {
        return rows[0].classes.split(',').map(c => c.trim());
      }
    }

    const db = readDB();
    const teacher = (db.teachers || []).find(t => 
      (t.email && t.email.toLowerCase() === emailLower) ||
      (t.teacherId && t.teacherId === teacherId)
    );

    if (teacher && teacher.classes) {
      if (Array.isArray(teacher.classes)) return teacher.classes.map(c => c.trim());
      return String(teacher.classes).split(',').map(c => c.trim());
    }
  } catch (err) {
    console.error('Error fetching teacher assigned classes:', err.message);
  }

  // Default fallback for default demo teacher
  return ['Class 9', 'Class 10', 'ADCA Computer Diploma'];
}
