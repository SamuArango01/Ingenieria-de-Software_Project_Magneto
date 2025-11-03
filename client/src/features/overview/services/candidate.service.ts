import { mockCandidates } from '../data/mockCandidate'; 
import { Candidate } from '../types/candidate'; 

export const getCandidates = async (): Promise<Candidate[]> => {
  return mockCandidates;
};

// Reutilizamos el mock del detalle
export { getCandidateDetail } from "../[id]/services/candidate.service";