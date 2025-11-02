import { Router } from 'express';
import { AnalyticsController } from '@/modules/analytics/controllers/AnalyticsController';
import { AnalyticsService } from '@/modules/analytics/services/AnalyticsService';
import { requireRecruiter } from '@/middleware/requireRecruiter';

const router = Router();
const analyticsService = new AnalyticsService();
const analyticsController = new AnalyticsController(analyticsService);

// Todas las rutas de analytics requieren rol de recruiter
router.use(requireRecruiter);

// GET /api/v1/analytics/candidates - Lista paginada de candidatos
router.get('/candidates', (req, res) => analyticsController.getCandidates(req, res));

// GET /api/v1/analytics/candidates/:userId - Detalle de un candidato
router.get('/candidates/:userId', (req, res) => analyticsController.getCandidateDetail(req, res));

// GET /api/v1/analytics/overview - Métricas generales del sistema
router.get('/overview', (req, res) => analyticsController.getOverview(req, res));

export default router;
