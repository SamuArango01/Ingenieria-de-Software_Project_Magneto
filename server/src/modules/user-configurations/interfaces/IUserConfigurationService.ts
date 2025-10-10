import { Result } from 'neverthrow';
import { UserConfiguration } from '@/modules/user-configurations/entities/UserConfiguration';

// --- Data Transfer Objects (DTOs) ---
export interface CreateOrUpdateUserConfigurationDto {
  workFieldId?: number;
  customWorkField?: string;
  yearsOfExperience: number;
  preferredLanguage?: string;
}

// --- Custom Error Types ---
export type UserConfigurationNotFoundError = { type: 'UserConfigurationNotFoundError'; message: string };
export type ValidationError = { type: 'ValidationError'; message: string };
export type RelatedResourceNotFoundError = { type: 'RelatedResourceNotFoundError'; message: string }; // Para cuando, por ej., el workFieldId no existe

/**
 * Contrato que define la lógica de negocio para la configuración de usuario.
 */
export interface IUserConfigurationService {
  /**
   * Obtiene la configuración de un usuario por su ID.
   * @param userId - El ID del usuario autenticado.
   * @returns Un Result que contiene la UserConfiguration si se encuentra, o un error en caso contrario.
   */
  getByUserId(userId: string): Promise<Result<UserConfiguration, UserConfigurationNotFoundError>>;

  /**
   * Crea o actualiza la configuración de un usuario.
   * @param userId - El ID del usuario autenticado.
   * @param dto - Los datos para crear o actualizar la configuración.
   * @returns Un Result que contiene la configuración guardada o un error.
   */
  createOrUpdate(userId: string, dto: CreateOrUpdateUserConfigurationDto): Promise<Result<UserConfiguration, ValidationError | RelatedResourceNotFoundError>>;
}
