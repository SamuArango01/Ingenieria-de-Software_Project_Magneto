import { apiClient } from '@/lib/api';
import { extractNormalizedApiError } from '@/lib/api/errors';
import { CandidateProfile } from "../types/candidate";

export const candidateService = {
  // Método para obtener el perfil del usuario autenticado
  getMyProfile: async (userId: string): Promise<CandidateProfile> => {
    try {
      const response = await apiClient.get<CandidateProfile>(
        `/v1/analytics/candidates/${userId}`
      );
      return response.data;
    } catch (error) {
      const normalizedError = extractNormalizedApiError(error);
      console.error('Error fetching my profile:', normalizedError.message);
      throw normalizedError;
    }
  },

  // Método para obtener perfil de cualquier candidato (para RRHH)
  getCandidateProfile: async (candidateId: string): Promise<CandidateProfile> => {
    try {
      const response = await apiClient.get<CandidateProfile>(
        `/v1/analytics/candidates/${candidateId}`
      );
      return response.data;
    } catch (error) {
      const normalizedError = extractNormalizedApiError(error);
      console.error('Error fetching candidate profile:', normalizedError.message);
      throw normalizedError;
    }
  }
};