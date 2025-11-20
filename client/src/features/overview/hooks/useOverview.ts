"use client";

import { useQuery } from "@tanstack/react-query";
import { getOverview } from "../services/overview.services";
import { OverviewResponse } from "../types/overview";

export function useOverview() {
  const {
    data: overview,
    isLoading,
    isError,
    error,
  } = useQuery<OverviewResponse, Error>({
    queryKey: ["overview"],
    queryFn: getOverview,
    staleTime: 3 * 60 * 1000, // 3 minutos
    gcTime: 5 * 60 * 1000, // 5 minutos
    retry: 2,
  });

  return {
    overview: overview || {
      totalCandidates: 0,
      totalInterviews: 0,
      completedInterviews: 0,
      completionRate: 0,
      avgGlobalScore: null,
      interviewsByMonth: [],
    },
    isLoading,
    isError,
    error: error?.message || null,
  };
}