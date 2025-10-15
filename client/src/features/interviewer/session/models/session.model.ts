export interface InterviewMessage {
  role: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

export interface CandidateMetrics {
  wordsPerMinute: number;
  fluencyScore: number;
  clarityScore: number;
  confidenceScore: number;
  fillerWordsRatio: number;
  strengths: string[];
  improvementAreas: string[];
}

export interface ProcessAudioResponse {
  text: string;
  translate: string;
  aiResponse: string;
  candidateMetrics: CandidateMetrics;
  success: boolean;
  provider: string;
}

export interface SendEmailRequest {
  candidateEmail: string;
  candidateName: string;
  interviewHistory: Array<{ user: string; ai: string }>;
  summary?: string;
}

export interface SendEmailResponse {
  success: boolean;
  message: string;
}
