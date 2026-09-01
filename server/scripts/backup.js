import fs from 'fs';
import path from 'path';
import pool, { isTiDBConnected } from '../database.js';
import { readDB } from '../db.js';

const BACKUP_DIR = path.join(process.cwd(), 'server', 'backups');

if (!fs.existsSync(BACKUP_DIR)) {
  fs.mkdirSync(BACKUP_DIR, { recursive: true });
}

export async function createDatabaseBackup() {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupFileName = `backbone_backup_${timestamp}.json`;
  const backupPath = path.join(BACKUP_DIR, backupFileName);

  console.log(`📦 Initializing Backbone Academy Database Backup at ${new Date().toISOString()}...`);

  const tables = [
    'users',
    'students',
    'teachers',
    'classes',
    'courses',
    'batches',
    'subjects',
    'attendance',
    'fees',
    'payments',
    'exams',
    'exam_results',
    'assignments',
    'assignment_submissions',
    'materials',
    'announcements',
    'notifications',
    'admission_enquiries',
    'demo_bookings',
    'reviews',
    'contacts',
    'audit_logs',
    'password_resets',
    'calendar_events'
  ];

  const backupData = {
    metadata: {
      version: '1.0',
      timestamp: new Date().toISOString(),
      collation: 'utf8mb4_unicode_ci',
      engine: isTiDBConnected ? 'TiDB Cloud MySQL' : 'Local Data Engine',
      tablesCount: tables.length
    },
    tables: {}
  };

  try {
    if (isTiDBConnected) {
      for (const table of tables) {
        try {
          const [rows] = await pool.query(`SELECT * FROM ${table}`);
          backupData.tables[table] = rows;
          console.log(`  ✓ Exported table: ${table} (${rows.length} records)`);
        } catch (err) {
          console.warn(`  ⚠️  Table ${table} query skipped:`, err.message);
          backupData.tables[table] = [];
        }
      }
    } else {
      const db = readDB();
      backupData.tables.users = (db.users || []).map(u => ({ ...u, password: '[PROTECTED_HASH]' }));
      backupData.tables.students = db.students || [];
      backupData.tables.teachers = db.teachers || [];
      backupData.tables.attendance = db.attendance || [];
      backupData.tables.fees = db.fees || [];
      backupData.tables.exams = db.exams || [];
      backupData.tables.exam_results = db.examResults || [];
      backupData.tables.assignments = db.assignments || [];
      backupData.tables.materials = db.materials || [];
      backupData.tables.announcements = db.announcements || [];
      backupData.tables.notifications = db.notifications || [];
      backupData.tables.demo_bookings = db.demoBookings || [];
      backupData.tables.reviews = db.reviews || [];
      backupData.tables.contacts = db.contacts || [];
      backupData.tables.calendar_events = db.calendarEvents || [];
      backupData.tables.audit_logs = db.auditLogs || [];

      for (const table of tables) {
        if (!backupData.tables[table]) backupData.tables[table] = [];
        console.log(`  ✓ Exported table (fallback): ${table} (${backupData.tables[table].length} records)`);
      }
    }

    fs.writeFileSync(backupPath, JSON.stringify(backupData, null, 2), 'utf8');
    console.log(`\n✅ Database Backup successfully created at:`);
    console.log(`   ${backupPath}`);
    console.log(`   File Size: ${(fs.statSync(backupPath).size / 1024).toFixed(2)} KB\n`);

    return { success: true, backupPath, backupFileName, tablesCount: tables.length };
  } catch (err) {
    console.error('❌ Database Backup Failed:', err);
    throw err;
  }
}

// Direct CLI Execution Guard
if (process.argv[1] && path.basename(process.argv[1]) === 'backup.js') {
  createDatabaseBackup()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}
