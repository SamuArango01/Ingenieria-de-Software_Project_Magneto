// src/modules/interview-evaluations/services/InterviewEvaluationService.ts
import { ok, err, Result } from 'neverthrow';
import { InterviewEvaluation } from '../entities/InterviewEvaluation';
import type { 
  IInterviewEvaluationService,
  CreateEvaluationDto,
  EvaluationNotFoundError,
  InterviewNotFoundError
} from '../interfaces/IInterviewEvaluationService';
import type { IInterviewEvaluationRepository } from '../interfaces/IInterviewEvaluationRepository';
import type { IInterviewRepository } from '@/modules/interviews/interfaces/IInterviewRepository';

export class InterviewEvaluationService implements IInterviewEvaluationService {
  constructor(
    private evaluationRepository: IInterviewEvaluationRepository,
    private interviewRepository: IInterviewRepository
  ) {}

  async createEvaluation(dto: CreateEvaluationDto): Promise<Result<InterviewEvaluation, InterviewNotFoundError>> {
    // Verificar que la entrevista existe
    const interview = await this.interviewRepository.findById(dto.interviewId);
    if (!interview) {
      return err({
        type: 'InterviewNotFoundError',
        message: `Interview with ID ${dto.interviewId} not found`
      });
    }

    // Crear la evaluación usando el constructor
    const evaluation = new InterviewEvaluation({
      interviewId: dto.interviewId,
      areasToImprove: dto.areasToImprove,
      strengths: dto.strengths || null, // ✅ Usar null en lugar de undefined
      aiFeedback: dto.aiFeedback || null // ✅ Usar null en lugar de undefined
    });

    const createdEvaluation = await this.evaluationRepository.create(evaluation);
    return ok(createdEvaluation);
  }

  async getEvaluationByInterviewId(interviewId: number): Promise<Result<InterviewEvaluation, EvaluationNotFoundError>> {
    const evaluation = await this.evaluationRepository.findByInterviewId(interviewId);
    
    if (!evaluation) {
      return err({
        type: 'EvaluationNotFoundError',
        message: `Evaluation for interview ID ${interviewId} not found`
      });
    }

    return ok(evaluation);
  }

  async updateEvaluation(id: number, dto: Partial<CreateEvaluationDto>): Promise<Result<InterviewEvaluation, EvaluationNotFoundError>> {
    const updatedEvaluation = await this.evaluationRepository.update(id, dto);
    
    if (!updatedEvaluation) {
      return err({
        type: 'EvaluationNotFoundError',
        message: `Evaluation with ID ${id} not found`
      });
    }

    return ok(updatedEvaluation);
  }
}