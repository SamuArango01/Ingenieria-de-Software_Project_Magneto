import { Result } from "neverthrow";
import { InterviewTTS } from "@/modules/interviews-tts/entities/InterviewTTS";

export interface StartInterviewTTSInput {
    userId: string;
    interviewTypeId?: number;
}

export interface SaveMessageInput {
    interviewId: number;
    role: "user" | "ai";
    message: string;
    audioDurationSeconds?: number;
}

export interface AIResponseData {
    message: string;
    shouldEnd: boolean;
    reason?: string;
    topicsCovered?: string[];
}

export interface IInterviewTTSService {
    startInterview(input: StartInterviewTTSInput): Promise<Result<InterviewTTS, Error>>;
    saveMessage(input: SaveMessageInput): Promise<Result<void, Error>>;
    generateAIResponse(interviewId: number, userMessage: string): Promise<Result<AIResponseData, Error>>;
    endInterview(interviewId: number, endedByAI: boolean, reason?: string): Promise<Result<void, Error>>;
    getInterview(interviewId: number): Promise<Result<InterviewTTS, Error>>;
}
