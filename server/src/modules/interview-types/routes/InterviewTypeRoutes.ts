import { Router } from 'express';
import { InterviewTypeController } from '@/modules/interview-types/controllers/InterviewTypeController';

const router = Router();
const interviewTypeController = new InterviewTypeController();

router.get('/available', (req, res) => interviewTypeController.getAvailableTypesForUser(req, res));
router.post('/', (req, res) => interviewTypeController.createInterviewType(req, res));
router.get('/', (req, res) => interviewTypeController.listUserInterviewTypes(req, res));
router.put('/:id', (req, res) => interviewTypeController.updateInterviewType(req, res));
router.patch('/:id/toggle-active', (req, res) => interviewTypeController.toggleInterviewTypeActive(req, res));

export default router;
