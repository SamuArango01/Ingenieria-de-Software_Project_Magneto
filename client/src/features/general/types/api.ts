/**
 * Tipos de la API de Analytics del servidor para la feature General
 * Reutiliza tipos del endpoint GET /api/v1/analytics/candidates
 */

/**
 * Response del endpoint GET /api/v1/analytics/candidates
 */
export interface CandidateApiResponse {
  data: CandidateListItemApi[];
  pagination: PaginationMeta;
}

export interface CandidateListItemApi {
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
