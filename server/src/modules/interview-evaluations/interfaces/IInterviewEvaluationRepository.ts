import { InterviewEvaluation } from "@/modules/interview-evaluations/entities/InterviewEvaluation";

export interface IInterviewEvaluationRepository {
    create(data: Partial<InterviewEvaluation>): InterviewEvaluation;
    save(evaluation: InterviewEvaluation): Promise<InterviewEvaluation>;
}
