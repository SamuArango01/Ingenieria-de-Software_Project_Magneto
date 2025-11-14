export interface InterviewsByMonth {
  month: string;
  total: number;
}

export interface OverviewResponse {
  totalCandidates: number;
  totalInterviews: number;
  completedInterviews: number;
  completionRate: number;
  avgGlobalScore: number | null;
  interviewsByMonth: InterviewsByMonth[];
}