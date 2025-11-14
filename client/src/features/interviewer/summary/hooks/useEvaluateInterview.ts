import { useMutation } from '@tanstack/react-query';
import { evaluateInterview } from '../services/evaluation.service';
import type { EvaluateInterviewRequest } from '../models/evaluation.model';

export function useEvaluateInterview() {
  const mutation = useMutation({
    mutationFn: (request: EvaluateInterviewRequest) => evaluateInterview(request),
    onError: (error) => {
      console.error('Error al evaluar entrevista:', error);
    },
  });

  return {
    evaluateInterview: mutation.mutateAsync,
    isLoading: mutation.isPending,
    error: mutation.error,
  };
}
