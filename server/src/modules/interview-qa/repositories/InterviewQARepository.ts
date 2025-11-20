import { AppDataSource } from "@/database/data-source";
import { InterviewQA } from "@/modules/interview-qa/entities/InterviewQA";
import { IInterviewQARepository } from "@/modules/interview-qa/interfaces/IInterviewQARepository";
import { Repository } from "typeorm";

export class InterviewQARepository implements IInterviewQARepository {
  private repository: Repository<InterviewQA>;

  constructor() {
    this.repository = AppDataSource.getRepository(InterviewQA);
  }

  create(data: Partial<InterviewQA>): InterviewQA {
    return this.repository.create(data);
  }

  async save(interviewQA: InterviewQA): Promise<InterviewQA> {
    return this.repository.save(interviewQA);
  }

  async findByInterviewId(interviewId: number): Promise<InterviewQA[]> {
    return this.repository.find({
      where: { interviewId },
      order: { questionOrder: 'ASC' }
    });
  }

  async findById(id: number): Promise<InterviewQA | null> {
    return this.repository.findOne({ where: { id } });
  }
}
