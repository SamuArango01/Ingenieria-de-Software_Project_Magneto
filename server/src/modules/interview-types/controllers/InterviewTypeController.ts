import { Request, Response } from 'express';
import { InterviewTypeService } from '@/modules/interview-types/services/InterviewTypeService';
import { IInterviewTypeService } from '@/modules/interview-types/interfaces/IInterviewTypeService';

export class InterviewTypeController {
    private interviewTypeService: IInterviewTypeService;

    constructor(interviewTypeService: IInterviewTypeService) {
        this.interviewTypeService = interviewTypeService;
    }

    async getAvailableTypesForUser(req: Request, res: Response): Promise<void> {
        // @ts-ignore
        const userId = req.auth.userId;
        const result = await this.interviewTypeService.getAvailableTypesForUser(userId);
        result.match(
            (interviewTypes) => res.json(interviewTypes),
            () => res.status(500).json({ message: 'Internal server error' })
        );
    }

    async createInterviewType(req: Request, res: Response): Promise<void> {
        // @ts-ignore
        const userId = req.auth.userId;
        const { name, description } = req.body;
        const result = await this.interviewTypeService.createInterviewType(userId, name, description);
        result.match(
            (interviewType) => res.status(201).json(interviewType),
            (error) => {
                if (error.type === 'ValidationError') {
                    res.status(400).json({ message: error.message });
                } else {
                    res.status(500).json({ message: 'Internal server error' });
                }
            }
        );
    }

    async listUserInterviewTypes(req: Request, res: Response): Promise<void> {
        // @ts-ignore
        const userId = req.auth.userId;
        const result = await this.interviewTypeService.listUserInterviewTypes(userId);
        result.match(
            (interviewTypes) => res.json(interviewTypes),
            () => res.status(500).json({ message: 'Internal server error' })
        );
    }

    async updateInterviewType(req: Request, res: Response): Promise<void> {
        // @ts-ignore
        const userId = req.auth.userId;
        const { id } = req.params;
        const { name, description } = req.body;
        const result = await this.interviewTypeService.updateInterviewType(userId, Number(id), name, description);
        result.match(
            (interviewType) => res.json(interviewType),
            (error) => {
                if (error.type === 'InterviewTypeNotFoundError') {
                    res.status(404).json({ message: error.message });
                } else if (error.type === 'ValidationError') {
                    res.status(400).json({ message: error.message });
                } else {
                    res.status(500).json({ message: 'Internal server error' });
                }
            }
        );
    }

    async toggleInterviewTypeActive(req: Request, res: Response): Promise<void> {
        // @ts-ignore
        const userId = req.auth.userId;
        const { id } = req.params;
        const result = await this.interviewTypeService.toggleInterviewTypeActive(userId, Number(id));
        result.match(
            (interviewType) => res.json(interviewType),
            (error) => {
                if (error.type === 'InterviewTypeNotFoundError') {
                    res.status(404).json({ message: error.message });
                } else {
                    res.status(500).json({ message: 'Internal server error' });
                }
            }
        );
    }
}