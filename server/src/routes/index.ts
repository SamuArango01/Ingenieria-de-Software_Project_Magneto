import { Router } from 'express';
import interviewTypeRoutes from '@/modules/interview-types/routes/InterviewTypeRoutes';

const router = Router();

router.use('/interview-types', interviewTypeRoutes);

export default router;
