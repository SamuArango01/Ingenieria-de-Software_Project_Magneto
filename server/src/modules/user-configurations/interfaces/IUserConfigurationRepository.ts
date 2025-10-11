import { UserConfiguration } from '@/modules/user-configurations/entities/UserConfiguration';

/**
 * Contrato que define las operaciones de base de datos para la entidad UserConfiguration.
 */
export interface IUserConfigurationRepository {
  /**
   * Busca una configuración de usuario por el ID del usuario.
   * @param userId - El ID del usuario.
   * @returns Una promesa que resuelve a la configuración si se encuentra, o null en caso contrario.
   */
  findByUserId(userId: string): Promise<UserConfiguration | null>;

  /**
   * Crea una nueva instancia de una configuración de usuario (sin guardarla).
   * @param data - Los datos para la nueva configuración.
   * @returns Una nueva instancia de la entidad UserConfiguration.
   */
  create(data: Partial<UserConfiguration>): UserConfiguration;

  /**
   * Guarda (crea o actualiza) una entidad de configuración de usuario en la base de datos.
   * @param config - La entidad a guardar.
   * @returns Una promesa que resuelve a la entidad guardada.
   */
  save(config: UserConfiguration): Promise<UserConfiguration>;
}
