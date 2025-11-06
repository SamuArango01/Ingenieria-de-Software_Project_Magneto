import { apiClient } from '@/lib/api';
import {
  CandidateListResponse,
  GetCandidatesParams,
  SortByField,
  SortOrder
} from '../types/candidates';
import { extractNormalizedApiError } from '@/lib/api/errors';

export async function getCandidates(
  params: GetCandidatesParams = {}
): Promise<CandidateListResponse> {
  const {
    page = 1,
    limit = 20,
    sortBy = SortByField.AVG_SCORE,
    order = SortOrder.DESC
  } = params;

  try {
    const response = await apiClient.get<CandidateListResponse>('/v1/analytics/candidates', {
      params: {
        page,
        limit,
        sortBy,
        order
      }
    });
    return response.data;
  } catch (error) {
    const normalizedError = extractNormalizedApiError(error);
    console.error('Error fetching candidates:', normalizedError.message);
    throw normalizedError;
  }
}