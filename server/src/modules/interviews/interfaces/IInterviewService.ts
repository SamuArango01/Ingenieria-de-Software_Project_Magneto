// src/modules/interviews/interfaces/IInterviewService.ts
import { Result } from "neverthrow";

type ValidationError = { type: 'ValidationError'; message: string };
type EmailError = { type: 'EmailError'; message: string };

export interface IInterviewService {
  
    processAudio(
        userId: string, 
        audioPath: string, 
        interviewTypeId?: number,
        difficultyLevel?: string 
    ): Promise<Result<{
        text: string;
        translate: string;
        aiResponse: string;
        candidateMetrics: any;
        success: boolean;
        provider: string;
        canAdvanceToNextLevel?: boolean; 
    }, ValidationError>>;

    sendInterviewEmail(
        candidateEmail: string,
        candidateName: string,
        interviewHistory: Array<{ user: string; ai: string }>,
        summary?: string,
        difficultyLevel?: string 
    ): Promise<Result<{ success: boolean; message: string }, EmailError | ValidationError>>;


    startStarInterview(
        candidateName: string,
        userId: string,
        interviewTypeId?: number,
        difficultyLevel?: string 
    ): Promise<Result<{ 
        initialMessage: string; 
        interviewId: number;
        success: boolean 
    }, ValidationError>>;

    evaluateInterview(
        interviewHistory: Array<{ user: string; ai: string }>,
        candidateMetricsHistory: any[],
        interviewId?: number
    ): Promise<Result<{
        wouldPass: boolean;
        score: number;
        feedback: string;
    }, ValidationError>>;

    calculateAverageCandidateMetrics(candidateMetrics: any[]): any;
    
    hasValidCandidateMetrics(metrics: any): boolean;
}