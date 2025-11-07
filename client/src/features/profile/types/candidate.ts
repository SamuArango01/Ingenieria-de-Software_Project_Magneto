// types/candidate.ts - Actualizados para coincidir con el backend

export interface CandidateUser {
  userId: string;
  name: string;
  email: string;
  avatar: string | null;
  workField: string | null;
  customWorkField: string | null;
  yearsOfExperience: number | null;
  preferredLanguage: string | null;
  registeredAt: Date;
}

export interface CandidateMetrics {
  totalInterviews: number;
  completedInterviews: number;
  inProgressInterviews: number;
  abandonedInterviews: number;
  avgScore: number | null;
  avgDuration: number | null;
}

export interface ScoreHistoryItem {
  date: string;
  score: number;
  interviewType: string;
  duration: number | null;
}

export interface LatestEvaluation {
  strengths: string | null;
  weaknesses: string | null;
}

export interface CandidateDetailResponse {
  user: CandidateUser;
  metrics: CandidateMetrics;
  scoreHistory: ScoreHistoryItem[];
  latestEvaluation: LatestEvaluation | null;
}

export interface CandidateProfile {
  user: CandidateUser;
  metrics: CandidateMetrics;
  scoreHistory: ScoreHistoryItem[];
  latestEvaluation: LatestEvaluation | null;
}