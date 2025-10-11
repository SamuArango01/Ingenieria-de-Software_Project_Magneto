import { Result } from "neverthrow";
import { InterviewType } from "@/modules/interview-types/entities/InterviewType";

// Custom Error Types
type InterviewTypeNotFoundError = { type: 'InterviewTypeNotFoundError'; message: string };
type ValidationError = { type: 'ValidationError'; message: string };

export interface IInterviewTypeService {
    getAvailableTypesForUser(userId: string): Promise<Result<InterviewType[], never>>;
    createInterviewType(userId: string, name: string, description?: string): Promise<Result<InterviewType, ValidationError>>;
    listUserInterviewTypes(userId: string): Promise<Result<InterviewType[], never>>;
    updateInterviewType(userId: string, id: number, name: string, description: string): Promise<Result<InterviewType, InterviewTypeNotFoundError | ValidationError>>;
    toggleInterviewTypeActive(userId: string, id: number): Promise<Result<InterviewType, InterviewTypeNotFoundError>>;
    getInterviewTypeById(userId: string, id: number): Promise<Result<InterviewType, any>>;
}
