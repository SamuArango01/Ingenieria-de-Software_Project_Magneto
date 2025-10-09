import { apiClient } from '@/lib/api';
import { extractNormalizedApiError } from '@/lib/api/errors';
import type { InterviewType } from '@/features/interview-types/models/interview-type.model';

/**
 * Obtiene todos los tipos de entrevista disponibles para el usuario (públicos y propios).
 */
export const getAvailableInterviewTypes = async (): Promise<InterviewType[]> => {
  try {
    const response = await apiClient.get<InterviewType[]>('/interview-types/available');
    return response.data;
  } catch (error) {
    throw extractNormalizedApiError(error);
  }
};

/**
 * Obtiene solo los tipos de entrevista creados por el usuario actual.
 */
export const getUserInterviewTypes = async (): Promise<InterviewType[]> => {
  try {
    const response = await apiClient.get<InterviewType[]>('/interview-types');
    return response.data;
  } catch (error) {
    throw extractNormalizedApiError(error);
  }
};

/**
 * Obtiene un tipo de entrevista específico por su ID.
 * NOTA: Este endpoint necesita ser creado en el backend.
 */
export const getInterviewTypeById = async (id: number): Promise<InterviewType> => {
  try {
    const response = await apiClient.get<InterviewType>(`/interview-types/${id}`);
    return response.data;
  } catch (error) {
    throw extractNormalizedApiError(error);
  }
};

/**
 * Crea un nuevo tipo de entrevista.
 */
export const createInterviewType = async (data: { name: string; description: string }): Promise<InterviewType> => {
  try {
    const response = await apiClient.post<InterviewType>('/interview-types', data);
    return response.data;
  } catch (error) {
    throw extractNormalizedApiError(error);
  }
};

/**
 * Actualiza un tipo de entrevista existente.
 */
export const updateInterviewType = async (id: number, data: { name: string; description: string }): Promise<InterviewType> => {
  try {
    const response = await apiClient.put<InterviewType>(`/interview-types/${id}`, data);
    return response.data;
  } catch (error) {
    throw extractNormalizedApiError(error);
  }
};

/**
 * Activa o desactiva un tipo de entrevista.
 */
export const toggleInterviewTypeActive = async (id: number): Promise<InterviewType> => {
  try {
    const response = await apiClient.patch<InterviewType>(`/interview-types/${id}/toggle-active`);
    return response.data;
  } catch (error) {
    throw extractNormalizedApiError(error);
  }
};
