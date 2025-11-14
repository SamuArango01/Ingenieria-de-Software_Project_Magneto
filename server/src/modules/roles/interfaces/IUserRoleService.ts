import { Result } from "neverthrow";
import { UserRole, RoleType } from "@/modules/roles/entities/UserRole";

type ValidationError = { type: 'ValidationError'; message: string };
type UserNotFoundError = { type: 'UserNotFoundError'; message: string };
type RoleAlreadyExistsError = { type: 'RoleAlreadyExistsError'; message: string };

export interface IUserRoleService {
  getUserRole(userId: string): Promise<Result<UserRole | null, ValidationError>>;
  assignRole(userId: string, role: RoleType): Promise<Result<UserRole, ValidationError | UserNotFoundError | RoleAlreadyExistsError>>;
  hasRole(userId: string, role: RoleType): Promise<Result<boolean, ValidationError>>;
}
