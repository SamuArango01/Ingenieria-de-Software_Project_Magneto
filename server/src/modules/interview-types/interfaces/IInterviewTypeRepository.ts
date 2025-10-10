import { InterviewType } from "@/modules/interview-types/entities/InterviewType";

export interface IInterviewTypeRepository {
    findAvailableForUser(userId: string): Promise<InterviewType[]>;
    findByIdForUser(userId: string, id: number): Promise<InterviewType | null>;
    save(interviewType: InterviewType): Promise<InterviewType>;
    find(options: any): Promise<InterviewType[]>;
    findOne(options: any): Promise<InterviewType | null>;
    create(interviewType: Partial<InterviewType>): InterviewType;
}