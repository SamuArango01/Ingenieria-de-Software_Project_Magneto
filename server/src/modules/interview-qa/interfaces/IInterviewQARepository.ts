import { InterviewQA } from "@/modules/interview-qa/entities/InterviewQA";

export interface IInterviewQARepository {
  create(data: Partial<InterviewQA>): InterviewQA;
  save(interviewQA: InterviewQA): Promise<InterviewQA>;
  findByInterviewId(interviewId: number): Promise<InterviewQA[]>;
  findById(id: number): Promise<InterviewQA | null>;
}
