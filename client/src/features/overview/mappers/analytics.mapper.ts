/**
 * Mappers para transformar datos de la API del servidor
 * al formato esperado por el cliente en la feature Overview
 */

import { Candidate } from '../types/candidate';
import { InterviewData } from '../types/charts';
import { CandidateListItemApi, InterviewsByMonthApi } from '../types/api';
import { formatMonthToSpanish } from '@/lib/utils/date.utils';
import { getPlaceholderAvatar } from '@/lib/utils/avatar.utils';

/**
 * Mapea un candidato del formato API al formato del cliente
 * @param apiCandidate - Candidato en formato de la API
 * @returns Candidato en formato del cliente
 */
export function mapCandidateFromApi(apiCandidate: CandidateListItemApi): Candidate {
  return {
    id: apiCandidate.userId,
    name: apiCandidate.name,
    avatar: apiCandidate.avatar || getPlaceholderAvatar(apiCandidate.userId),
    workField: apiCandidate.workField || apiCandidate.customWorkField || 'No especificado',
    yearsExperience: apiCandidate.yearsOfExperience ?? 0,
    interviews: apiCandidate.completedInterviews, // Usar solo entrevistas completadas
    averageScore: apiCandidate.avgScore ?? 0,
  };
}

/**
 * Mapea datos de entrevistas por mes del servidor al formato del cliente
 * @param apiData - Array de entrevistas por mes de la API
 * @returns Array de entrevistas por mes en formato cliente
 */
export function mapInterviewsByMonth(apiData: InterviewsByMonthApi[]): InterviewData[] {
  return apiData.map(item => ({
    month: formatMonthToSpanish(item.month), // "2025-01" → "Enero"
    interviews: item.total,
  }));
}
