import { InterviewTTS } from "@/modules/interviews-tts/entities/InterviewTTS";

export interface IInterviewTTSRepository {
    create(data: Partial<InterviewTTS>): InterviewTTS;
    save(interview: InterviewTTS): Promise<InterviewTTS>;
    findById(id: number): Promise<InterviewTTS | null>;
    findByUserId(userId: string): Promise<InterviewTTS[]>;
}
