import { apiClient } from '@/lib/api';
import { extractNormalizedApiError } from '@/lib/api/errors';

// Asumiendo que tienes un tipo WorkField definido en algún lugar, ej: @/types/work-field.ts
interface WorkField {
  id: number;
  description: string;
}

/**
 * Obtiene todos los campos de trabajo disponibles.
 */
export const getAllWorkFields = async (): Promise<WorkField[]> => {
  try {
    const response = await apiClient.get<WorkField[]>('/work-fields');
    return response.data;
  } catch (error) {
    const normalizedError = extractNormalizedApiError(error);
    console.error("Error al obtener los campos de trabajo:", normalizedError.message);
    throw normalizedError;
  }
};
