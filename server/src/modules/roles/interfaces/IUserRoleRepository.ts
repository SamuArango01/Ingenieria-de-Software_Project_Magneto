import { UserRole, RoleType } from "@/modules/roles/entities/UserRole";

export interface IUserRoleRepository {
  findByUserId(userId: string): Promise<UserRole | null>;
  findByUserIdAndRole(userId: string, role: RoleType): Promise<UserRole | null>;
  save(userRole: UserRole): Promise<UserRole>;
  create(userRole: Partial<UserRole>): UserRole;
  hasRole(userId: string, role: RoleType): Promise<boolean>;
}
