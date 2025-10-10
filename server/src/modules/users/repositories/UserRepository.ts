import { AppDataSource } from '@/database/data-source';
import { User } from '@/modules/users/entities/User';
import { IUserRepository } from '@/modules/users/interfaces/IUserRepository';
import { Repository } from 'typeorm';

export class UserRepository implements IUserRepository {
  private repository: Repository<User>;

  constructor() {
    this.repository = AppDataSource.getRepository(User);
  }

  findById(id: string): Promise<User | null> {
    return this.repository.findOne({ where: { id } });
  }

  create(userData: Partial<User>): User {
    return this.repository.create(userData);
  }

  save(user: User): Promise<User> {
    return this.repository.save(user);
  }
}
