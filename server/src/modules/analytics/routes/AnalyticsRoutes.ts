import { Router } from 'express';
import { AnalyticsController } from '@/modules/analytics/controllers/AnalyticsController';
import { AnalyticsService } from '@/modules/analytics/services/AnalyticsService';
import { requireRecruiter } from '@/middleware/requireRecruiter';

const router = Router();
const analyticsService = new AnalyticsService();
const analyticsController = new AnalyticsController(analyticsService);

// GET /api/v1/analytics/candidates - Lista paginada de candidatos (solo recruiters)
router.get('/candidates', requireRecruiter, (req, res) => analyticsController.getCandidates(req, res));

// GET /api/v1/analytics/candidates/:userId - Detalle de un candidato
// Permite acceso a recruiters (ven cualquier perfil) y candidates (solo su propio perfil)
router.get('/candidates/:userId', (req, res) => analyticsController.getCandidateDetail(req, res));

// GET /api/v1/analytics/overview - Métricas generales del sistema (solo recruiters)
router.get('/overview', requireRecruiter, (req, res) => analyticsController.getOverview(req, res));

export default router;
