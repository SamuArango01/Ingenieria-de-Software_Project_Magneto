// src/routes/index.ts
import { Router } from 'express';
import interviewTypeRoutes from '@/modules/interview-types/routes/InterviewTypeRoutes';
import workFieldRoutes from '@/modules/work-fields/routes/WorkFieldRoutes';
import userConfigurationRoutes from '@/modules/user-configurations/routes/UserConfigurationRoutes';
import interviewRoutes from '@/modules/interviews/routes/InterviewRoutes'; // ← NUEVA IMPORTACIÓN

const router = Router();

router.use('/interview-types', interviewTypeRoutes);
router.use('/work-fields', workFieldRoutes);
router.use('/user-configurations', userConfigurationRoutes);
router.use('/interviews', interviewRoutes); // ← NUEVA RUTA

export default router;