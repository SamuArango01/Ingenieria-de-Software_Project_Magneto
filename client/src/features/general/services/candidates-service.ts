/**
 * Servicio para obtener datos de candidatos desde la API
 */
import { apiClient } from '@/lib/api';
import { Candidate } from '../types/candidates';
import { CandidateApiResponse } from '../types/api';
import { mapCandidateFromApi } from '../mappers/candidates.mapper';
import { extractNormalizedApiError } from '@/lib/api/errors';

export async function getCandidates(): Promise<Candidate[]> {
  try {
    const response = await apiClient.get<CandidateApiResponse>(
      '/v1/analytics/candidates',
      {
        params: {
          limit: 100,
          sortBy: 'name',
          order: 'ASC'
        }
      }
    );

    return response.data.data.map(mapCandidateFromApi);
  } catch (error) {
    const normalizedError = extractNormalizedApiError(error);
    console.error('Error fetching candidates:', normalizedError.message);
    throw normalizedError;
  }
}