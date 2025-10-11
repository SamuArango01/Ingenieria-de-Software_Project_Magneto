import { Router } from 'express';
import interviewTypeRoutes from '@/modules/interview-types/routes/InterviewTypeRoutes';
import workFieldRoutes from '@/modules/work-fields/routes/WorkFieldRoutes';
import userConfigurationRoutes from '@/modules/user-configurations/routes/UserConfigurationRoutes';

const router = Router();

router.use('/interview-types', interviewTypeRoutes);
router.use('/work-fields', workFieldRoutes);
router.use('/user-configurations', userConfigurationRoutes);

export default router;
