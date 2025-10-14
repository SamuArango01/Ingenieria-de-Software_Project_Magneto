// src/modules/interviews/interfaces/IInterviewRepository.ts
import { Interview } from '../entities/Interview';

export interface IInterviewRepository {
  findById(id: number): Promise<Interview | null>;
  create(interview: Partial<Interview>): Promise<Interview>;
  update(id: number, interview: Partial<Interview>): Promise<Interview | null>;
}