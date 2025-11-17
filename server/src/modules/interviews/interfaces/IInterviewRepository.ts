import { Interview } from "@/modules/interviews/entities/Interview";

export interface IInterviewRepository {
    create(data: Partial<Interview>): Interview;
    save(interview: Interview): Promise<Interview>;
    findById(id: number): Promise<Interview | null>;
    updateStatus(id: number, status: string, score?: number, durationMinutes?: number): Promise<void>;
}
