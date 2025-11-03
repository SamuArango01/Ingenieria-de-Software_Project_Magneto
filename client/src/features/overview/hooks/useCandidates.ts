"use client";

import { useQuery } from "@tanstack/react-query";
import { getCandidates } from "../services/candidate.service";

export function useCandidates() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["candidates"],
    queryFn: getCandidates,
    staleTime: 5 * 60 * 1000,
  });

  return {
    candidates: data ?? [],
    isLoading,
    isError,
    error,
  };
}