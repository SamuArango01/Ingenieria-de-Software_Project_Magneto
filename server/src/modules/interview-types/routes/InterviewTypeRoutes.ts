import { Router } from 'express';
import { InterviewTypeController } from '@/modules/interview-types/controllers/InterviewTypeController';
import { InterviewTypeService } from '@/modules/interview-types/services/InterviewTypeService';

const router = Router();
const interviewTypeService = new InterviewTypeService();
const interviewTypeController = new InterviewTypeController(interviewTypeService);

router.get('/available', (req, res) => interviewTypeController.getAvailableTypesForUser(req, res));
router.post('/', (req, res) => interviewTypeController.createInterviewType(req, res));
router.get('/', (req, res) => interviewTypeController.listUserInterviewTypes(req, res));
router.get('/:id', (req, res) => interviewTypeController.getInterviewTypeById(req, res));
router.put('/:id', (req, res) => interviewTypeController.updateInterviewType(req, res));
router.patch('/:id/toggle-active', (req, res) => interviewTypeController.toggleInterviewTypeActive(req, res));

export default router;