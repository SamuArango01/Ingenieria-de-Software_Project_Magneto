import type { Request, Response } from 'express';
import { getAuth } from '@clerk/express';
import { fromThrowable } from 'neverthrow'; // Importamos fromThrowable
import { InterviewEvaluationService } from '@/modules/interview-evaluations/services/InterviewEvaluationService';
import type { IInterviewEvaluationService } from '@/modules/interview-evaluations/interfaces/IInterviewEvaluationService';
import { generateContent } from '@/../helpers/GenerateContent';

// Prompt mejorado para solicitar una respuesta JSON
const SUMMARY_PROMPT_TEMPLATE = `
Act as an AI interviewer. Your task is to analyze the following interview summary.
Respond ONLY with a valid JSON object. Do not include any text before or after the JSON object.
The JSON object must conform to this structure:
{
  "feedback": "A string containing personalized and direct feedback for the candidate in Spanish. The feedback must follow this structure internally: 📌 Resumen general... ✅ Fortalezas... ⚠️ Debilidades... 🎯 Recomendaciones...",
  "rating": "An integer from 1 to 10 based on the candidate's overall performance."
}

Interview to analyze:
%CONVERSATION%
`;

// Interfaz para el objeto JSON esperado
interface AiResponse {
    feedback: string;
    rating: number;
}

// Creamos una versión "segura" de JSON.parse que devuelve un Result
const safeJsonParse = fromThrowable(JSON.parse, (error) => error as Error);

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

        const { interviewHistory, interviewId } = req.body;

        if (!interviewHistory || interviewHistory.length === 0) {
            res.status(400).json({ message: 'No se proporcionó historial de entrevista.' });
            return;
        }
        if (!interviewId) {
            res.status(400).json({ message: 'El ID de la entrevista es requerido.' });
            return;
        }

        // 1. Generar el contenido JSON
        const conversation = interviewHistory
            .map((turn: { user: string; ai: string }) => `Respuesta: ${turn.user}
Pregunta: ${turn.ai}`)
            .join('\n\n');
        
        const summaryPrompt = SUMMARY_PROMPT_TEMPLATE.replace('%CONVERSATION%', conversation);
        const rawAiResponse = await generateContent(summaryPrompt);

        // 2. Parsear la respuesta JSON de forma segura
        const parseResult = safeJsonParse(rawAiResponse);

        if (parseResult.isErr()) {
            console.error("Error parsing JSON from AI:", parseResult.error);
            res.status(500).json({ message: 'Error al procesar la respuesta de la IA.' });
            return;
        }

        // A partir de aquí, sabemos que el parseo fue exitoso
        const aiData = parseResult.value as AiResponse;

        // 3. Llamar al servicio para guardar
        const saveResult = await this.evaluationService.createEvaluation({
            feedback: aiData.feedback,
            interviewId,
            rating: aiData.rating
        });

        // 4. Manejar la respuesta
        saveResult.match(
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
