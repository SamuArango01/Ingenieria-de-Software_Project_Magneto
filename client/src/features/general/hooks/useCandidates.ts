"use client";

import { useState, useCallback } from "react";
import { CandidateListItem, CandidateListResponse, GetCandidatesParams } from "../types/candidates";
import { getCandidates } from "../services/candidates-service";

export function useCandidates() {
  const [candidates, setCandidates] = useState<CandidateListItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 20,
    totalPages: 0
  });

  const fetchCandidates = useCallback(async (params: GetCandidatesParams = {}) => {
    setLoading(true);
    try {
      const response: CandidateListResponse = await getCandidates(params);
      setCandidates(response.data);
      setPagination(response.pagination);
    } catch (error) {
      console.error('Error fetching candidates:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const addCandidate = (candidate: CandidateListItem) => {
    setCandidates(prev => [...prev, candidate]);
  };

  const updateCandidate = (userId: string, updates: Partial<CandidateListItem>) => {
    setCandidates(prev => 
      prev.map(candidate => 
        candidate.userId === userId ? { ...candidate, ...updates } : candidate
      )
    );
  };

  const deleteCandidate = (userId: string) => {
    setCandidates(prev => prev.filter(candidate => candidate.userId !== userId));
  };

  return {
    candidates,
    pagination,
    loading,
    fetchCandidates,
    addCandidate,
    updateCandidate,
    deleteCandidate
  };
}