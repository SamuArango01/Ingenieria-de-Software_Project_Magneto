import { WorkField } from '@/modules/work-fields/entities/WorkField';

/**
 * Contrato que define las operaciones de base de datos para la entidad WorkField.
 */
export interface IWorkFieldRepository {
  /**
   * Busca todos los campos de trabajo.
   * @returns Una promesa que resuelve a un array de WorkField.
   */
  findAll(): Promise<WorkField[]>;

  /**
   * Busca un campo de trabajo por su ID.
   * @param id - El ID del campo de trabajo a buscar.
   * @returns Una promesa que resuelve al campo de trabajo si se encuentra, o null en caso contrario.
   */
  findById(id: number): Promise<WorkField | null>;

  /**
   * Crea una nueva instancia de un campo de trabajo (sin guardarla).
   * @param data - Los datos para el nuevo campo de trabajo.
   * @returns Una nueva instancia de la entidad WorkField.
   */
  create(data: Partial<WorkField>): WorkField;

  /**
   * Guarda (crea o actualiza) una entidad de campo de trabajo en la base de datos.
   * @param workField - La entidad a guardar.
   * @returns Una promesa que resuelve a la entidad guardada.
   */
  save(workField: WorkField): Promise<WorkField>;
}
