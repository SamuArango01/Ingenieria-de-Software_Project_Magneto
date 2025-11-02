import { AppDataSource } from "@/database/data-source";
import { User } from "@/modules/users/entities/User";
import { Interview } from "@/modules/interviews/entities/Interview";
import { InterviewEvaluation } from "@/modules/interview-evaluations/entities/InterviewEvaluation";
import { UserRole, RoleType } from "@/modules/roles/entities/UserRole";
import { GetCandidatesDto, SortByField, SortOrder } from "@/modules/analytics/dto/GetCandidatesDto";
import {
  CandidateListItem
} from "@/modules/analytics/dto/responses/CandidateListResponse";
import {
  CandidateUser,
  CandidateMetrics,
  ScoreHistoryItem,
  LatestEvaluation
} from "@/modules/analytics/dto/responses/CandidateDetailResponse";
import {
  InterviewsByMonth
} from "@/modules/analytics/dto/responses/OverviewResponse";
import { IAnalyticsRepository } from "@/modules/analytics/interfaces/IAnalyticsRepository";

export class AnalyticsRepository implements IAnalyticsRepository {
  /**
   * Obtiene lista paginada de candidatos con sus métricas agregadas
   */
  async getCandidatesList(filters: GetCandidatesDto): Promise<{ data: CandidateListItem[]; total: number }> {
    const { page = 1, limit = 20, sortBy = SortByField.AVG_SCORE, order = SortOrder.DESC } = filters;
    const skip = (page - 1) * limit;

    // Query base con JOINs y agregaciones
    const queryBuilder = AppDataSource.createQueryBuilder()
      .select('u.id', 'userId')
      .addSelect('u.name', 'name')
      .addSelect('u.email', 'email')
      .addSelect('COALESCE(wf.description, uc.custom_work_field)', 'workField')
      .addSelect('uc.custom_work_field', 'customWorkField')
      .addSelect('uc.years_of_experience', 'yearsOfExperience')
      .addSelect('COUNT(i.id)', 'totalInterviews')
      .addSelect('COUNT(CASE WHEN i.status = :completedStatus THEN 1 END)', 'completedInterviews')
      .addSelect('AVG(CASE WHEN i.score IS NOT NULL THEN i.score END)', 'avgScore')
      .addSelect('MAX(i.completed_at)', 'lastInterviewDate')
      .from(User, 'u')
      .innerJoin(UserRole, 'ur', 'ur.user_id = u.id')
      .leftJoin('user_configuration', 'uc', 'uc.user_id = u.id')
      .leftJoin('work_fields', 'wf', 'wf.id = uc.work_field_id')
      .leftJoin('interviews', 'i', 'i.user_id = u.id')
      .where('ur.role = :role', { role: RoleType.CANDIDATE, completedStatus: 'completed' })
      .groupBy('u.id')
      .addGroupBy('u.name')
      .addGroupBy('u.email')
      .addGroupBy('wf.description')
      .addGroupBy('uc.custom_work_field')
      .addGroupBy('uc.years_of_experience');

    // Aplicar ordenamiento
    let orderByField: string;
    switch (sortBy) {
      case SortByField.AVG_SCORE:
        orderByField = 'avgScore';
        break;
      case SortByField.NAME:
        orderByField = 'name';
        break;
      case SortByField.LAST_INTERVIEW:
        orderByField = 'lastInterviewDate';
        break;
      default:
        orderByField = 'avgScore';
    }

    queryBuilder.orderBy(orderByField, order, 'NULLS LAST');

    // Obtener total antes de aplicar paginación
    const totalQuery = queryBuilder.clone();
    const totalResult = await totalQuery.getRawMany();
    const total = totalResult.length;

    // Aplicar paginación
    queryBuilder.limit(limit).offset(skip);

    // Ejecutar query
    const rawResults = await queryBuilder.getRawMany();

    // Transformar resultados
    const data: CandidateListItem[] = rawResults.map(row => ({
      userId: row.userId,
      name: row.name,
      email: row.email,
      avatar: null, // TODO: Obtener de Clerk cuando esté disponible
      workField: row.workField || null,
      customWorkField: row.customWorkField || null,
      yearsOfExperience: row.yearsOfExperience ? parseInt(row.yearsOfExperience) : null,
      totalInterviews: parseInt(row.totalInterviews) || 0,
      completedInterviews: parseInt(row.completedInterviews) || 0,
      avgScore: row.avgScore ? parseFloat(parseFloat(row.avgScore).toFixed(2)) : null,
      lastInterviewDate: row.lastInterviewDate || null
    }));

    return { data, total };
  }

