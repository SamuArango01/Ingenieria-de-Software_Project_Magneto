import { ok, err, Result } from 'neverthrow';
import { UserRole, RoleType } from "@/modules/roles/entities/UserRole";
import type { IUserRoleRepository } from "@/modules/roles/interfaces/IUserRoleRepository";
import type { IUserRoleService } from "@/modules/roles/interfaces/IUserRoleService";
import { UserRoleRepository } from "@/modules/roles/repositories/UserRoleRepository";
import { UserRepository } from "@/modules/users/repositories/UserRepository";

type ValidationError = { type: 'ValidationError'; message: string };
type UserNotFoundError = { type: 'UserNotFoundError'; message: string };
type RoleAlreadyExistsError = { type: 'RoleAlreadyExistsError'; message: string };

export class UserRoleService implements IUserRoleService {
  private repository: IUserRoleRepository;
  private userRepository: UserRepository;

  constructor(repository: IUserRoleRepository = new UserRoleRepository()) {
    this.repository = repository;
    this.userRepository = new UserRepository();
  }

  async getUserRole(userId: string): Promise<Result<UserRole | null, ValidationError>> {
    if (!userId) {
      return err({ type: 'ValidationError', message: 'User ID is required' });
    }

    const userRole = await this.repository.findByUserId(userId);
    return ok(userRole);
  }

  async assignRole(userId: string, role: RoleType): Promise<Result<UserRole, ValidationError | UserNotFoundError | RoleAlreadyExistsError>> {
    if (!userId) {
      return err({ type: 'ValidationError', message: 'User ID is required' });
    }

    if (!role || !Object.values(RoleType).includes(role)) {
      return err({ type: 'ValidationError', message: 'Invalid role type' });
    }

    // Verificar que el usuario existe
    const user = await this.userRepository.findById(userId);
    if (!user) {
      return err({ type: 'UserNotFoundError', message: 'User not found' });
    }

    // Verificar si ya tiene un rol asignado
    const existingRole = await this.repository.findByUserId(userId);
    if (existingRole) {
      return err({ type: 'RoleAlreadyExistsError', message: 'User already has a role assigned' });
    }

    const newUserRole = this.repository.create({
      userId,
      role
    });

    const savedUserRole = await this.repository.save(newUserRole);
    return ok(savedUserRole);
  }

  async hasRole(userId: string, role: RoleType): Promise<Result<boolean, ValidationError>> {
    if (!userId) {
      return err({ type: 'ValidationError', message: 'User ID is required' });
    }

    if (!role || !Object.values(RoleType).includes(role)) {
      return err({ type: 'ValidationError', message: 'Invalid role type' });
    }

    const hasRole = await this.repository.hasRole(userId, role);
    return ok(hasRole);
  }
}
