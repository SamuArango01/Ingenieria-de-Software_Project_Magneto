// services/candidate.service.ts
import { mockCandidates } from '../data/mockCandidate'; 
import { Candidate } from '../types/candidate'; 

export const getCandidates = async (): Promise<Candidate[]> => {
  // Simular delay de API
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockCandidates;
};