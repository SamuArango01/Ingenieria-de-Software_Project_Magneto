import { GetCandidatesDto } from "@/modules/analytics/dto/GetCandidatesDto";
import {
  CandidateListItem,
  PaginationMeta
} from "@/modules/analytics/dto/responses/CandidateListResponse";
import {
  CandidateUser,
  CandidateMetrics,
  ScoreHistoryItem,
  LatestEvaluation
} from "@/modules/analytics/dto/responses/CandidateDetailResponse";
import {
  InterviewsByMonth
} from "@/modules/analytics/dto/responses/OverviewResponse";

export interface IAnalyticsRepository {
  getCandidatesList(filters: GetCandidatesDto): Promise<{ data: CandidateListItem[]; total: number }>;
  getCandidateUser(userId: string): Promise<CandidateUser | null>;
  getCandidateMetrics(userId: string): Promise<CandidateMetrics>;
  getScoreHistory(userId: string): Promise<ScoreHistoryItem[]>;
  getLatestEvaluation(userId: string): Promise<LatestEvaluation | null>;
  getTotalCandidates(): Promise<number>;
  getInterviewStats(): Promise<{
    totalInterviews: number;
    completedInterviews: number;
    completionRate: number;
    avgGlobalScore: number | null;
  }>;
  getInterviewsByMonth(): Promise<InterviewsByMonth[]>;
}
