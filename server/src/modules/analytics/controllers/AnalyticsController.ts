import type { Request, Response } from 'express';
import { getAuth } from '@clerk/express';
import type { IAnalyticsService } from '@/modules/analytics/interfaces/IAnalyticsService';
import { AnalyticsService } from '@/modules/analytics/services/AnalyticsService';
import { GetCandidatesDto, SortByField, SortOrder } from '@/modules/analytics/dto/GetCandidatesDto';
import { UserRoleService } from '@/modules/roles/services/UserRoleService';
import { RoleType } from '@/modules/roles/entities/UserRole';

export class AnalyticsController {
  private analyticsService: IAnalyticsService;

  constructor(analyticsService: IAnalyticsService = new AnalyticsService()) {
    this.analyticsService = analyticsService;
  }

  /**
   * GET /api/v1/analytics/candidates
   * Obtiene lista paginada de candidatos con métricas
   */
  async getCandidates(req: Request, res: Response): Promise<void> {
    const { userId } = getAuth(req);
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    try {
      // Extraer y validar query parameters
      const filters: GetCandidatesDto = {
        page: req.query.page ? parseInt(req.query.page as string, 10) : 1,
        limit: req.query.limit ? parseInt(req.query.limit as string, 10) : 20,
        sortBy: (req.query.sortBy as SortByField) || SortByField.AVG_SCORE,
        order: (req.query.order as SortOrder) || SortOrder.DESC
      };

      // Validar que sortBy sea un valor válido
      if (filters.sortBy && !Object.values(SortByField).includes(filters.sortBy)) {
        res.status(400).json({
          message: `Invalid sortBy value. Must be one of: ${Object.values(SortByField).join(', ')}`
        });
        return;
      }

      // Validar que order sea un valor válido
      if (filters.order && !Object.values(SortOrder).includes(filters.order)) {
        res.status(400).json({
          message: `Invalid order value. Must be one of: ${Object.values(SortOrder).join(', ')}`
        });
        return;
      }

      const result = await this.analyticsService.getCandidates(filters);

      result.match(
        (response) => res.json(response),
        (error) => {
          if (error.type === 'ValidationError') {
            res.status(400).json({ message: error.message });
          } else {
            res.status(500).json({ message: 'Internal server error' });
          }
        }
      );
    } catch (error) {
      console.error('Error in getCandidates controller:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  /**
   * GET /api/v1/analytics/candidates/:userId
   * Obtiene detalle completo de un candidato
   * - Si eres RECRUITER: devuelve el perfil del userId solicitado
   * - Si NO eres RECRUITER: devuelve tu propio perfil (ignora el userId del parámetro)
   */
  async getCandidateDetail(req: Request, res: Response): Promise<void> {
    const { userId: authUserId } = getAuth(req);
    if (!authUserId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    try {
      const { userId: requestedUserId } = req.params;

      if (!requestedUserId) {
        res.status(400).json({ message: 'User ID parameter is required' });
        return;
      }

      // Verificar si el usuario autenticado es recruiter
      const userRoleService = new UserRoleService();
      const roleResult = await userRoleService.hasRole(authUserId, RoleType.RECRUITER);

      let targetUserId: string;

      roleResult.match(
        (isRecruiter) => {
          if (isRecruiter) {
            // Si es recruiter, puede ver el perfil solicitado
            targetUserId = requestedUserId;
          } else {
            // Si NO es recruiter (es candidate), solo puede ver su propio perfil
            targetUserId = authUserId;
          }
        },
        () => {
          // En caso de error al verificar rol, por seguridad solo mostrar propio perfil
          targetUserId = authUserId;
        }
      );

      const result = await this.analyticsService.getCandidateDetail(targetUserId);

      result.match(
        (response) => res.json(response),
        (error) => {
          if (error.type === 'ValidationError') {
            res.status(400).json({ message: error.message });
          } else if (error.type === 'NotFoundError') {
            res.status(404).json({ message: error.message });
          } else {
            res.status(500).json({ message: 'Internal server error' });
          }
        }
      );
    } catch (error) {
      console.error('Error in getCandidateDetail controller:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  /**
   * GET /api/v1/analytics/overview
   * Obtiene métricas generales del sistema
   */
  async getOverview(req: Request, res: Response): Promise<void> {
    const { userId } = getAuth(req);
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    try {
      const result = await this.analyticsService.getOverview();

      result.match(
        (response) => res.json(response),
        () => res.status(500).json({ message: 'Internal server error' })
      );
    } catch (error) {
      console.error('Error in getOverview controller:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}
