import { Interview } from "@/modules/interviews/entities/Interview";

export interface IInterviewRepository {
    create(data: Partial<Interview>): Interview;
    save(interview: Interview): Promise<Interview>;
}
