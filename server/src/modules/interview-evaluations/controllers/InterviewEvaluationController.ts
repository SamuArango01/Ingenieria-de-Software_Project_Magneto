import type { Request, Response } from 'express';
import { getAuth } from '@clerk/express';
import { InterviewEvaluationService } from '@/modules/interview-evaluations/services/InterviewEvaluationService';
import type { IInterviewEvaluationService } from '@/modules/interview-evaluations/interfaces/IInterviewEvaluationService';
import { generateContent } from '@/../helpers/GenerateContent';

const SUMMARY_PROMPT_TEMPLATE = `
Act as an AI interviewer. Your task is to write personalized and direct feedback for the candidate, based on the following summary of their interview. The feedback should be in Spanish and follow this format naturally:

📌 Resumen general: A brief and honest description of their performance.
✅ Fortalezas: List their main strengths.
⚠️ Debilidades: Point out areas for improvement, detailing technical aspects and soft skills.
🎯 Recomendaciones: Offer concrete and useful suggestions for next steps.

Address the candidate directly, as if you were talking to a person. Be concise and get to the point.

Entrevista:
%CONVERSATION%
`;

export class InterviewEvaluationController {
    private evaluationService: IInterviewEvaluationService;

    constructor(evaluationService: IInterviewEvaluationService = new InterviewEvaluationService()) {
        this.evaluationService = evaluationService;
    }

    public async createEvaluation(req: Request, res: Response): Promise<void> {
        const { userId } = getAuth(req);
        if (!userId) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }

        const { interviewHistory, interviewId, rating } = req.body;

        if (!interviewHistory || interviewHistory.length === 0) {
            res.status(400).json({ message: 'No se proporcionó historial de entrevista.' });
            return;
        }
        if (!interviewId) {
            res.status(400).json({ message: 'El ID de la entrevista es requerido.' });
            return;
        }

        // 1. Generar el contenido del feedback
        const conversation = interviewHistory
            .map((turn: { user: string; ai: string }) => `Respuesta: ${turn.user}
Pregunta: ${turn.ai}`)
            .join('\n\n');
        
        const summaryPrompt = SUMMARY_PROMPT_TEMPLATE.replace('%CONVERSATION%', conversation);
        const feedbackText = await generateContent(summaryPrompt);

        // 2. Llamar al servicio para guardar el feedback
        const result = await this.evaluationService.createEvaluation({
            feedback: feedbackText,
            interviewId,
            rating
        });

        // 3. Manejar la respuesta
        result.match(
            (savedEvaluation) => {
                res.status(201).json(savedEvaluation);
            },
            (error) => {
                if (error.type === 'ValidationError') {
                    res.status(400).json({ message: error.message });
                } else {
                    console.error('Database Error:', error.cause);
                    res.status(500).json({ message: 'Error interno del servidor.' });
                }
            }
        );
    }
}
