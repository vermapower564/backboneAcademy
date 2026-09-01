import crypto from 'crypto';
import 'dotenv/config';

const JWT_SECRET = process.env.JWT_SECRET || 'backbone-academy-sec-key-2026-xyz';

/**
 * Generate a secure server-signed authentication token for a user
 */
export function generateToken(user) {
  const payload = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: (user.role || 'STUDENT').toUpperCase(),
    studentId: user.studentId || null,
    iat: Date.now(),
    exp: Date.now() + (24 * 60 * 60 * 1000) // 24 hours validity
  };

  const jsonStr = JSON.stringify(payload);
  const base64Payload = Buffer.from(jsonStr).toString('base64url');
  const signature = crypto.createHmac('sha256', JWT_SECRET).update(base64Payload).digest('hex');

  return `${base64Payload}.${signature}`;
}

/**
 * Verify and decode a server-signed authentication token
 */
export function verifyToken(token) {
  if (!token || typeof token !== 'string') return null;

  const parts = token.split('.');
  if (parts.length !== 2) return null;

  const [base64Payload, signature] = parts;
  const expectedSig = crypto.createHmac('sha256', JWT_SECRET).update(base64Payload).digest('hex');

  if (signature !== expectedSig) {
    return null; // Signature mismatch! Token tampered or invalid.
  }

  try {
    const jsonStr = Buffer.from(base64Payload, 'base64url').toString('utf8');
    const payload = JSON.parse(jsonStr);

    if (payload.exp && Date.now() > payload.exp) {
      return null; // Token expired
    }

    return payload;
  } catch (err) {
    return null;
  }
}

/**
 * Express Middleware: Authenticate incoming request and attach verified req.user context
 */
export function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'] || req.headers['x-auth-token'];
  let token = null;

  if (authHeader) {
    if (authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7).trim();
    } else {
      token = authHeader.trim();
    }
  }

  const verifiedUser = verifyToken(token);

  if (verifiedUser) {
    req.user = verifiedUser;
  } else {
    // Unauthenticated guest
    req.user = {
      id: null,
      name: 'Guest',
      email: null,
      role: 'GUEST',
      studentId: null
    };
  }

  next();
}

/**
 * Role-Based Access Control (RBAC) Express Middleware
 * @param {Array<string>} allowedRoles - Array of permitted roles, e.g. ['ADMIN', 'TEACHER']
 */
export function verifyRole(allowedRoles = []) {
  return (req, res, next) => {
    const userRole = (req.user?.role || 'GUEST').toUpperCase();

    if (allowedRoles.length > 0 && !allowedRoles.includes(userRole) && userRole !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        message: `Access denied. Requires one of the following roles: ${allowedRoles.join(', ')}`
      });
    }

    next();
  };
}
