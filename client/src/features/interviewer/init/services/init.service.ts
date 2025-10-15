import { apiClient } from '@/lib/api';
import { extractNormalizedApiError } from '@/lib/api/errors';
import type { StartInterviewRequest, StartInterviewResponse } from '../models/init.model';
import type { InterviewType } from '@/features/interview-types/models/interview-type.model';

/**
 * Obtiene todos los tipos de entrevista disponibles para el usuario
 */
export const getAvailableInterviewTypes = async (): Promise<InterviewType[]> => {
  try {
    const response = await apiClient.get<InterviewType[]>('/v1/interview-types/available');
    return response.data;
  } catch (error) {
    throw extractNormalizedApiError(error);
  }
};

/**
 * Inicia una nueva sesión de entrevista
 */
export const startInterview = async (
  data: StartInterviewRequest
): Promise<StartInterviewResponse> => {
  try {
    const response = await apiClient.post<StartInterviewResponse>(
      '/v1/interviews/start-star-interview',
      data
    );
    return response.data;
  } catch (error) {
    throw extractNormalizedApiError(error);
  }
};
