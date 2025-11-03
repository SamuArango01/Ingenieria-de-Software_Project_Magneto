// app/rrhh/candidatos/[id]/hooks/useCandidateDetail.ts
"use client";

import { useQuery } from "@tanstack/react-query";
import { getCandidateDetail } from "../services/candidate.service";

export function useCandidateDetail(id: string) {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["candidate", id],
    queryFn: () => getCandidateDetail(id),
    staleTime: 5 * 60 * 1000, // 5 min
  });

  return {
    candidate: data,
    isLoading,
    isError,
    error,
  };
}