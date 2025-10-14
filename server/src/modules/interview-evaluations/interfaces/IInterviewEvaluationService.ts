import { Result } from "neverthrow";
import { InterviewEvaluation } from "@/modules/interview-evaluations/entities/InterviewEvaluation";

// Definimos un tipo de error personalizado para el servicio
export type CreateEvaluationError = { type: 'ValidationError', message: string } | { type: 'DatabaseError', cause: Error };

export interface IInterviewEvaluationService {
    createEvaluation(data: { feedback: string; interviewId: number; rating?: number }): Promise<Result<InterviewEvaluation, CreateEvaluationError>>;
}