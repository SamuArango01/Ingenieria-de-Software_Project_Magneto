import { User } from '@/modules/users/entities/User';

/**
 * Contrato que define las operaciones de base de datos para la entidad User.
 */
export interface IUserRepository {
  /**
   * Busca un usuario por su ID.
   * @param id - El ID del usuario a buscar.
   * @returns Una promesa que resuelve al usuario si se encuentra, o null en caso contrario.
   */
  findById(id: string): Promise<User | null>;

  /**
   * Crea una nueva instancia de un usuario (sin guardarla).
   * @param userData - Los datos parciales del usuario a crear.
   * @returns Una nueva instancia de la entidad User.
   */
  create(userData: Partial<User>): User;

  /**
   * Guarda una entidad de usuario en la base de datos.
   * @param user - La entidad de usuario a guardar.
   * @returns Una promesa que resuelve a la entidad de usuario guardada.
   */
  save(user: User): Promise<User>;
}
