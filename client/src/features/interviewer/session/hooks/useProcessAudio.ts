'use client';

import { useMutation } from '@tanstack/react-query';
import { processAudio } from '../services/session.service';
import { useInterviewContext } from '../../contexts/InterviewContext';

export function useProcessAudio() {
  const { interviewTypeId } = useInterviewContext();

  const mutation = useMutation({
    mutationFn: (audioFile: File) =>
      processAudio(audioFile, interviewTypeId ?? undefined),
    onError: (error) => {
      console.error('Error al procesar audio:', error);
    },
  });

  return {
    processAudio: mutation.mutate,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
    data: mutation.data,
  };
}
