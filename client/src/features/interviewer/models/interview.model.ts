export type InterviewStatus = 'started' | 'in_progress' | 'completed' | 'cancelled';

export interface Interview {
  id: number;
  userId: string;
  interviewTypeId: number;
  score: number | null;
  durationMinutes: number | null;
  status: InterviewStatus;
  startedAt: Date;
  completedAt: Date | null;
  createdAt: Date;
}

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

export interface StartInterviewRequest {
  candidateName: string;
  interviewTypeId?: number;
}

export interface StartInterviewResponse {
  success: boolean;
  data: {
    initialMessage: string;
    interviewId: number;
    candidateName: string;
    timestamp: string;
  };
}

export interface ProcessAudioRequest {
  audio: File;
  interviewTypeId?: number;
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
