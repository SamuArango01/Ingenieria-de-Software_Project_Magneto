import { ok, err, Result } from 'neverthrow';
import { WorkField } from '@/modules/work-fields/entities/WorkField';
import type { IWorkFieldRepository } from '@/modules/work-fields/interfaces/IWorkFieldRepository';
import type { 
  IWorkFieldService,
  CreateWorkFieldDto,
  UpdateWorkFieldDto,
  WorkFieldNotFoundError,
  ValidationError,
  WorkFieldAlreadyExistsError
} from '@/modules/work-fields/interfaces/IWorkFieldService';
import { WorkFieldRepository } from '@/modules/work-fields/repositories/WorkFieldRepository';
import { In } from 'typeorm';

export class WorkFieldService implements IWorkFieldService {
  private workFieldRepository: IWorkFieldRepository;

  constructor(workFieldRepository: IWorkFieldRepository = new WorkFieldRepository()) {
    this.workFieldRepository = workFieldRepository;
  }

  async listAll(): Promise<Result<WorkField[], never>> {
    const workFields = await this.workFieldRepository.findAll();
    return ok(workFields);
  }

  async findById(id: number): Promise<Result<WorkField, WorkFieldNotFoundError>> {
    const workField = await this.workFieldRepository.findById(id);
    if (!workField) {
      return err({ type: 'WorkFieldNotFoundError', message: `Campo de trabajo con ID ${id} no encontrado.` });
    }
    return ok(workField);
  }

  async create(dto: CreateWorkFieldDto): Promise<Result<WorkField, ValidationError | WorkFieldAlreadyExistsError>> {
    if (!dto.description || dto.description.trim() === '') {
      return err({ type: 'ValidationError', message: 'La descripción es requerida.' });
    }

    // Lógica para verificar si ya existe (puedes mejorarla según tus necesidades)
    // const existing = await this.workFieldRepository.findBy({ description: dto.description });
    // if (existing.length > 0) {
    //   return err({ type: 'WorkFieldAlreadyExistsError', message: `El campo de trabajo "${dto.description}" ya existe.` });
    // }

    const newWorkField = this.workFieldRepository.create(dto);
    const savedWorkField = await this.workFieldRepository.save(newWorkField);
    return ok(savedWorkField);
  }

  async update(id: number, dto: UpdateWorkFieldDto): Promise<Result<WorkField, WorkFieldNotFoundError | ValidationError | WorkFieldAlreadyExistsError>> {
    if (!dto.description || dto.description.trim() === '') {
      return err({ type: 'ValidationError', message: 'La descripción no puede estar vacía.' });
    }

    const workFieldResult = await this.findById(id);
    if (workFieldResult.isErr()) {
      return err(workFieldResult.error);
    }
    const workField = workFieldResult.value;

    // Lógica de verificación de duplicados (opcional)

    workField.description = dto.description;
    const updatedWorkField = await this.workFieldRepository.save(workField);
    return ok(updatedWorkField);
  }
}
