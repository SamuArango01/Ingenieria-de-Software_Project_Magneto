import { ok, err, Result } from 'neverthrow';
import { UserConfiguration } from '@/modules/user-configurations/entities/UserConfiguration';
import type { IUserConfigurationRepository } from '@/modules/user-configurations/interfaces/IUserConfigurationRepository';
import type { 
  IUserConfigurationService,
  CreateOrUpdateUserConfigurationDto,
  UserConfigurationNotFoundError,
  ValidationError,
  RelatedResourceNotFoundError
} from '@/modules/user-configurations/interfaces/IUserConfigurationService';
import { UserConfigurationRepository } from '@/modules/user-configurations/repositories/UserConfigurationRepository';
import { WorkFieldRepository } from '@/modules/work-fields/repositories/WorkFieldRepository'; // Para verificar que el workFieldId existe
import type { IWorkFieldRepository } from '@/modules/work-fields/interfaces/IWorkFieldRepository';

export class UserConfigurationService implements IUserConfigurationService {
  private userConfigRepository: IUserConfigurationRepository;
  private workFieldRepository: IWorkFieldRepository; // Depender de la interfaz

  constructor(
    userConfigRepository: IUserConfigurationRepository = new UserConfigurationRepository(),
    workFieldRepository: IWorkFieldRepository = new WorkFieldRepository() // Usar la interfaz
  ) {
    this.userConfigRepository = userConfigRepository;
    this.workFieldRepository = workFieldRepository;
  }

  async getByUserId(userId: string): Promise<Result<UserConfiguration, UserConfigurationNotFoundError>> {
    const config = await this.userConfigRepository.findByUserId(userId);
    if (!config) {
      return err({ type: 'UserConfigurationNotFoundError', message: `Configuración para el usuario con ID ${userId} no encontrada.` });
    }
    return ok(config);
  }

  async createOrUpdate(userId: string, dto: CreateOrUpdateUserConfigurationDto): Promise<Result<UserConfiguration, ValidationError | RelatedResourceNotFoundError>> {
    // Validación básica del DTO
    if (dto.yearsOfExperience === null || dto.yearsOfExperience < 0) {
      return err({ type: 'ValidationError', message: 'Los años de experiencia son requeridos y deben ser un número positivo.' });
    }
    if (dto.workFieldId && dto.customWorkField) {
        return err({ type: 'ValidationError', message: 'No se puede especificar un campo de trabajo personalizado y un ID de campo de trabajo a la vez.' });
    }

    // Verificar que el workFieldId (si se proporciona) existe
    if (dto.workFieldId) {
      const workField = await this.workFieldRepository.findById(dto.workFieldId);
      if (!workField) {
        return err({ type: 'RelatedResourceNotFoundError', message: `El campo de trabajo con ID ${dto.workFieldId} no existe.` });
      }
    }

    // Lógica de "obtener o crear"
    let config = await this.userConfigRepository.findByUserId(userId);

    if (!config) {
      // Si no existe, creamos una nueva instancia
      config = this.userConfigRepository.create({ userId });
    }

    // Actualizar los campos de la configuración con los datos del DTO
    config.workFieldId = dto.workFieldId ?? null;
    config.customWorkField = dto.customWorkField ?? null;
    config.yearsOfExperience = dto.yearsOfExperience;
    config.preferredLanguage = dto.preferredLanguage ?? config.preferredLanguage; // Mantener el valor anterior si no se proporciona uno nuevo

    const savedConfig = await this.userConfigRepository.save(config);
    return ok(savedConfig);
  }
}
