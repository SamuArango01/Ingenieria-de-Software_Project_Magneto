import { AppDataSource } from "@/database/data-source";
import { InterviewTTS } from "@/modules/interviews-tts/entities/InterviewTTS";
import type { IInterviewTTSRepository } from "@/modules/interviews-tts/interfaces/IInterviewTTSRepository";
import { Repository } from "typeorm";

export class InterviewTTSRepository implements IInterviewTTSRepository {
    private repository: Repository<InterviewTTS>;

    constructor() {
        this.repository = AppDataSource.getRepository(InterviewTTS);
    }

    public create(data: Partial<InterviewTTS>): InterviewTTS {
        return this.repository.create(data);
    }

    public async save(interview: InterviewTTS): Promise<InterviewTTS> {
        return this.repository.save(interview);
    }

    public async findById(id: number): Promise<InterviewTTS | null> {
        return this.repository.findOne({
            where: { id },
            relations: ["user", "interviewType"]
        });
    }

    public async findByUserId(userId: string): Promise<InterviewTTS[]> {
        return this.repository.find({
            where: { userId },
            relations: ["interviewType"],
            order: { createdAt: "DESC" }
        });
    }
}
