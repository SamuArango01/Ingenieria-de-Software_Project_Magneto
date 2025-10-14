// src/modules/interview-evaluations/repositories/InterviewEvaluationRepository.ts
import { Repository } from 'typeorm';
import { AppDataSource } from '@/database/data-source'; // Ajusta según tu configuración
import { InterviewEvaluation } from '../entities/InterviewEvaluation';
import type { IInterviewEvaluationRepository } from '../interfaces/IInterviewEvaluationRepository';


export class InterviewEvaluationRepository implements IInterviewEvaluationRepository {
  private repository: Repository<InterviewEvaluation>;

  constructor() {
    this.repository = AppDataSource.getRepository(InterviewEvaluation);
  }

  async create(evaluation: InterviewEvaluation): Promise<InterviewEvaluation> {
    const created = this.repository.create(evaluation);
    return await this.repository.save(created);
  }

  async findByInterviewId(interviewId: number): Promise<InterviewEvaluation | null> {
    return await this.repository.findOne({
      where: { interviewId },
      relations: ['interview']
    });
  }

  async update(id: number, evaluation: Partial<InterviewEvaluation>): Promise<InterviewEvaluation | null> {
    await this.repository.update(id, evaluation);
    return await this.repository.findOne({ where: { id } });
  }
}