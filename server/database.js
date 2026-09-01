import mysql from 'mysql2/promise';
import 'dotenv/config';

// Determine SSL options for TiDB Cloud
const sslOption = process.env.DB_SSL === 'false' ? false : {
  minVersion: 'TLSv1.2',
  rejectUnauthorized: true
};

// Create a connection pool to TiDB Cloud MySQL database
const poolConfig = process.env.DATABASE_URL
  ? {
      uri: process.env.DATABASE_URL,
      ssl: sslOption,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    }
  : {
      host: process.env.DB_HOST || 'gateway01.ap-southeast-1.prod.aws.tidbcloud.com',
      port: Number(process.env.DB_PORT) || 4000,
      user: process.env.DB_USER || '',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'backbone-db',
      ssl: sslOption,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    };

export const pool = mysql.createPool(poolConfig);

export let isTiDBConnected = false;
let tablesInitialized = false;

// Table Definition Definitions with exact API compatibility & utf8mb4 support
const TABLE_DEFINITIONS = [
  {
    name: 'users',
    query: `
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'STUDENT',
        studentId VARCHAR(50),
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `
  },
  {
    name: 'courses',
    query: `
      CREATE TABLE IF NOT EXISTS courses (
        id INT AUTO_INCREMENT PRIMARY KEY,
        courseId VARCHAR(50) UNIQUE NOT NULL,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        category VARCHAR(100),
        duration VARCHAR(100),
        fee DECIMAL(10,2) DEFAULT 0,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `
  },
  {
    name: 'classes',
    query: `
      CREATE TABLE IF NOT EXISTS classes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        className VARCHAR(100) NOT NULL UNIQUE,
        board VARCHAR(100) DEFAULT 'CBSE',
        roomNo VARCHAR(50),
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `
  },
  {
    name: 'subjects',
    query: `
      CREATE TABLE IF NOT EXISTS subjects (
        id INT AUTO_INCREMENT PRIMARY KEY,
        subjectName VARCHAR(100) NOT NULL,
        code VARCHAR(50),
        className VARCHAR(100),
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `
  },
  {
    name: 'batches',
    query: `
      CREATE TABLE IF NOT EXISTS batches (
        id INT AUTO_INCREMENT PRIMARY KEY,
        batchName VARCHAR(100) NOT NULL,
        timeSlot VARCHAR(100),
        className VARCHAR(100),
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `
  },
  {
    name: 'teachers',
    query: `
      CREATE TABLE IF NOT EXISTS teachers (
        id INT AUTO_INCREMENT PRIMARY KEY,
        teacherId VARCHAR(50) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        photo VARCHAR(255),
        mobile VARCHAR(50),
        email VARCHAR(255),
        subjects TEXT,
        classes TEXT,
        joiningDate VARCHAR(50),
        status VARCHAR(50) DEFAULT 'ACTIVE',
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `
  },
  {
    name: 'students',
    query: `
      CREATE TABLE IF NOT EXISTS students (
        id INT AUTO_INCREMENT PRIMARY KEY,
        studentId VARCHAR(50) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        dob VARCHAR(50),
        gender VARCHAR(20),
        parentName VARCHAR(255),
        mobile VARCHAR(50),
        email VARCHAR(255),
        address TEXT,
        className VARCHAR(100),
        board VARCHAR(100),
        course VARCHAR(255),
        batch VARCHAR(100),
        admissionDate VARCHAR(50),
        status VARCHAR(50) DEFAULT 'ACTIVE',
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_students_class (className),
        INDEX idx_students_mobile (mobile)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `
  },
  {
    name: 'attendance',
    query: `
      CREATE TABLE IF NOT EXISTS attendance (
        id INT AUTO_INCREMENT PRIMARY KEY,
        studentId VARCHAR(50) NOT NULL,
        className VARCHAR(100),
        date VARCHAR(50) NOT NULL,
        status VARCHAR(20) NOT NULL,
        markedBy VARCHAR(255),
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_attendance_stu_date (studentId, date)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `
  },
  {
    name: 'fees',
    query: `
      CREATE TABLE IF NOT EXISTS fees (
        id INT AUTO_INCREMENT PRIMARY KEY,
        studentId VARCHAR(50) NOT NULL,
        studentName VARCHAR(255),
        className VARCHAR(100),
        totalAmount DECIMAL(10,2) DEFAULT 0,
        paidAmount DECIMAL(10,2) DEFAULT 0,
        pendingAmount DECIMAL(10,2) DEFAULT 0,
        dueDate VARCHAR(50),
        paymentStatus VARCHAR(50) DEFAULT 'PENDING',
        paymentDate VARCHAR(50),
        receiptNo VARCHAR(100),
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_fees_studentId (studentId)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `
  },
  {
    name: 'payments',
    query: `
      CREATE TABLE IF NOT EXISTS payments (
        id INT AUTO_INCREMENT PRIMARY KEY,
        feeId INT,
        studentId VARCHAR(50),
        amountPaid DECIMAL(10,2) NOT NULL,
        paymentDate VARCHAR(50),
        paymentMethod VARCHAR(50) DEFAULT 'CASH',
        receiptNo VARCHAR(100),
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `
  },
  {
    name: 'exams',
    query: `
      CREATE TABLE IF NOT EXISTS exams (
        id INT AUTO_INCREMENT PRIMARY KEY,
        examName VARCHAR(255) NOT NULL,
        className VARCHAR(100),
        subject VARCHAR(100),
        maxMarks INT DEFAULT 100,
        examDate VARCHAR(50),
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `
  },
  {
    name: 'exam_results',
    query: `
      CREATE TABLE IF NOT EXISTS exam_results (
        id INT AUTO_INCREMENT PRIMARY KEY,
        examId INT,
        studentId VARCHAR(50),
        studentName VARCHAR(255),
        className VARCHAR(100),
        subject VARCHAR(100),
        marksObtained INT,
        maxMarks INT DEFAULT 100,
        percentage DECIMAL(5,2),
        grade VARCHAR(10),
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_exam_results_studentId (studentId)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `
  },
  {
    name: 'assignments',
    query: `
      CREATE TABLE IF NOT EXISTS assignments (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        subject VARCHAR(100),
        className VARCHAR(100),
        dueDate VARCHAR(50),
        createdBy VARCHAR(255),
        fileUrl TEXT,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_assignments_className (className)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `
  },
  {
    name: 'assignment_submissions',
    query: `
      CREATE TABLE IF NOT EXISTS assignment_submissions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        assignmentId INT,
        studentId VARCHAR(50),
        studentName VARCHAR(255),
        submittedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        fileUrl TEXT,
        score INT,
        status VARCHAR(50) DEFAULT 'SUBMITTED',
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `
  },
  {
    name: 'materials',
    query: `
      CREATE TABLE IF NOT EXISTS materials (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        category VARCHAR(100),
        className VARCHAR(100),
        fileUrl TEXT,
        uploadedBy VARCHAR(255),
        date VARCHAR(50),
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `
  },
  {
    name: 'announcements',
    query: `
      CREATE TABLE IF NOT EXISTS announcements (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        targetClass VARCHAR(100),
        publishDate VARCHAR(50),
        expiryDate VARCHAR(50),
        status VARCHAR(50) DEFAULT 'ACTIVE',
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `
  },
  {
    name: 'notifications',
    query: `
      CREATE TABLE IF NOT EXISTS notifications (
        id INT AUTO_INCREMENT PRIMARY KEY,
        userId INT,
        title VARCHAR(255),
        message TEXT,
        isRead BOOLEAN DEFAULT FALSE,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `
  },
  {
    name: 'admission_enquiries',
    query: `
      CREATE TABLE IF NOT EXISTS admission_enquiries (
        id INT AUTO_INCREMENT PRIMARY KEY,
        studentName VARCHAR(255) NOT NULL,
        parentName VARCHAR(255),
        mobile VARCHAR(50) NOT NULL,
        email VARCHAR(255),
        className VARCHAR(100),
        board VARCHAR(100),
        address TEXT,
        message TEXT,
        status VARCHAR(50) DEFAULT 'PENDING',
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `
  },
  {
    name: 'demo_bookings',
    query: `
      CREATE TABLE IF NOT EXISTS demo_bookings (
        id INT AUTO_INCREMENT PRIMARY KEY,
        studentName VARCHAR(255) NOT NULL,
        phone VARCHAR(50) NOT NULL,
        course VARCHAR(255) DEFAULT 'Class 5th to 10th Academics',
        timeSlot VARCHAR(255) DEFAULT 'Morning (8:00 AM - 11:00 AM)',
        bookedAt DATETIME DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `
  },
  {
    name: 'reviews',
    query: `
      CREATE TABLE IF NOT EXISTS reviews (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        course VARCHAR(255) DEFAULT 'Class 5th to 10th Academics',
        rating INT DEFAULT 5,
        date VARCHAR(50) DEFAULT 'Just now',
        comment TEXT NOT NULL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `
  },
  {
    name: 'contacts',
    query: `
      CREATE TABLE IF NOT EXISTS contacts (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255),
        email VARCHAR(255),
        phone VARCHAR(50),
        message TEXT,
        receivedAt DATETIME DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `
  }
];

