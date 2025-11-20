"use client";

import { useQuery } from "@tanstack/react-query";
import { getOverviewStats } from "../services/overview.service";

export function useOverviewStats() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["overview-stats"],
    queryFn: getOverviewStats,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });

  return {
    interviewData: data?.interviewsByMonth ?? [],
    totalInterviews: data?.totalInterviews ?? 0,
    completionRate: data?.completionRate ?? 0,
    avgGlobalScore: data?.avgGlobalScore ?? null,
    totalCandidates: data?.totalCandidates ?? 0,
    isLoading,
    isError,
    error,
  };
}
