import { ok, err, Result } from 'neverthrow';
import { clerkClient } from '@clerk/clerk-sdk-node';
import { User } from '@/modules/users/entities/User';
import type { IUserRepository } from '@/modules/users/interfaces/IUserRepository';
import type { IUserService, UserSyncError, ClerkUserNotFoundError } from '@/modules/users/interfaces/IUserService';
import { UserRepository } from '@/modules/users/repositories/UserRepository';

export class UserService implements IUserService {
  private userRepository: IUserRepository;

  constructor(userRepository: IUserRepository = new UserRepository()) {
    this.userRepository = userRepository;
  }

  async getOrCreateUser(userId: string): Promise<Result<User, UserSyncError | ClerkUserNotFoundError>> {
    try {
      const existingUser = await this.userRepository.findById(userId);

      if (existingUser) {
        return ok(existingUser);
      }

      const clerkUser = await clerkClient.users.getUser(userId);

      if (!clerkUser) {
        return err({ type: 'ClerkUserNotFoundError', message: 'Usuario de Clerk no encontrado.' });
      }

      const newUser = this.userRepository.create({
        id: clerkUser.id,
        email: clerkUser.emailAddresses[0]?.emailAddress ?? `no-email-${Date.now()}@example.com`,
        name: `${clerkUser.firstName ?? ''} ${clerkUser.lastName ?? ''}`.trim() || 'Usuario Anónimo',
      });

      const savedUser = await this.userRepository.save(newUser);
      console.log(`✨ Usuario sincronizado: ${savedUser.name} (ID: ${savedUser.id})`);
      
      return ok(savedUser);

    } catch (error) {
      console.error("🚨 Error en UserService.getOrCreateUser:", error);
      return err({ type: 'UserSyncError', message: 'Ocurrió un error al sincronizar el usuario.' });
    }
  }
}
