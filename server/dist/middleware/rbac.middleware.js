"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuthenticated = exports.isAdminOrPM = exports.isAdmin = exports.checkRole = void 0;
const checkRole = (allowedRoles) => {
    return (req, res, next) => {
        try {
            if (!req.user) {
                return res.status(401).json({
                    success: false,
                    message: 'Authentication required'
                });
            }
            const userRole = req.user.role;
            if (!allowedRoles.includes(userRole)) {
                return res.status(403).json({
                    success: false,
                    message: 'Insufficient permissions',
                    required: allowedRoles,
                    current: userRole
                });
            }
            next();
        }
        catch (error) {
            console.error('RBAC middleware error:', error);
            return res.status(500).json({
                success: false,
                message: 'Authorization error'
            });
        }
    };
};
exports.checkRole = checkRole;
exports.isAdmin = (0, exports.checkRole)(['admin']);
exports.isAdminOrPM = (0, exports.checkRole)(['admin', 'project_manager']);
exports.isAuthenticated = (0, exports.checkRole)(['admin', 'project_manager', 'team_member']);
//# sourceMappingURL=rbac.middleware.js.map