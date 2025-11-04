import { CandidateProfile } from "../types/candidate";

// Servicio para obtener el perfil del candidato
export const candidateService = {
  // Método para obtener el perfil del usuario autenticado
  getMyProfile: async (userId: string, userData?: any): Promise<CandidateProfile> => {
    return candidateService.generateUserProfile(userId, userData);
  },

  // Método para obtener perfil de cualquier candidato (para RRHH)
  getCandidateProfile: async (candidateId: string): Promise<CandidateProfile> => {
    return candidateService.generateUserProfile(candidateId);
  },

  // Generar perfil único basado en ID 
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

    //mock
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

    return {
      name: userName,
      workField: workField,
      yearsExperience: yearsExp,
      totalInterviews: totalInterviews,
      averageScore: avgScore,
      averageDuration: 600 + (userHash % 600),
      avatar: userData?.imageUrl,
      interviewHistory: [
        { date: "2024-01", score: Math.max(60, avgScore - 10) },
        { date: "2024-02", score: Math.max(60, avgScore - 5) },
        { date: "2024-03", score: Math.max(60, avgScore - 2) },
        { date: "2024-04", score: avgScore },
        { date: "2024-05", score: Math.min(99, avgScore + 3) },
        { date: "2024-06", score: Math.min(99, avgScore + 5) }
      ],
      strengths: [
        "Comunicación efectiva",
        "Resolución de problemas", 
        "Trabajo en equipo",
        "Aprendizaje rápido"
      ],
      weaknesses: [
        "Gestión del tiempo",
        "Documentación técnica"
      ]
    };
  },

  // Método para actualizar perfil
  updateProfile: async (userId: string, data: Partial<CandidateProfile>): Promise<CandidateProfile> => {
    const currentProfile = candidateService.generateUserProfile(userId);
    return { ...currentProfile, ...data };
  }
};