import { AppDataSource } from "@/database/data-source";
import { InterviewEvaluation } from "@/modules/interview-evaluations/entities/InterviewEvaluation";
import type { IInterviewEvaluationRepository } from "@/modules/interview-evaluations/interfaces/IInterviewEvaluationRepository";
import { Repository } from "typeorm";

export class InterviewEvaluationRepository implements IInterviewEvaluationRepository {
    private repository: Repository<InterviewEvaluation>;

    constructor() {
        this.repository = AppDataSource.getRepository(InterviewEvaluation);
    }

    public create(data: Partial<InterviewEvaluation>): InterviewEvaluation {
        return this.repository.create(data);
    }

    public async save(evaluation: InterviewEvaluation): Promise<InterviewEvaluation> {
        return this.repository.save(evaluation);
    }
}
