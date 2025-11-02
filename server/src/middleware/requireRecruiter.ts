import { Request, Response, NextFunction } from 'express';
import { getAuth } from '@clerk/express';
import { UserRoleService } from '@/modules/roles/services/UserRoleService';
import { RoleType } from '@/modules/roles/entities/UserRole';

/**
 * Middleware para verificar que el usuario autenticado tiene rol de recruiter
 *
 * Uso:
 * router.get('/analytics', requireRecruiter, controller.method);
 *
 * Retorna:
 * - 401 si no está autenticado
 * - 403 si no tiene rol de recruiter
 * - next() si tiene permiso
 */
export const requireRecruiter = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { userId } = getAuth(req);

    if (!userId) {
      res.status(401).json({ message: 'Unauthorized: Authentication required' });
      return;
    }

    const userRoleService = new UserRoleService();
    const result = await userRoleService.hasRole(userId, RoleType.RECRUITER);

    result.match(
      (hasRecruiterRole) => {
        if (!hasRecruiterRole) {
          res.status(403).json({
            message: 'Forbidden: Only recruiters can access this resource'
          });
          return;
        }
        next();
      },
      (error) => {
        res.status(500).json({ message: 'Internal server error' });
      }
    );
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};
