// hooks/useCandidates.ts
"use client";

import { useQuery } from "@tanstack/react-query";
import { getCandidates } from "../services/candidate.service";
import { Candidate } from "../types/candidate";

export function useCandidates() {
  const { data, isLoading, isError, error } = useQuery<Candidate[]>({
    queryKey: ["candidates"],
    queryFn: getCandidates,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });

  return {
    candidates: data ?? [],
    isLoading,
    isError,
    error,
  };
}