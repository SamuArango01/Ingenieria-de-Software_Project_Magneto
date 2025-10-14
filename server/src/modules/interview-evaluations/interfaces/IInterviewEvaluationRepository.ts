// src/modules/interview-evaluations/interfaces/IInterviewEvaluationRepository.ts
import { Result } from 'neverthrow';
import { InterviewEvaluation } from '../entities/InterviewEvaluation';

export interface IInterviewEvaluationRepository {
  create(evaluation: InterviewEvaluation): Promise<InterviewEvaluation>;
  findByInterviewId(interviewId: number): Promise<InterviewEvaluation | null>;
  update(id: number, evaluation: Partial<InterviewEvaluation>): Promise<InterviewEvaluation | null>;
}