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

    public async findById(id: number): Promise<Interview | null> {
        return this.repository.findOne({ where: { id } });
    }

    public async updateStatus(id: number, status: string, score?: number, durationMinutes?: number): Promise<void> {
        const updateData: any = {
            status,
            completedAt: status === 'completed' ? new Date() : undefined
        };

        if (score !== undefined) {
            updateData.score = score;
        }

        if (durationMinutes !== undefined) {
            updateData.durationMinutes = durationMinutes;
        }

        await this.repository.update(id, updateData);
    }
}
