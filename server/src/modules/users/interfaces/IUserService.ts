import { Result } from 'neverthrow';
import { User } from '@/modules/users/entities/User';

// Re-exportar los tipos de error para mantener la consistencia
export type UserSyncError = { type: 'UserSyncError'; message: string };
export type ClerkUserNotFoundError = { type: 'ClerkUserNotFoundError'; message: string };

/**
 * Contrato que define la lógica de negocio para los usuarios.
 */
export interface IUserService {
  /**
   * Obtiene un usuario de la base de datos local por su ID. Si no existe,
   * lo obtiene de la API de Clerk y lo crea en la base de datos local.
   * 
   * @param userId - El ID del usuario de Clerk.
   * @returns Un Result que contiene el usuario (ya sea encontrado o creado) o un error.
   */
  getOrCreateUser(userId: string): Promise<Result<User, UserSyncError | ClerkUserNotFoundError>>;
}
