import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

// Standard security headers via Helmet
export const securityHeaders = helmet({
  contentSecurityPolicy: false, // Allow inline styles/scripts for Vite frontend dev
  crossOriginResourcePolicy: { policy: 'cross-origin' }
});

// Strict Rate Limiting for Authentication Endpoints (Login / Register)
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 15, // Limit each IP to 15 auth requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many authentication attempts from this IP address. Please try again after 15 minutes.'
  }
});

// General Rate Limiting for Public API Endpoints
export const apiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // Limit each IP to 200 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests sent to the server. Please slow down.'
  }
});
