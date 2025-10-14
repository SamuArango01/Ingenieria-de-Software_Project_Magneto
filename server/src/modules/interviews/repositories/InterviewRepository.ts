// src/modules/interviews/repositories/InterviewRepository.ts
import { Repository } from 'typeorm';
import { AppDataSource } from '@/database/data-source';
import { Interview } from '../entities/Interview';
import type { IInterviewRepository } from '../interfaces/IInterviewRepository';

export class InterviewRepository implements IInterviewRepository {
  private repository: Repository<Interview>;

  constructor() {
    this.repository = AppDataSource.getRepository(Interview);
  }

  async findById(id: number): Promise<Interview | null> {
    return await this.repository.findOne({ 
      where: { id },
      relations: ['user', 'interviewType']
    });
  }

  async create(interview: Partial<Interview>): Promise<Interview> {
    const created = this.repository.create(interview);
    return await this.repository.save(created);
  }

  async update(id: number, interview: Partial<Interview>): Promise<Interview | null> {
    await this.repository.update(id, interview);
    return await this.repository.findOne({ 
      where: { id },
      relations: ['user', 'interviewType']
    });
  }
}