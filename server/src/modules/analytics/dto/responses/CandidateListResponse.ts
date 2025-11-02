/**
 * Response type for GET /api/v1/analytics/candidates
 */
export interface CandidateListItem {
  userId: string;
  name: string;
  email: string;
  avatar: string | null;
  workField: string | null;
  customWorkField: string | null;
  yearsOfExperience: number | null;
  totalInterviews: number;
  completedInterviews: number;
  avgScore: number | null;
  lastInterviewDate: Date | null;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CandidateListResponse {
  data: CandidateListItem[];
  pagination: PaginationMeta;
}
