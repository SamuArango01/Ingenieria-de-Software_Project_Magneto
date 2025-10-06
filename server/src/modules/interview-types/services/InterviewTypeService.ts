import { ok, err, Result } from 'neverthrow';
import { interviewTypeRepository } from "@/modules/interview-types/repositories/InterviewTypeRepository";
import { InterviewType } from "@/modules/interview-types/entities/InterviewType";

// Custom Error Types
type InterviewTypeNotFoundError = { type: 'InterviewTypeNotFoundError'; message: string };
type ValidationError = { type: 'ValidationError'; message: string };

export class InterviewTypeService {
    async getAvailableTypesForUser(userId: string): Promise<Result<InterviewType[], never>> {
        const interviewTypes = await interviewTypeRepository.findAvailableForUser(userId);
        return ok(interviewTypes);
    }

    async createInterviewType(userId: string, name: string, description?: string): Promise<Result<InterviewType, ValidationError>> {
        if (!name) {
            return err({ type: 'ValidationError', message: 'Name is required' });
        }

        const newInterviewType = new InterviewType();
        newInterviewType.name = name;
        newInterviewType.description = description;
        newInterviewType.createdBy = userId;

        const savedInterviewType = await interviewTypeRepository.save(newInterviewType);
        return ok(savedInterviewType);
    }

    async listUserInterviewTypes(userId: string): Promise<Result<InterviewType[], never>> {
        const interviewTypes = await interviewTypeRepository.find({ where: { createdBy: userId } });
        return ok(interviewTypes);
    }

    async updateInterviewType(userId: string, id: number, name: string, description: string): Promise<Result<InterviewType, InterviewTypeNotFoundError | ValidationError>> {
        if (!name) {
            return err({ type: 'ValidationError', message: 'Name is required' });
        }

        const interviewType = await interviewTypeRepository.findOne({ where: { id, createdBy: userId } });

        if (!interviewType) {
            return err({ type: 'InterviewTypeNotFoundError', message: "Interview type not found or you don't have permission to update it" });
        }

        interviewType.name = name;
        interviewType.description = description;

        const updatedInterviewType = await interviewTypeRepository.save(interviewType);
        return ok(updatedInterviewType);
    }

    async toggleInterviewTypeActive(userId: string, id: number): Promise<Result<InterviewType, InterviewTypeNotFoundError>> {
        const interviewType = await interviewTypeRepository.findOne({ where: { id, createdBy: userId } });

        if (!interviewType) {
            return err({ type: 'InterviewTypeNotFoundError', message: "Interview type not found or you don't have permission to update it" });
        }

        interviewType.isActive = !interviewType.isActive;

        const updatedInterviewType = await interviewTypeRepository.save(interviewType);
        return ok(updatedInterviewType);
    }
}
