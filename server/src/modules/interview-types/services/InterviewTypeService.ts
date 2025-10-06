import { ok, err, Result } from 'neverthrow';
import { InterviewType } from "@/modules/interview-types/entities/InterviewType";
import { IInterviewTypeRepository } from "@/modules/interview-types/interfaces/IInterviewTypeRepository";
import { IInterviewTypeService } from "@/modules/interview-types/interfaces/IInterviewTypeService";
import { InterviewTypeRepository } from "@/modules/interview-types/repositories/InterviewTypeRepository";

// Custom Error Types
type InterviewTypeNotFoundError = { type: 'InterviewTypeNotFoundError'; message: string };
type ValidationError = { type: 'ValidationError'; message: string };

export class InterviewTypeService implements IInterviewTypeService {
    private repository: IInterviewTypeRepository;

    constructor(repository: IInterviewTypeRepository = new InterviewTypeRepository()) {
        this.repository = repository;
    }

    async getAvailableTypesForUser(userId: string): Promise<Result<InterviewType[], never>> {
        const interviewTypes = await this.repository.findAvailableForUser(userId);
        return ok(interviewTypes);
    }

    async createInterviewType(userId: string, name: string, description?: string): Promise<Result<InterviewType, ValidationError>> {
        if (!name) {
            return err({ type: 'ValidationError', message: 'Name is required' });
        }

        const newInterviewType = this.repository.create({
            name,
            description,
            createdBy: userId,
        });

        const savedInterviewType = await this.repository.save(newInterviewType);
        return ok(savedInterviewType);
    }

    async listUserInterviewTypes(userId: string): Promise<Result<InterviewType[], never>> {
        const interviewTypes = await this.repository.find({ where: { createdBy: userId } });
        return ok(interviewTypes);
    }

    async updateInterviewType(userId: string, id: number, name: string, description: string): Promise<Result<InterviewType, InterviewTypeNotFoundError | ValidationError>> {
        if (!name) {
            return err({ type: 'ValidationError', message: 'Name is required' });
        }

        const interviewType = await this.repository.findOne({ where: { id, createdBy: userId } });

        if (!interviewType) {
            return err({ type: 'InterviewTypeNotFoundError', message: "Interview type not found or you don't have permission to update it" });
        }

        interviewType.name = name;
        interviewType.description = description;

        const updatedInterviewType = await this.repository.save(interviewType);
        return ok(updatedInterviewType);
    }

    async toggleInterviewTypeActive(userId: string, id: number): Promise<Result<InterviewType, InterviewTypeNotFoundError>> {
        const interviewType = await this.repository.findOne({ where: { id, createdBy: userId } });

        if (!interviewType) {
            return err({ type: 'InterviewTypeNotFoundError', message: "Interview type not found or you don't have permission to update it" });
        }

        interviewType.isActive = !interviewType.isActive;

        const updatedInterviewType = await this.repository.save(interviewType);
        return ok(updatedInterviewType);
    }
}
