"use client";

import { useQuery } from "@tanstack/react-query";
import { 
  CandidateListResponse, 
  GetCandidatesParams,
} from "../types/candidates";
import { getCandidates } from "../services/candidates-service";

export function useCandidates(params: GetCandidatesParams = {}) {
  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    isFetching
  } = useQuery<CandidateListResponse, Error>({
    queryKey: ["candidates", params],
    queryFn: () => getCandidates(params),
    staleTime: 3 * 60 * 1000, // 3 minutos
    gcTime: 5 * 60 * 1000, // 5 minutos
    retry: 2,
    retryDelay: 1000,
  });

  return {
    candidates: data?.data || [],
    pagination: data?.pagination || {
      total: 0,
      page: 1,
      limit: 20,
      totalPages: 0
    },
    isLoading,
    isFetching,
    isError,
    error: error?.message || null,
    refetch
  };
}

// Tipos para filtros de cliente
interface ClientFilters {
  searchTerm?: string;
  workField?: string;
  minExperience?: number;
  minScore?: number;
  minInterviews?: number;
}

// Funciones auxiliares para cada filtro
const matchesSearchTerm = (candidate: CandidateListResponse['data'][0], searchTerm?: string): boolean => {
  if (!searchTerm) return true;
  
  const searchLower = searchTerm.toLowerCase();
  return (
    candidate.name.toLowerCase().includes(searchLower) ||
    candidate.email.toLowerCase().includes(searchLower)
  );
};

const matchesWorkField = (candidate: CandidateListResponse['data'][0], workField?: string): boolean => {
  if (!workField || workField === "Todos") return true;
  
  return (
    candidate.workField === workField ||
    candidate.customWorkField === workField
  );
};

const matchesMinExperience = (candidate: CandidateListResponse['data'][0], minExperience?: number): boolean => {
  if (!minExperience || minExperience <= 0) return true;
  
  return (candidate.yearsOfExperience || 0) >= minExperience;
};

const matchesMinScore = (candidate: CandidateListResponse['data'][0], minScore?: number): boolean => {
  if (!minScore || minScore <= 0) return true;
  
  return (candidate.avgScore || 0) >= minScore;
};

const matchesMinInterviews = (candidate: CandidateListResponse['data'][0], minInterviews?: number): boolean => {
  if (!minInterviews || minInterviews <= 0) return true;
  
  return candidate.completedInterviews >= minInterviews;
};

// Hook adicional para filtrado en cliente
export function useCandidatesWithClientFilters(
  params: GetCandidatesParams = {},
  clientFilters?: ClientFilters
) {
  const { candidates, ...rest } = useCandidates(params);

  // Si no hay filtros de cliente, devolver 
  if (!clientFilters) {
    return { candidates, ...rest };
  }

  // Aplicar todos los filtros
  const filteredCandidates = candidates.filter(candidate => 
    matchesSearchTerm(candidate, clientFilters.searchTerm) &&
    matchesWorkField(candidate, clientFilters.workField) &&
    matchesMinExperience(candidate, clientFilters.minExperience) &&
    matchesMinScore(candidate, clientFilters.minScore) &&
    matchesMinInterviews(candidate, clientFilters.minInterviews)
  );

  return {
    candidates: filteredCandidates,
    ...rest
  };
}