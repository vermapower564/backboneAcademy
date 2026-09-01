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

/**
 * Auto-create required database tables in TiDB Cloud
 */
export async function createTables() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS demo_bookings (
        id INT AUTO_INCREMENT PRIMARY KEY,
        studentName VARCHAR(255) NOT NULL,
        phone VARCHAR(50) NOT NULL,
        course VARCHAR(255) DEFAULT 'Class 5th to 10th Academics',
        timeSlot VARCHAR(255) DEFAULT 'Morning (8:00 AM - 11:00 AM)',
        bookedAt DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS reviews (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        course VARCHAR(255) DEFAULT 'Class 5th to 10th Academics',
        rating INT DEFAULT 5,
        date VARCHAR(50) DEFAULT 'Just now',
        comment TEXT NOT NULL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS contacts (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255),
        email VARCHAR(255),
        phone VARCHAR(50),
        message TEXT,
        receivedAt DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Seed default reviews if empty
    const [existingReviews] = await pool.query('SELECT COUNT(*) as count FROM reviews');
    if (existingReviews[0].count === 0) {
      await pool.query(`
        INSERT INTO reviews (name, course, rating, date, comment) VALUES
        ('Rohan Sharma', 'Class 5th to 10th Academics', 5, 'Aug 01, 2026', 'Rahul Verma Sir explains Mathematics & Science concepts so clearly! Scored 94% in my exams.'),
        ('Priya Verma', 'DCA (Diploma in Computer Applications)', 5, 'Jul 28, 2026', 'The DCA computer practical classes at Pandra Ranchi campus are 100% practical. Loved MS Excel & Typing!'),
        ('Amit Kumar', 'Navodaya Entrance (JNVST) Prep', 5, 'Jul 20, 2026', 'The JNVST mock OMR tests and mental ability coaching at Backbone Academy helped me get selected!');
      `);
    }

    console.log('✅ TiDB Cloud Database tables (users, demo_bookings, reviews, contacts) initialized!');
  } catch (error) {
    console.error('⚠️  Failed to initialize TiDB database tables:', error.message);
  }
}

/**
 * Helper: Upgrade legacy plain-text password to bcrypt hash in TiDB / JSON DB
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

    // Auto-create tables on successful connection
    await createTables();
    return true;
  } catch (error) {
    console.error('❌ Failed to connect to TiDB Cloud database:', error.message);
    isTiDBConnected = false;
    return false;
  }
}

export default pool;
