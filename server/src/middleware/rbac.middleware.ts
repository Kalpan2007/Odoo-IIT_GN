import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth.middleware';

type Role = 'admin' | 'project_manager' | 'team_member';

/**
 * Middleware to check user roles
 */
export const checkRole = (allowedRoles: Role[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
      }

      const userRole = req.user.role as Role;
      
      if (!allowedRoles.includes(userRole)) {
        return res.status(403).json({
          success: false,
          message: 'Insufficient permissions',
          required: allowedRoles,
          current: userRole
        });
      }

      next();
    } catch (error) {
      console.error('RBAC middleware error:', error);
      return res.status(500).json({
        success: false,
        message: 'Authorization error'
      });
    }
  };
};

/**
 * Check if user is admin
 */
export const isAdmin = checkRole(['admin']);

/**
 * Check if user is admin or project manager
 */
export const isAdminOrPM = checkRole(['admin', 'project_manager']);

/**
 * Check if user has any authenticated role
 */
export const isAuthenticated = checkRole(['admin', 'project_manager', 'team_member']);