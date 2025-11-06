import { apiClient } from '@/lib/api';
import { OverviewResponse } from '../types/overview';
import { extractNormalizedApiError } from '@/lib/api/errors';

export const getOverview = async (): Promise<OverviewResponse> => {
  try {
    const response = await apiClient.get<OverviewResponse>('/v1/analytics/overview');
    return response.data;
  } catch (error) {
    const normalizedError = extractNormalizedApiError(error);
    console.error('Error fetching overview:', normalizedError.message);
    throw normalizedError;
  }
};