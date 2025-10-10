import type { Request, Response } from 'express';
import { getAuth } from '@clerk/express';
import { IUserConfigurationService } from '@/modules/user-configurations/interfaces/IUserConfigurationService';
import { UserConfigurationService } from '@/modules/user-configurations/services/UserConfigurationService';

export class UserConfigurationController {
  private userConfigService: IUserConfigurationService;

  constructor(userConfigService: IUserConfigurationService = new UserConfigurationService()) {
    this.userConfigService = userConfigService;
  }

  async getByUserId(req: Request, res: Response): Promise<void> {
    const { userId } = getAuth(req);
    if (!userId) {
      // Este caso no debería ocurrir si la ruta está protegida, pero es un buen control
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const result = await this.userConfigService.getByUserId(userId);
    result.match(
      (config) => res.json(config),
      (error) => {
        if (error.type === 'UserConfigurationNotFoundError') {
          res.status(404).json({ message: error.message });
        } else {
          res.status(500).json({ message: 'Internal server error' });
        }
      }
    );
  }

  async createOrUpdate(req: Request, res: Response): Promise<void> {
    const { userId } = getAuth(req);
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const dto = req.body;
    const result = await this.userConfigService.createOrUpdate(userId, dto);

    result.match(
      (savedConfig) => res.status(200).json(savedConfig), // 200 OK porque puede ser una creación o una actualización
      (error) => {
        if (error.type === 'ValidationError' || error.type === 'RelatedResourceNotFoundError') {
          res.status(400).json({ message: error.message });
        } else {
          res.status(500).json({ message: 'Internal server error' });
        }
      }
    );
  }
}
