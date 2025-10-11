import { Result } from 'neverthrow';
import { WorkField } from '@/modules/work-fields/entities/WorkField';

// --- Data Transfer Objects (DTOs) ---
export interface CreateWorkFieldDto {
  description: string;
}

export interface UpdateWorkFieldDto {
  description: string;
}

// --- Custom Error Types ---
export type WorkFieldNotFoundError = { type: 'WorkFieldNotFoundError'; message: string };
export type ValidationError = { type: 'ValidationError'; message: string };
export type WorkFieldAlreadyExistsError = { type: 'WorkFieldAlreadyExistsError'; message: string };

/**
 * Contrato que define la lógica de negocio para los campos de trabajo.
 */
export interface IWorkFieldService {
  /**
   * Obtiene una lista de todos los campos de trabajo.
   * @returns Un Result que contiene el array de WorkField o un error.
   */
  listAll(): Promise<Result<WorkField[], never>>;

  /**
   * Obtiene un campo de trabajo por su ID.
   * @param id - El ID del campo de trabajo.
   * @returns Un Result que contiene el WorkField si se encuentra, o un error en caso contrario.
   */
  findById(id: number): Promise<Result<WorkField, WorkFieldNotFoundError>>;

  /**
   * Crea un nuevo campo de trabajo.
   * @param dto - Los datos para crear el nuevo campo de trabajo.
   * @returns Un Result que contiene el nuevo WorkField o un error de validación/existencia.
   */
  create(dto: CreateWorkFieldDto): Promise<Result<WorkField, ValidationError | WorkFieldAlreadyExistsError>>;

  /**
   * Actualiza un campo de trabajo existente.
   * @param id - El ID del campo de trabajo a actualizar.
   * @param dto - Los datos para actualizar.
   * @returns Un Result que contiene el WorkField actualizado o un error si no se encuentra o hay un problema de validación.
   */
  update(id: number, dto: UpdateWorkFieldDto): Promise<Result<WorkField, WorkFieldNotFoundError | ValidationError | WorkFieldAlreadyExistsError>>;
}
