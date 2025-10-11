import type { Request, Response } from 'express';
import type { IWorkFieldService } from '@/modules/work-fields/interfaces/IWorkFieldService';
import { WorkFieldService } from '@/modules/work-fields/services/WorkFieldService';

export class WorkFieldController {
  private workFieldService: IWorkFieldService;

  constructor(workFieldService: IWorkFieldService = new WorkFieldService()) {
    this.workFieldService = workFieldService;
  }

  async listAll(req: Request, res: Response): Promise<void> {
    const result = await this.workFieldService.listAll();
    // Para listAll, el caso de error es improbable, pero lo manejamos por completitud.
    result.match(
      (workFields) => res.json(workFields),
      (error) => res.status(500).json({ message: 'Internal server error' })
    );
  }

  async findById(req: Request, res: Response): Promise<void> {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ message: 'El ID debe ser un número.' });
      return;
    }

    const result = await this.workFieldService.findById(id);
    result.match(
      (workField) => res.json(workField),
      (error) => {
        if (error.type === 'WorkFieldNotFoundError') {
          res.status(404).json({ message: error.message });
        } else {
          res.status(500).json({ message: 'Internal server error' });
        }
      }
    );
  }

  async create(req: Request, res: Response): Promise<void> {
    const dto = req.body;
    const result = await this.workFieldService.create(dto);

    result.match(
      (newWorkField) => res.status(201).json(newWorkField),
      (error) => {
        if (error.type === 'ValidationError' || error.type === 'WorkFieldAlreadyExistsError') {
          res.status(400).json({ message: error.message });
        } else {
          res.status(500).json({ message: 'Internal server error' });
        }
      }
    );
  }

  async update(req: Request, res: Response): Promise<void> {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ message: 'El ID debe ser un número.' });
      return;
    }

    const dto = req.body;
    const result = await this.workFieldService.update(id, dto);

    result.match(
      (updatedWorkField) => res.json(updatedWorkField),
      (error) => {
        if (error.type === 'WorkFieldNotFoundError') {
          res.status(404).json({ message: error.message });
        } else if (error.type === 'ValidationError' || error.type === 'WorkFieldAlreadyExistsError') {
          res.status(400).json({ message: error.message });
        } else {
          res.status(500).json({ message: 'Internal server error' });
        }
      }
    );
  }
}