  /**
   * Obtiene información básica de un candidato
   */
  async getCandidateUser(userId: string): Promise<CandidateUser | null> {
    const result = await AppDataSource.createQueryBuilder()
      .select('u.id', 'userId')
      .addSelect('u.name', 'name')
      .addSelect('u.email', 'email')
      .addSelect('COALESCE(wf.description, uc.custom_work_field)', 'workField')
      .addSelect('uc.custom_work_field', 'customWorkField')
      .addSelect('uc.years_of_experience', 'yearsOfExperience')
      .addSelect('uc.preferred_language', 'preferredLanguage')
      .addSelect('u.created_at', 'registeredAt')
      .from(User, 'u')
      .leftJoin('user_configuration', 'uc', 'uc.user_id = u.id')
      .leftJoin('work_fields', 'wf', 'wf.id = uc.work_field_id')
      .where('u.id = :userId', { userId })
      .getRawOne();

    if (!result) {
      return null;
    }

    return {
      userId: result.userId,
      name: result.name,
      email: result.email,
      avatar: null, // TODO: Obtener de Clerk
      workField: result.workField || null,
      customWorkField: result.customWorkField || null,
      yearsOfExperience: result.yearsOfExperience ? parseInt(result.yearsOfExperience) : null,
      preferredLanguage: result.preferredLanguage || null,
      registeredAt: result.registeredAt
    };
  }

  /**
   * Obtiene métricas agregadas de un candidato
   */
  async getCandidateMetrics(userId: string): Promise<CandidateMetrics> {
    const result = await AppDataSource.createQueryBuilder()
      .select('COUNT(i.id)', 'totalInterviews')
      .addSelect('COUNT(CASE WHEN i.status = :completed THEN 1 END)', 'completedInterviews')
      .addSelect('COUNT(CASE WHEN i.status = :inProgress THEN 1 END)', 'inProgressInterviews')
      .addSelect('COUNT(CASE WHEN i.status = :abandoned THEN 1 END)', 'abandonedInterviews')
      .addSelect('AVG(CASE WHEN i.score IS NOT NULL THEN i.score END)', 'avgScore')
      .addSelect('AVG(CASE WHEN i.duration_minutes IS NOT NULL THEN i.duration_minutes END)', 'avgDuration')
      .from(Interview, 'i')
      .where('i.user_id = :userId', {
        userId,
        completed: 'completed',
        inProgress: 'in_progress',
        abandoned: 'abandoned'
      })
      .getRawOne();

    return {
      totalInterviews: parseInt(result?.totalInterviews) || 0,
      completedInterviews: parseInt(result?.completedInterviews) || 0,
      inProgressInterviews: parseInt(result?.inProgressInterviews) || 0,
      abandonedInterviews: parseInt(result?.abandonedInterviews) || 0,
      avgScore: result?.avgScore ? parseFloat(parseFloat(result.avgScore).toFixed(2)) : null,
      avgDuration: result?.avgDuration ? parseFloat(parseFloat(result.avgDuration).toFixed(1)) : null
    };
  }

