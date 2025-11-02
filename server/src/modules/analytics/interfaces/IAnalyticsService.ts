import { Result } from "neverthrow";
import { GetCandidatesDto } from "@/modules/analytics/dto/GetCandidatesDto";
import { CandidateListResponse } from "@/modules/analytics/dto/responses/CandidateListResponse";
import { CandidateDetailResponse } from "@/modules/analytics/dto/responses/CandidateDetailResponse";
import { OverviewResponse } from "@/modules/analytics/dto/responses/OverviewResponse";

type ValidationError = { type: 'ValidationError'; message: string };
type NotFoundError = { type: 'NotFoundError'; message: string };

export interface IAnalyticsService {
  getCandidates(filters: GetCandidatesDto): Promise<Result<CandidateListResponse, ValidationError>>;
  getCandidateDetail(userId: string): Promise<Result<CandidateDetailResponse, ValidationError | NotFoundError>>;
  getOverview(): Promise<Result<OverviewResponse, never>>;
}
