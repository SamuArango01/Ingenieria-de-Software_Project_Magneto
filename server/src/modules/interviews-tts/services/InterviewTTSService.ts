import { ok, err, Result } from 'neverthrow';
import type {
    IInterviewTTSService,
    StartInterviewTTSInput,
    SaveMessageInput,
    AIResponseData
} from '@/modules/interviews-tts/interfaces/IInterviewTTSService';
import { InterviewTTS } from '@/modules/interviews-tts/entities/InterviewTTS';
import { IInterviewTTSRepository } from '../interfaces/IInterviewTTSRepository';
import { InterviewTTSRepository } from '../repositories/InterviewTTSRepository';
import { IInterviewTTSMessageRepository } from '../interfaces/IInterviewTTSMessageRepository';
import { InterviewTTSMessageRepository } from '../repositories/InterviewTTSMessageRepository';
import { generateContent } from '../../../../helpers/GenerateContent';
import { InterviewTypeService } from '@/modules/interview-types/services/InterviewTypeService';

export class InterviewTTSService implements IInterviewTTSService {
    private interviewRepository: IInterviewTTSRepository;
    private messageRepository: IInterviewTTSMessageRepository;
    private interviewTypeService: InterviewTypeService;

    constructor() {
        this.interviewRepository = new InterviewTTSRepository();
        this.messageRepository = new InterviewTTSMessageRepository();
        this.interviewTypeService = new InterviewTypeService();
    }

    /**
     * Start a new voice-to-voice interview session
     */
    public async startInterview(input: StartInterviewTTSInput): Promise<Result<InterviewTTS, Error>> {
        try {
            // Create interview record
            const interview = this.interviewRepository.create({
                userId: input.userId,
                interviewTypeId: input.interviewTypeId || null,
                status: "in_progress"
            });

            const savedInterview = await this.interviewRepository.save(interview);

            return ok(savedInterview);
        } catch (error) {
            console.error("Error starting TTS interview:", error);
            return err(new Error("Failed to start interview"));
        }
    }

    /**
     * Save a message to the conversation history
     */
    public async saveMessage(input: SaveMessageInput): Promise<Result<void, Error>> {
        try {
            // Get current message count to determine order
            const messageCount = await this.messageRepository.countByInterviewId(input.interviewId);

            const message = this.messageRepository.create({
                interviewId: input.interviewId,
                role: input.role,
                message: input.message,
                audioDurationSeconds: input.audioDurationSeconds,
                messageOrder: messageCount + 1
            });

            await this.messageRepository.save(message);

            return ok(undefined);
        } catch (error) {
            console.error("Error saving message:", error);
            return err(new Error("Failed to save message"));
        }
    }