  /**
   * Obtiene historial de scores de un candidato
   */
  async getScoreHistory(userId: string): Promise<ScoreHistoryItem[]> {
    const results = await AppDataSource.createQueryBuilder()
      .select('DATE(i.completed_at)', 'date')
      .addSelect('i.score', 'score')
      .addSelect('it.name', 'interviewType')
      .addSelect('i.duration_minutes', 'duration')
      .from(Interview, 'i')
      .innerJoin('interview_types', 'it', 'it.id = i.interview_type_id')
      .where('i.user_id = :userId', { userId })
      .andWhere('i.status = :status', { status: 'completed' })
      .andWhere('i.score IS NOT NULL')
      .orderBy('i.completed_at', 'ASC')
      .getRawMany();

    return results.map(row => ({
      date: row.date,
      score: parseFloat(row.score),
      interviewType: row.interviewType,
      duration: row.duration ? parseInt(row.duration) : null
    }));
  }

  /**
   * Obtiene la última evaluación de un candidato
   */
  async getLatestEvaluation(userId: string): Promise<LatestEvaluation | null> {
    const result = await AppDataSource.createQueryBuilder()
      .select('ie.strengths', 'strengths')
      .addSelect('ie.areas_to_improve', 'weaknesses')
      .from(InterviewEvaluation, 'ie')
      .innerJoin('interviews', 'i', 'i.id = ie.interview_id')
      .where('i.user_id = :userId', { userId })
      .orderBy('i.completed_at', 'DESC')
      .limit(1)
      .getRawOne();

    if (!result) {
      return null;
    }

    return {
      strengths: result.strengths || null,
      weaknesses: result.weaknesses || null
    };
  }

  /**
   * Obtiene total de candidatos en el sistema
   */
  async getTotalCandidates(): Promise<number> {
    const result = await AppDataSource.createQueryBuilder()
      .select('COUNT(ur.id)', 'total')
      .from(UserRole, 'ur')
      .where('ur.role = :role', { role: RoleType.CANDIDATE })
      .getRawOne();

    return parseInt(result?.total) || 0;
  }

  /**
   * Obtiene estadísticas globales de entrevistas
   */
  async getInterviewStats(): Promise<{
    totalInterviews: number;
    completedInterviews: number;
    completionRate: number;
    avgGlobalScore: number | null;
  }> {
    const result = await AppDataSource.createQueryBuilder()
      .select('COUNT(i.id)', 'totalInterviews')
      .addSelect('COUNT(CASE WHEN i.status = :completed THEN 1 END)', 'completedInterviews')
      .addSelect('AVG(CASE WHEN i.score IS NOT NULL THEN i.score END)', 'avgGlobalScore')
      .from(Interview, 'i')
      .where('1=1')
      .setParameter('completed', 'completed')
      .getRawOne();

    const totalInterviews = parseInt(result?.totalInterviews) || 0;
    const completedInterviews = parseInt(result?.completedInterviews) || 0;
    const completionRate = totalInterviews > 0
      ? parseFloat(((completedInterviews / totalInterviews) * 100).toFixed(1))
      : 0;

    return {
      totalInterviews,
      completedInterviews,
      completionRate,
      avgGlobalScore: result?.avgGlobalScore ? parseFloat(parseFloat(result.avgGlobalScore).toFixed(1)) : null
    };
  }

  /**
   * Obtiene entrevistas agrupadas por mes (últimos 12 meses)
   */
  async getInterviewsByMonth(): Promise<InterviewsByMonth[]> {
    const results = await AppDataSource.createQueryBuilder()
      .select("TO_CHAR(i.completed_at, 'YYYY-MM')", 'month')
      .addSelect('COUNT(i.id)', 'total')
      .from(Interview, 'i')
      .where('i.status = :status', { status: 'completed' })
      .andWhere("i.completed_at >= NOW() - INTERVAL '12 months'")
      .groupBy('month')
      .orderBy('month', 'ASC')
      .getRawMany();

    return results.map(row => ({
      month: row.month,
      total: parseInt(row.total)
    }));
  }
}
