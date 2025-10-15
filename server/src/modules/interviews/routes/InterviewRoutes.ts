// src/modules/interviews/routes/InterviewRoutes.ts
import { Router } from 'express';
import { InterviewController } from '../controllers/InterviewController';
import { InterviewService } from '../services/InterviewService';
import multer from 'multer';

const router = Router();
const interviewService = new InterviewService();
const interviewController = new InterviewController(interviewService);

const upload = multer({
    dest: "uploads/",
    limits: {
        fileSize: 25 * 1024 * 1024,
    },
});

//  Ruta para iniciar entrevista 
router.post('/start-star-interview', (req, res) => 
    interviewController.startStarInterview(req, res)
);

//  Ruta para procesar audio
router.post('/audio', upload.single("audio"), (req, res) => 
    interviewController.processAudio(req, res)
);

//  Ruta para enviar email
router.post('/email', (req, res) => 
    interviewController.sendEmail(req, res)
);

//  Ruta para evaluar entrevista
router.post('/evaluate', (req, res) =>
    interviewController.evaluateInterview(req, res)
);

export default router;