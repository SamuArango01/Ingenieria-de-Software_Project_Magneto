import { AppDataSource } from '@/database/data-source';
import { WorkField } from '@/modules/work-fields/entities/WorkField';
import { IWorkFieldRepository } from '@/modules/work-fields/interfaces/IWorkFieldRepository';
import { Repository } from 'typeorm';

export class WorkFieldRepository implements IWorkFieldRepository {
  private repository: Repository<WorkField>;

  constructor() {
    this.repository = AppDataSource.getRepository(WorkField);
  }

  findAll(): Promise<WorkField[]> {
    return this.repository.find();
  }

  findById(id: number): Promise<WorkField | null> {
    return this.repository.findOne({ where: { id } });
  }

  create(data: Partial<WorkField>): WorkField {
    return this.repository.create(data);
  }

  save(workField: WorkField): Promise<WorkField> {
    return this.repository.save(workField);
  }
}
