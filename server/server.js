import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { securityHeaders, authRateLimiter, apiRateLimiter } from './middleware/security.js';
import { initDB } from './db.js';
import { initTiDBConnection, isTiDBConnected } from './database.js';

import authRouter from './routes/auth.js';
import bookingsRouter from './routes/bookings.js';
import reviewsRouter from './routes/reviews.js';
import contactRouter from './routes/contact.js';

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
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Request Body Parser (Restricted to 10kb to prevent payload abuse)
app.use(express.json({ limit: '10kb' }));

// Apply General Rate Limiter to all API endpoints
app.use('/api', apiRateLimiter);

// 🩺 Enhanced Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    dbStatus: isTiDBConnected ? 'connected' : 'disconnected',
    dbEngine: isTiDBConnected ? 'TiDB Cloud MySQL' : 'Local JSON Fallback',
    uptimeSeconds: Math.floor(process.env.TEST_UPTIME || process.uptime()),
    timestamp: new Date().toISOString(),
    message: 'Backbone Academy Backend API Server is running smoothly!'
  });
});

// Mount Modular API Routes
app.use('/api/auth', authRateLimiter, authRouter);
app.use('/api', bookingsRouter);
app.use('/api', reviewsRouter);
app.use('/api', contactRouter);

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
