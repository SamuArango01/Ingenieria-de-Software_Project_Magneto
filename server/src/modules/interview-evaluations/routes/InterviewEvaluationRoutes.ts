import { Router } from 'express';
import { InterviewEvaluationController } from '@/modules/interview-evaluations/controllers/InterviewEvaluationController';
import { InterviewEvaluationService } from '@/modules/interview-evaluations/services/InterviewEvaluationService';

const router = Router();
const evaluationService = new InterviewEvaluationService();
const evaluationController = new InterviewEvaluationController(evaluationService);

// Se usa la función de flecha aquí para mantener el contexto de 'this' en el controlador
router.post('/', (req, res) => evaluationController.createEvaluation(req, res));

export default router;
