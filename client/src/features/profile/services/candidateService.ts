import { CandidateProfile, CandidateUser, CandidateMetrics, ScoreHistoryItem, LatestEvaluation } from "../types/candidate";

export const candidateService = {
  // Método para obtener el perfil del usuario autenticado
  getMyProfile: async (userId: string, userData?: any): Promise<CandidateProfile> => {
    // Simulando la respuesta del backend con la estructura correcta
    return candidateService.generateUserProfile(userId, userData);
  },

  // Método para obtener perfil de cualquier candidato (para RRHH)
  getCandidateProfile: async (candidateId: string): Promise<CandidateProfile> => {
    return candidateService.generateUserProfile(candidateId);
  },

  // Generar perfil con la estructura del backend
  generateUserProfile: (userId: string, userData?: any): CandidateProfile => {
    const simpleHash = (str: string): number => {
      if (!str || str.length === 0) return 12345;
      let hash = 0;
      for (let i = 0; i < str.length; i++) {
        hash = (hash * 31 + (i + 1) * str.length) % 1000000;
      }
      return Math.abs(hash || 12345);
    };

    const userHash = simpleHash(userId);

    // Mock data 
    const workFields = [
      "Desarrollo Frontend", "Desarrollo Backend", "Full Stack", 
      "Mobile Development", "DevOps", "Data Science", "UX/UI Design"
    ];
    
    const namePool = [
      "Ana García", "Carlos López", "María Rodríguez", "David Martínez",
      "Laura Hernández", "Javier Pérez", "Sofía González", "Miguel Sánchez"
    ];

    const workField = workFields[userHash % workFields.length];
    const userName = userData?.fullName || namePool[userHash % namePool.length];
    const yearsExp = (userHash % 5) + 1;
    const totalInterviews = (userHash % 8) + 1;
    const avgScore = 70 + (userHash % 25);

    const user: CandidateUser = {
      userId: userId,
      name: userName,
      email: userData?.email || `${userName.toLowerCase().replace(' ', '.')}@email.com`,
      avatar: userData?.imageUrl || null,
      workField: workField,
      customWorkField: null,
      yearsOfExperience: yearsExp,
      preferredLanguage: "Español",
      registeredAt: new Date()
    };

    const metrics: CandidateMetrics = {
      totalInterviews: totalInterviews,
      completedInterviews: Math.floor(totalInterviews * 0.8),
      inProgressInterviews: Math.floor(totalInterviews * 0.1),
      abandonedInterviews: Math.floor(totalInterviews * 0.1),
      avgScore: avgScore,
      avgDuration: 600 + (userHash % 600)
    };

    const scoreHistory: ScoreHistoryItem[] = [
      { date: "2024-01", score: Math.max(60, avgScore - 10), interviewType: "Técnica", duration: 580 },
      { date: "2024-02", score: Math.max(60, avgScore - 5), interviewType: "Comportamental", duration: 620 },
      { date: "2024-03", score: Math.max(60, avgScore - 2), interviewType: "Técnica", duration: 590 },
      { date: "2024-04", score: avgScore, interviewType: "Mixta", duration: 610 },
      { date: "2024-05", score: Math.min(99, avgScore + 3), interviewType: "Técnica", duration: 630 },
      { date: "2024-06", score: Math.min(99, avgScore + 5), interviewType: "Final", duration: 650 }
    ];

    const latestEvaluation: LatestEvaluation = {
      strengths: "Comunicación efectiva, Resolución de problemas, Trabajo en equipo",
      weaknesses: "Gestión del tiempo, Documentación técnica"
    };

    return {
      user,
      metrics,
      scoreHistory,
      latestEvaluation
    };
  },

  // Método para actualizar perfil
  updateProfile: async (userId: string, data: Partial<CandidateProfile>): Promise<CandidateProfile> => {
    const currentProfile = candidateService.generateUserProfile(userId);
    return { ...currentProfile, ...data };
  }
};