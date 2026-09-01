import { readDB, writeDB } from '../db.js';
import pool, { isTiDBConnected } from '../database.js';

/**
 * Record an administrative audit log action safely
 */
export async function recordAuditLog({ req, action, targetEntity, targetRecordId, metadata }) {
  try {
    const userId = req?.user?.id || null;
    const userName = req?.user?.name || 'System';
    const userRole = req?.user?.role || 'GUEST';
    
    // Ensure passwords or secret tokens are NEVER stored in metadata
    let safeMetadata = metadata;
    if (typeof metadata === 'object' && metadata !== null) {
      const copy = { ...metadata };
      delete copy.password;
      delete copy.token;
      delete copy.secret;
      safeMetadata = JSON.stringify(copy);
    } else if (typeof metadata !== 'string') {
      safeMetadata = String(metadata || '');
    }

    if (isTiDBConnected) {
      await pool.query(
        `INSERT INTO audit_logs (userId, userName, userRole, action, targetEntity, targetRecordId, metadata)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [userId, userName, userRole, action, targetEntity, String(targetRecordId || ''), safeMetadata]
      );
    } else {
      const db = readDB();
      if (!db.auditLogs) db.auditLogs = [];
      db.auditLogs.unshift({
        id: Date.now() + Math.random(),
        userId,
        userName,
        userRole,
        action,
        targetEntity,
        targetRecordId: String(targetRecordId || ''),
        metadata: safeMetadata,
        createdAt: new Date().toISOString()
      });
      writeDB(db);
    }
  } catch (err) {
    console.error('⚠️  Failed to record audit log:', err.message);
  }
}
