import { AppDataSource } from "@/database/data-source";
import { InterviewTTSMessage } from "@/modules/interviews-tts/entities/InterviewTTSMessage";
import type { IInterviewTTSMessageRepository } from "@/modules/interviews-tts/interfaces/IInterviewTTSMessageRepository";
import { Repository } from "typeorm";

export class InterviewTTSMessageRepository implements IInterviewTTSMessageRepository {
    private repository: Repository<InterviewTTSMessage>;

    constructor() {
        this.repository = AppDataSource.getRepository(InterviewTTSMessage);
    }

    public create(data: Partial<InterviewTTSMessage>): InterviewTTSMessage {
        return this.repository.create(data);
    }

    public async save(message: InterviewTTSMessage): Promise<InterviewTTSMessage> {
        return this.repository.save(message);
    }

    public async findByInterviewId(interviewId: number): Promise<InterviewTTSMessage[]> {
        return this.repository.find({
            where: { interviewId },
            order: { messageOrder: "ASC" }
        });
    }

    public async countByInterviewId(interviewId: number): Promise<number> {
        return this.repository.count({
            where: { interviewId }
        });
    }
}
