import { apiClient } from '@/lib/api';
import { extractNormalizedApiError } from '@/lib/api/errors';
import type {
  ProcessAudioResponse,
  SendEmailRequest,
  SendEmailResponse,
} from '../models/session.model';

/**
 * Procesa el audio enviado por el candidato
 */
export const processAudio = async (
  audioFile: File,
  interviewTypeId?: number
): Promise<ProcessAudioResponse> => {
  try {
    const formData = new FormData();
    formData.append('audio', audioFile);

    if (interviewTypeId) {
      formData.append('interviewTypeId', interviewTypeId.toString());
    }

    const response = await apiClient.post<ProcessAudioResponse>(
      '/v1/interviews/audio',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  } catch (error) {
    throw extractNormalizedApiError(error);
  }
};

/**
 * Envía el resumen de la entrevista por email
 */
export const sendInterviewEmail = async (
  data: SendEmailRequest
): Promise<SendEmailResponse> => {
  try {
    const response = await apiClient.post<SendEmailResponse>(
      '/v1/interviews/email',
      data
    );
    return response.data;
  } catch (error) {
    throw extractNormalizedApiError(error);
  }
};
