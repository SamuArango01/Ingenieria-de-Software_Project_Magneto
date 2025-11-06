/**
 * Tipos de la API de Analytics del servidor
 * Estos tipos corresponden exactamente a las respuestas del backend
 */

/**
 * Response del endpoint GET /api/v1/analytics/overview
 */
export interface OverviewApiResponse {
  totalCandidates: number;
  totalInterviews: number;
  completedInterviews: number;
  completionRate: number;
  avgGlobalScore: number | null;
  interviewsByMonth: InterviewsByMonthApi[];
}

export interface InterviewsByMonthApi {
  month: string; // Formato: "YYYY-MM" (ej: "2025-01")
  total: number;
}

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
