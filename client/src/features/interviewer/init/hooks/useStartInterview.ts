'use client';

import { useMutation } from '@tanstack/react-query';
import { startInterview } from '../services/init.service';
import { useInterviewContext } from '../../contexts/InterviewContext';
import type { StartInterviewRequest } from '../models/init.model';

export function useStartInterview() {
  const { startInterview: startInterviewContext } = useInterviewContext();

  const mutation = useMutation({
    mutationFn: (data: StartInterviewRequest) => startInterview(data),
    onSuccess: (response, variables) => {
      // Guardar datos en el context y activar timer
      startInterviewContext({
        interviewId: response.data.interviewId,
        interviewTypeId: variables.interviewTypeId ?? null,
        candidateName: response.data.candidateName,
        initialMessage: response.data.initialMessage,
      });
    },
    onError: (error) => {
      console.error('Error al iniciar entrevista:', error);
    },
  });

  return {
    startInterview: mutation.mutate,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
    data: mutation.data,
  };
}
