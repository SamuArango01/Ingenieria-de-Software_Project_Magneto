/**
 * Servicio para obtener datos de candidatos desde la API
 */
import { apiClient } from '@/lib/api';
import { Candidate } from '../types/candidate';
import { CandidateApiResponse } from '../types/api';
import { mapCandidateFromApi } from '../mappers/analytics.mapper';
import { extractNormalizedApiError } from '@/lib/api/errors';

export const getCandidates = async (): Promise<Candidate[]> => {
  try {
    const response = await apiClient.get<CandidateApiResponse>(
      '/v1/analytics/candidates',
      {
        params: {
          limit: 100, // Obtener todos los candidatos para el overview
          sortBy: 'avgScore',
          order: 'DESC'
        }
      }
    );

    return response.data.data.map(mapCandidateFromApi);
  } catch (error) {
    const normalizedError = extractNormalizedApiError(error);
    console.error('Error fetching candidates:', normalizedError.message);
    throw normalizedError;
  }
};