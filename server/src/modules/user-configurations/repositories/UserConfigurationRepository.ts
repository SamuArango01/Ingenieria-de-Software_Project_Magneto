import { AppDataSource } from '@/database/data-source';
import { UserConfiguration } from '@/modules/user-configurations/entities/UserConfiguration';
import type { IUserConfigurationRepository } from '@/modules/user-configurations/interfaces/IUserConfigurationRepository';
import { Repository } from 'typeorm';

export class UserConfigurationRepository implements IUserConfigurationRepository {
  private repository: Repository<UserConfiguration>;

  constructor() {
    this.repository = AppDataSource.getRepository(UserConfiguration);
  }

  findByUserId(userId: string): Promise<UserConfiguration | null> {
    return this.repository.findOne({ where: { userId } });
  }

  create(data: Partial<UserConfiguration>): UserConfiguration {
    return this.repository.create(data);
  }

  save(config: UserConfiguration): Promise<UserConfiguration> {
    return this.repository.save(config);
  }
}
