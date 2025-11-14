'use client';

import { useMutation } from '@tanstack/react-query';
import { sendInterviewEmail } from '../services/session.service';
import type { SendEmailRequest } from '../models/session.model';

export function useSendEmail() {
  const mutation = useMutation({
    mutationFn: (data: SendEmailRequest) => sendInterviewEmail(data),
    onError: (error) => {
      console.error('Error al enviar email:', error);
    },
  });

  return {
    sendEmail: mutation.mutate,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
    data: mutation.data,
  };
}
