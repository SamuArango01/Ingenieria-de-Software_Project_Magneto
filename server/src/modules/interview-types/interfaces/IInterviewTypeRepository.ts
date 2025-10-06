import { InterviewType } from "@/modules/interview-types/entities/InterviewType";

export interface IInterviewTypeRepository {
    findAvailableForUser(userId: string): Promise<InterviewType[]>;
    save(interviewType: InterviewType): Promise<InterviewType>;
    find(options: any): Promise<InterviewType[]>;
    findOne(options: any): Promise<InterviewType | null>;
    create(interviewType: Partial<InterviewType>): InterviewType;
}