
// src/modules/interview-evaluations/interfaces/IInterviewEvaluationService.ts
import { Result } from 'neverthrow';
import { InterviewEvaluation } from '../entities/InterviewEvaluation';

export interface CreateEvaluationDto {
  interviewId: number;
  areasToImprove: string;
  strengths?: string | null; // ✅ Permitir string o null
  aiFeedback?: string | null; // ✅ Permitir string o null
}

export type EvaluationNotFoundError = {
  type: 'EvaluationNotFoundError';
  message: string;
};

export type InterviewNotFoundError = {
  type: 'InterviewNotFoundError';
  message: string;
};

export interface IInterviewEvaluationService {
  createEvaluation(dto: CreateEvaluationDto): Promise<Result<InterviewEvaluation, InterviewNotFoundError>>;
  getEvaluationByInterviewId(interviewId: number): Promise<Result<InterviewEvaluation, EvaluationNotFoundError>>;
  updateEvaluation(id: number, dto: Partial<CreateEvaluationDto>): Promise<Result<InterviewEvaluation, EvaluationNotFoundError>>;
}