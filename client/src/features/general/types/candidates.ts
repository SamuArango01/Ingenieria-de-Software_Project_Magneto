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

export interface Filters {
  readonly workField: string;
  readonly minExperience: number;
  readonly minScore: number;
  readonly minInterviews: number;
}

export enum SortByField {
  AVG_SCORE = 'avgScore',
  NAME = 'name',
  LAST_INTERVIEW = 'lastInterview'
}

export enum SortOrder {
  ASC = 'ASC',
  DESC = 'DESC'
}

export interface GetCandidatesParams {
  page?: number;
  limit?: number;
  sortBy?: SortByField;
  order?: SortOrder;
}