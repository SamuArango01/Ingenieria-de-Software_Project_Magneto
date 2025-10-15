import type { CandidateMetrics } from '../../session/models/session.model';

export interface EvaluateInterviewRequest {
  interviewHistory: Array<{ user: string; ai: string }>;
  candidateMetricsHistory: CandidateMetrics[];
}

export interface EvaluateInterviewResponse {
  wouldPass: boolean;
  score: number;
  feedback: string;
}
