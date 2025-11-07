'use client';

import { useQuery } from '@tanstack/react-query';
import { getAvailableInterviewTypes } from '../services/init.service';

export function useInterviewTypes() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['availableInterviewTypes'],
    queryFn: getAvailableInterviewTypes,
  });

  return {
    interviewTypes: data ?? [],
    isLoading,
    isError,
    error,
  };
}
