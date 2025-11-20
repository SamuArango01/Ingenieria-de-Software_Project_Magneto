import { InterviewTTSMessage } from "@/modules/interviews-tts/entities/InterviewTTSMessage";

export interface IInterviewTTSMessageRepository {
    create(data: Partial<InterviewTTSMessage>): InterviewTTSMessage;
    save(message: InterviewTTSMessage): Promise<InterviewTTSMessage>;
    findByInterviewId(interviewId: number): Promise<InterviewTTSMessage[]>;
    countByInterviewId(interviewId: number): Promise<number>;
}
