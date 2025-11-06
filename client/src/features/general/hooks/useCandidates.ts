"use client";

import { useQuery } from "@tanstack/react-query";
import { getCandidates } from "../services/candidates-service";
import { Candidate } from "../types/candidates";

export function useCandidates() {
  const { data: candidates = [], isLoading, error } = useQuery({
    queryKey: ["candidates"],
    queryFn: getCandidates,
  });

  return {
    candidates,
    isLoading,
    error,
  };
}