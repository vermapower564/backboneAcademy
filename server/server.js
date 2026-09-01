import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { securityHeaders, authRateLimiter, apiRateLimiter } from './middleware/security.js';
import { authenticateToken } from './middleware/authMiddleware.js';
import { initDB } from './db.js';
import { initTiDBConnection, isTiDBConnected, checkDatabaseHealth } from './database.js';

import authRouter from './routes/auth.js';
import bookingsRouter from './routes/bookings.js';
import reviewsRouter from './routes/reviews.js';
import contactRouter from './routes/contact.js';
import studentsRouter from './routes/students.js';
import teachersRouter from './routes/teachers.js';
import attendanceRouter from './routes/attendance.js';
import feesRouter from './routes/fees.js';
import examsRouter from './routes/exams.js';
import assignmentsRouter from './routes/assignments.js';
import announcementsRouter from './routes/announcements.js';
import reportsRouter from './routes/reports.js';
import materialsRouter from './routes/materials.js';
import calendarRouter from './routes/calendar.js';
import notificationsRouter from './routes/notifications.js';

const app = express();
const PORT = process.env.PORT || 5000;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// Initialize local JSON Database Backup & Test TiDB Cloud Connection
initDB();
initTiDBConnection();

// Security Headers
app.use(securityHeaders);

// CORS Configuration
app.use(cors({
  origin: [FRONTEND_URL, 'http://localhost:5173', 'http://127.0.0.1:5173'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-user-role', 'x-student-id', 'x-auth-token'],
  credentials: true
}));

// Request Body Parser (Restricted to 10kb to prevent payload abuse)
app.use(express.json({ limit: '10kb' }));

// Apply General Rate Limiter to all API endpoints
app.use('/api', apiRateLimiter);

// 🔐 Mount Token Authentication Middleware Globally (Binds verified req.user context)
app.use(authenticateToken);

// 🩺 Enhanced Health Check Endpoint (Dynamic DB ping check)
app.get('/api/health', async (req, res) => {
  const isHealthy = await checkDatabaseHealth();

  res.json({
    status: 'OK',
    dbStatus: isHealthy ? 'connected' : (isTiDBConnected ? 'reconnecting' : 'disconnected'),
    dbEngine: isHealthy ? 'TiDB Cloud MySQL' : 'Local JSON Fallback',
    uptimeSeconds: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
    message: 'Backbone Academy Backend API Server is running smoothly!'
  });
});

// Mount Modular API Routes
app.use('/api/auth', authRateLimiter, authRouter);
app.use('/api', bookingsRouter);
app.use('/api', reviewsRouter);
app.use('/api', contactRouter);
app.use('/api', studentsRouter);
app.use('/api', teachersRouter);
app.use('/api', attendanceRouter);
app.use('/api', feesRouter);
app.use('/api', examsRouter);
app.use('/api', assignmentsRouter);
app.use('/api', announcementsRouter);
app.use('/api', reportsRouter);
app.use('/api', materialsRouter);
app.use('/api', calendarRouter);
app.use('/api', notificationsRouter);

// Centralized Error Handling Middleware (Hides stack traces and DB internals from users)
app.use((err, req, res, next) => {
  console.error('🔥 [Server Error]:', err.stack || err.message || err);
  res.status(err.status || 500).json({
    success: false,
    message: err.userMessage || 'An unexpected error occurred on the server.'
  });
});

// Start Express Server
app.listen(PORT, () => {
  console.log(`🚀 Backbone Academy Backend API Server listening on port ${PORT}`);
});
