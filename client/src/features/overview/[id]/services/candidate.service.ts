// app/rrhh/candidatos/[id]/services/candidate.service.ts
import { mockCandidateDetail } from "../data/mockCandidate";

export interface CandidateDetail {
  id: string;
  name: string;
  avatar: string;
  workField: string;
  yearsExperience: number;
  totalInterviews: number;
  averageScore: number;
  averageDuration: number;
  strengths: string[];
  weaknesses: string[];
  interviewHistory: {
    date: string;
    score: number;
    duration: number;
  }[];
}

export const getCandidateDetail = async (id: string): Promise<CandidateDetail> => {
  await new Promise(resolve => setTimeout(resolve, 500));

  // Simulamos error si no existe
  if (!["123", "456", "789"].includes(id)) {
    throw new Error("Candidato no encontrado");
  }

  // Devolvemos el mock (puedes personalizar por ID)
  return { ...mockCandidateDetail, id };
};