    /**
     * Generate AI response with decision to end interview or not
     */
    public async generateAIResponse(interviewId: number, userMessage: string): Promise<Result<AIResponseData, Error>> {
        try {
            // Get interview details
            const interview = await this.interviewRepository.findById(interviewId);
            if (!interview) {
                return err(new Error("Interview not found"));
            }

            // Get conversation history
            const messages = await this.messageRepository.findByInterviewId(interviewId);

            // Get interview type context if available
            let interviewTypeContext = "";
            if (interview.interviewTypeId) {
                const typeResult = await this.interviewTypeService.getInterviewTypeById(interview.interviewTypeId);
                if (typeResult.isOk()) {
                    const type = typeResult.value;
                    interviewTypeContext = `\n\nTipo de entrevista: ${type.name}\nDescripción: ${type.description || "General"}`;
                }
            }

            // Calculate elapsed time
            const elapsedMinutes = (Date.now() - interview.startedAt.getTime()) / 60000;
            const remainingMinutes = Math.max(0, 10 - elapsedMinutes);

            // Build conversation history for context
            const conversationHistory = messages.map(m =>
                `${m.role === 'user' ? 'Candidato' : 'Entrevistador'}: ${m.message}`
            ).join('\n');

            // Generate AI response with structured output
            const prompt = `Eres un entrevistador profesional de IA realizando una entrevista por voz en tiempo real.
${interviewTypeContext}

HISTORIAL DE LA CONVERSACIÓN:
${conversationHistory}

ÚLTIMA RESPUESTA DEL CANDIDATO:
${userMessage}

TIEMPO TRANSCURRIDO: ${elapsedMinutes.toFixed(1)} minutos de 10 minutos máximo.
TIEMPO RESTANTE: ${remainingMinutes.toFixed(1)} minutos.

TU TAREA:
1. Genera una pregunta de seguimiento natural y conversacional en español
2. Decide si la entrevista debe terminar basándote en:
   - ¿Se han cubierto los temas principales del tipo de entrevista?
   - ¿Las respuestas del candidato han sido consistentemente buenas o malas?
   - ¿Hay suficiente información para evaluar al candidato? (mínimo 3-4 intercambios)
   - ¿Se está acabando el tiempo? (si quedan menos de 2 minutos, considera terminar)

IMPORTANTE:
- Sé natural y conversacional
- No hagas preguntas demasiado largas
- Si decides terminar (shouldEnd: true), haz una pregunta final de cierre o un comentario de despedida
- NO termines antes de al menos 3-4 intercambios de conversación

Responde ÚNICAMENTE con un JSON válido con esta estructura:
{
  "message": "tu pregunta o comentario aquí",
  "shouldEnd": false o true,
  "reason": "breve explicación de por qué decides terminar (solo si shouldEnd es true)",
  "topicsCovered": ["tema1", "tema2"] (lista de temas que ya se han cubierto)
}`;

            const aiResponse = await generateContent(prompt);

            // Parse JSON response
            let responseData: AIResponseData;
            try {
                // Clean the response (remove markdown code blocks if present)
                let cleanedResponse = aiResponse.trim();
                if (cleanedResponse.startsWith('```json')) {
                    cleanedResponse = cleanedResponse.substring(7);
                }
                if (cleanedResponse.startsWith('```')) {
                    cleanedResponse = cleanedResponse.substring(3);
                }
                if (cleanedResponse.endsWith('```')) {
                    cleanedResponse = cleanedResponse.substring(0, cleanedResponse.length - 3);
                }

                responseData = JSON.parse(cleanedResponse.trim());
            } catch (parseError) {
                // If JSON parsing fails, use the response as-is
                console.error("Failed to parse AI response as JSON:", parseError);
                responseData = {
                    message: aiResponse,
                    shouldEnd: false
                };
            }

            // Force end if time is almost up (>9.5 minutes)
            if (elapsedMinutes > 9.5 && !responseData.shouldEnd) {
                responseData.shouldEnd = true;
                responseData.reason = "Tiempo límite alcanzado";
            }

            return ok(responseData);
        } catch (error) {
            console.error("Error generating AI response:", error);
            return err(new Error("Failed to generate AI response"));
        }
    }

    /**
     * End the interview session
     */
    public async endInterview(interviewId: number, endedByAI: boolean, reason?: string): Promise<Result<void, Error>> {
        try {
            const interview = await this.interviewRepository.findById(interviewId);
            if (!interview) {
                return err(new Error("Interview not found"));
            }

            // Calculate duration
            const durationMs = Date.now() - interview.startedAt.getTime();
            const durationMinutes = Math.round(durationMs / 60000);

            // Update interview
            interview.status = "completed";
            interview.completedAt = new Date();
            interview.durationMinutes = durationMinutes;
            interview.endedByAI = endedByAI;
            if (reason) {
                interview.endReason = reason;
            }

            await this.interviewRepository.save(interview);

            return ok(undefined);
        } catch (error) {
            console.error("Error ending interview:", error);
            return err(new Error("Failed to end interview"));
        }
    }

    /**
     * Get interview by ID
     */
    public async getInterview(interviewId: number): Promise<Result<InterviewTTS, Error>> {
        try {
            const interview = await this.interviewRepository.findById(interviewId);
            if (!interview) {
                return err(new Error("Interview not found"));
            }
            return ok(interview);
        } catch (error) {
            console.error("Error getting interview:", error);
            return err(new Error("Failed to get interview"));
        }
    }
}
