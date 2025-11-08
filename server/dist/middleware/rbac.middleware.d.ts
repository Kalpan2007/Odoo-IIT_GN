import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth.middleware';
type Role = 'admin' | 'project_manager' | 'team_member';
export declare const checkRole: (allowedRoles: Role[]) => (req: AuthRequest, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
export declare const isAdmin: (req: AuthRequest, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
export declare const isAdminOrPM: (req: AuthRequest, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
export declare const isAuthenticated: (req: AuthRequest, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
export {};
//# sourceMappingURL=rbac.middleware.d.ts.map