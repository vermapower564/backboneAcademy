import fs from 'fs';
import path from 'path';
import pool, { isTiDBConnected } from '../database.js';
import { readDB, writeDB } from '../db.js';

export async function restoreDatabaseBackup(backupFilePath, isConfirmed = false) {
  if (!isConfirmed) {
    console.error(`\n🚨 ACCIDENTAL OVERWRITE PROTECTION:`);
    console.error(`   Database restoration requires explicit confirmation.`);
    console.error(`   Usage: node server/scripts/restore.js <backup_file_path> --confirm\n`);
    return { success: false, message: 'Restore cancelled. Confirmation required.' };
  }

  if (!fs.existsSync(backupFilePath)) {
    throw new Error(`Backup file not found at path: ${backupFilePath}`);
  }

  console.log(`\n♻️  Restoring Backbone Academy Database from ${path.basename(backupFilePath)}...`);
  const backupContent = JSON.parse(fs.readFileSync(backupFilePath, 'utf8'));

  if (!backupContent.tables || typeof backupContent.tables !== 'object') {
    throw new Error('Invalid backup file format.');
  }

  try {
    if (isTiDBConnected) {
      for (const [table, rows] of Object.entries(backupContent.tables)) {
        if (!Array.isArray(rows) || rows.length === 0) continue;

        console.log(`  🔄 Restoring table: ${table} (${rows.length} records)...`);
        for (const row of rows) {
          const keys = Object.keys(row);
          const values = Object.values(row);
          const placeholders = keys.map(() => '?').join(',');
          const query = `INSERT INTO ${table} (${keys.join(',')}) VALUES (${placeholders}) ON DUPLICATE KEY UPDATE id=id`;

          await pool.query(query, values);
        }
      }
    } else {
      const db = readDB();
      const tables = backupContent.tables;

      if (tables.students) db.students = tables.students;
      if (tables.teachers) db.teachers = tables.teachers;
      if (tables.attendance) db.attendance = tables.attendance;
      if (tables.fees) db.fees = tables.fees;
      if (tables.exams) db.exams = tables.exams;
      if (tables.exam_results) db.examResults = tables.exam_results;
      if (tables.assignments) db.assignments = tables.assignments;
      if (tables.materials) db.materials = tables.materials;
      if (tables.announcements) db.announcements = tables.announcements;
      if (tables.notifications) db.notifications = tables.notifications;
      if (tables.calendar_events) db.calendarEvents = tables.calendar_events;

      writeDB(db);
    }

    console.log(`\n✅ Database Restoration successfully completed!\n`);
    return { success: true, message: 'Database restored successfully.' };
  } catch (err) {
    console.error('❌ Database Restoration Failed:', err);
    throw err;
  }
}

// CLI Execution Guard
if (process.argv[1] && path.basename(process.argv[1]) === 'restore.js') {
  const filePath = process.argv[2];
  const confirmArg = process.argv.includes('--confirm') || process.env.CONFIRM_RESTORE === 'true';

  if (!filePath) {
    console.log('Usage: node server/scripts/restore.js <path_to_backup_file> --confirm');
    process.exit(1);
  }

  restoreDatabaseBackup(filePath, confirmArg)
    .then(res => process.exit(res.success ? 0 : 1))
    .catch(() => process.exit(1));
}
