import { apiClient } from '@/lib/api';
import { extractNormalizedApiError } from '@/lib/api/errors';

// Asumiendo tipos definidos en algún lugar central
interface UserConfiguration {
  id: number;
  userId: string;
  workFieldId: number | null;
  customWorkField: string | null;
  yearsOfExperience: number;
  preferredLanguage: string;
}

interface CreateOrUpdateDto {
  workFieldId?: number;
  customWorkField?: string;
  yearsOfExperience: number;
  preferredLanguage?: string;
}

/**
 * Obtiene la configuración del usuario autenticado.
 * Devuelve null si no se encuentra (404).
 */
export const getUserConfiguration = async (): Promise<UserConfiguration | null> => {
  try {
    const response = await apiClient.get<UserConfiguration>('/user-configurations/');
    return response.data;
  } catch (error) {
    const normalizedError = extractNormalizedApiError(error);
    // Es normal no encontrar una configuración la primera vez, por eso no lanzamos error en 404.
    if (normalizedError.status === 404) {
      return null;
    }
    console.error("Error al obtener la configuración del usuario:", normalizedError.message);
    throw normalizedError;
  }
};

/**
 * Crea o actualiza la configuración del usuario autenticado.
 */
export const createOrUpdateUserConfiguration = async (dto: CreateOrUpdateDto): Promise<UserConfiguration> => {
  try {
    const response = await apiClient.put<UserConfiguration>('/user-configurations', dto);
    return response.data;
  } catch (error) {
    const normalizedError = extractNormalizedApiError(error);
    console.error("Error al guardar la configuración del usuario:", normalizedError.message);
    throw normalizedError;
  }
};
