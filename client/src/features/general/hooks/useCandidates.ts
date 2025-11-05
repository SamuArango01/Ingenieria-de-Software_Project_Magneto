"use client";

import { useState } from "react";
import { Candidate } from "../types/candidates";

export function useCandidates() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);

  const addCandidate = (candidate: Candidate) => {
    setCandidates(prev => [...prev, candidate]);
  };

  const updateCandidate = (id: string, updates: Partial<Candidate>) => {
    setCandidates(prev => 
      prev.map(candidate => 
        candidate.id === id ? { ...candidate, ...updates } : candidate
      )
    );
  };

  const deleteCandidate = (id: string) => {
    setCandidates(prev => prev.filter(candidate => candidate.id !== id));
  };

  return {
    candidates,
    addCandidate,
    updateCandidate,
    deleteCandidate
  };
}