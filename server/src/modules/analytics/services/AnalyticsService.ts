import { ok, err, Result } from 'neverthrow';
import { GetCandidatesDto } from "@/modules/analytics/dto/GetCandidatesDto";
import { CandidateListResponse } from "@/modules/analytics/dto/responses/CandidateListResponse";
import { CandidateDetailResponse } from "@/modules/analytics/dto/responses/CandidateDetailResponse";
import { OverviewResponse } from "@/modules/analytics/dto/responses/OverviewResponse";
import type { IAnalyticsRepository } from "@/modules/analytics/interfaces/IAnalyticsRepository";
import type { IAnalyticsService } from "@/modules/analytics/interfaces/IAnalyticsService";
import { AnalyticsRepository } from "@/modules/analytics/repositories/AnalyticsRepository";

type ValidationError = { type: 'ValidationError'; message: string };
type NotFoundError = { type: 'NotFoundError'; message: string };

export class AnalyticsService implements IAnalyticsService {
  private repository: IAnalyticsRepository;

  constructor(repository: IAnalyticsRepository = new AnalyticsRepository()) {
    this.repository = repository;
  }

  /**
   * Obtiene lista paginada de candidatos con sus métricas
   */
  async getCandidates(filters: GetCandidatesDto): Promise<Result<CandidateListResponse, ValidationError>> {
    try {
      // Validar filtros
      const { page = 1, limit = 20 } = filters;

      if (page < 1) {
        return err({ type: 'ValidationError', message: 'Page must be greater than 0' });
      }

      if (limit < 1 || limit > 100) {
        return err({ type: 'ValidationError', message: 'Limit must be between 1 and 100' });
      }

      // Obtener datos del repository
      const { data, total } = await this.repository.getCandidatesList(filters);

      // Calcular paginación
      const totalPages = Math.ceil(total / limit);

      const response: CandidateListResponse = {
        data,
        pagination: {
          total,
          page,
          limit,
          totalPages
        }
      };

      return ok(response);
    } catch (error) {
      console.error('Error in getCandidates:', error);
      return err({ type: 'ValidationError', message: 'Failed to retrieve candidates' });
    }
  }

  /**
   * Obtiene detalle completo de un candidato específico
   */
  async getCandidateDetail(userId: string): Promise<Result<CandidateDetailResponse, ValidationError | NotFoundError>> {
    try {
      // Validar userId
      if (!userId || userId.trim() === '') {
        return err({ type: 'ValidationError', message: 'User ID is required' });
      }

      // Obtener datos del candidato
      const user = await this.repository.getCandidateUser(userId);

      if (!user) {
        return err({ type: 'NotFoundError', message: 'Candidate not found' });
      }

      // Obtener métricas, historial y evaluación en paralelo
      const [metrics, scoreHistory, latestEvaluation] = await Promise.all([
        this.repository.getCandidateMetrics(userId),
        this.repository.getScoreHistory(userId),
        this.repository.getLatestEvaluation(userId)
      ]);

      const response: CandidateDetailResponse = {
        user,
        metrics,
        scoreHistory,
        latestEvaluation
      };

      return ok(response);
    } catch (error) {
      console.error('Error in getCandidateDetail:', error);
      return err({ type: 'ValidationError', message: 'Failed to retrieve candidate details' });
    }
  }

  /**
   * Obtiene métricas generales del sistema
   */
  async getOverview(): Promise<Result<OverviewResponse, never>> {
    try {
      // Obtener todas las métricas en paralelo
      const [totalCandidates, interviewStats, interviewsByMonth] = await Promise.all([
        this.repository.getTotalCandidates(),
        this.repository.getInterviewStats(),
        this.repository.getInterviewsByMonth()
      ]);

      const response: OverviewResponse = {
        totalCandidates,
        totalInterviews: interviewStats.totalInterviews,
        completedInterviews: interviewStats.completedInterviews,
        completionRate: interviewStats.completionRate,
        avgGlobalScore: interviewStats.avgGlobalScore,
        interviewsByMonth
      };

      return ok(response);
    } catch (error) {
      console.error('Error in getOverview:', error);
      // Retornar datos vacíos en caso de error en lugar de fallar
      return ok({
        totalCandidates: 0,
        totalInterviews: 0,
        completedInterviews: 0,
        completionRate: 0,
        avgGlobalScore: null,
        interviewsByMonth: []
      });
    }
  }
}
