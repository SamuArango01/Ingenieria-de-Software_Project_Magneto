import { AppDataSource } from "@/database/data-source";
import { Interview } from "@/modules/interviews/entities/Interview";
import type { IInterviewRepository } from "@/modules/interviews/interfaces/IInterviewRepository";
import { Repository } from "typeorm";

export class InterviewRepository implements IInterviewRepository {
    private repository: Repository<Interview>;

    constructor() {
        this.repository = AppDataSource.getRepository(Interview);
    }

    public create(data: Partial<Interview>): Interview {
        return this.repository.create(data);
    }

    public async save(interview: Interview): Promise<Interview> {
        return this.repository.save(interview);
    }
}