/**
 * Auto-create required database tables in TiDB Cloud safely in dependency order
 */
export async function createTables() {
  if (tablesInitialized) {
    return true;
  }

  console.log('📦 Database connection established.');
  console.log('🚀 Creating Backbone Academy tables in TiDB Cloud...');

  let successCount = 0;
  for (const table of TABLE_DEFINITIONS) {
    try {
      await pool.query(table.query);
      console.log(`  ✓ ${table.name}`);
      successCount++;
    } catch (error) {
      console.error(`  ✗ Failed to create ${table.name}: ${error.message}`);
    }
  }

  tablesInitialized = true;
  console.log(`✅ Database initialization completed. (${successCount}/${TABLE_DEFINITIONS.length} tables verified)`);
  return true;
}

/**
 * Live Health Check: Ping TiDB database dynamically rather than relying solely on a static flag
 */
export async function checkDatabaseHealth() {
  if (!isTiDBConnected) return false;
  try {
    const [rows] = await pool.query('SELECT 1 as alive');
    return rows[0]?.alive === 1;
  } catch (err) {
    isTiDBConnected = false;
    return false;
  }
}

/**
 * Helper: Upgrade legacy plain-text password to bcrypt hash in TiDB
 */
export async function updateUserPasswordHash(userId, hashedPassword) {
  if (isTiDBConnected) {
    try {
      await pool.query('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, userId]);
      console.log(`🔐 Automatically upgraded legacy password to bcrypt hash for TiDB user ID: ${userId}`);
    } catch (err) {
      console.error('⚠️  Failed to update user password hash in TiDB:', err.message);
    }
  }
}

/**
 * Test and initialize the TiDB Cloud database connection.
 */
export async function initTiDBConnection() {
  const isUrlPlaceholder = process.env.DATABASE_URL && (process.env.DATABASE_URL.includes('<username>') || process.env.DATABASE_URL.includes('your_tidb_username'));
  const isUserPlaceholder = !process.env.DB_USER || process.env.DB_USER === 'your_tidb_username';
  const isPassPlaceholder = !process.env.DB_PASSWORD || process.env.DB_PASSWORD === 'your_tidb_password';

  if ((!process.env.DATABASE_URL && (isUserPlaceholder || isPassPlaceholder)) || isUrlPlaceholder) {
    console.warn('⚠️  TiDB Cloud credentials in .env are still placeholders. Please update .env with your TiDB Cloud details.');
    isTiDBConnected = false;
    return false;
  }

  try {
    const connection = await pool.getConnection();
    console.log(`✅ Successfully connected to TiDB Cloud database instance: "${process.env.DB_NAME || 'backbone-db'}"`);
    connection.release();
    isTiDBConnected = true;

    // Auto-create tables on successful connection (guarded to run once)
    await createTables();
    return true;
  } catch (error) {
    console.error('❌ Failed to connect to TiDB Cloud database:', error.message);
    isTiDBConnected = false;
    return false;
  }
}

export default pool;
