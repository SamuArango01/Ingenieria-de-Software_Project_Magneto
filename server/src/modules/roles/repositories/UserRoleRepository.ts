import { AppDataSource } from "@/database/data-source";
import { UserRole, RoleType } from "@/modules/roles/entities/UserRole";
import { IUserRoleRepository } from "@/modules/roles/interfaces/IUserRoleRepository";
import { Repository } from "typeorm";

export class UserRoleRepository implements IUserRoleRepository {
  private repository: Repository<UserRole>;

  constructor() {
    this.repository = AppDataSource.getRepository(UserRole);
  }

  async findByUserId(userId: string): Promise<UserRole | null> {
    return this.repository.findOne({
      where: { userId }
    });
  }

  async findByUserIdAndRole(userId: string, role: RoleType): Promise<UserRole | null> {
    return this.repository.findOne({
      where: { userId, role }
    });
  }

  async save(userRole: UserRole): Promise<UserRole> {
    return this.repository.save(userRole);
  }

  create(userRole: Partial<UserRole>): UserRole {
    return this.repository.create(userRole);
  }

  async hasRole(userId: string, role: RoleType): Promise<boolean> {
    const userRole = await this.findByUserIdAndRole(userId, role);
    return userRole !== null;
  }
}
