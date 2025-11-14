import { apiClient } from '@/lib/api';
import type { EvaluateInterviewRequest, EvaluateInterviewResponse } from '../models/evaluation.model';

export const evaluateInterview = async (
  request: EvaluateInterviewRequest
): Promise<EvaluateInterviewResponse> => {
  const response = await apiClient.post<EvaluateInterviewResponse>(
    '/v1/interviews/evaluate',
    request
  );
  return response.data;
};
