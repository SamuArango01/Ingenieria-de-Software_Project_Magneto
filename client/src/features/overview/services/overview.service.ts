/**
 * Servicio para obtener estadísticas generales de overview desde la API
 */
import { apiClient } from '@/lib/api';
import { InterviewData } from '../types/charts';
import { OverviewApiResponse } from '../types/api';
import { mapInterviewsByMonth } from '../mappers/analytics.mapper';
import { extractNormalizedApiError } from '@/lib/api/errors';

export interface OverviewStats {
  interviewsByMonth: InterviewData[];
  totalInterviews: number;
  completionRate: number;
  avgGlobalScore: number | null;
  totalCandidates: number;
}

export const getOverviewStats = async (): Promise<OverviewStats> => {
  try {
    const response = await apiClient.get<OverviewApiResponse>(
      '/v1/analytics/overview'
    );

    return {
      interviewsByMonth: mapInterviewsByMonth(response.data.interviewsByMonth),
      totalInterviews: response.data.totalInterviews,
      completionRate: response.data.completionRate,
      avgGlobalScore: response.data.avgGlobalScore,
      totalCandidates: response.data.totalCandidates,
    };
  } catch (error) {
    const normalizedError = extractNormalizedApiError(error);
    console.error('Error fetching overview stats:', normalizedError.message);
    throw normalizedError;
  }
};
