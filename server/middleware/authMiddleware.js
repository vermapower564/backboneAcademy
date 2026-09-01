/**
 * Role-Based Access Control (RBAC) Express Middleware
 * @param {Array<string>} allowedRoles - Array of permitted roles, e.g. ['ADMIN', 'TEACHER']
 */
export function verifyRole(allowedRoles = []) {
  return (req, res, next) => {
    // Read user role from header or body (or request context)
    const userRole = req.headers['x-user-role'] || req.body.userRole || 'GUEST';

    if (allowedRoles.length > 0 && !allowedRoles.includes(userRole.toUpperCase()) && userRole.toUpperCase() !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        message: `Access denied. Requires one of the following roles: ${allowedRoles.join(', ')}`
      });
    }

    next();
  };
}
