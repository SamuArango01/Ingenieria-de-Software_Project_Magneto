import { 
  CandidateListResponse, 
  GetCandidatesParams, 
  SortByField,
  SortOrder 
} from '../types/candidates';

// Mock data
const mockCandidates = [
  {
    userId: "1",
    name: "Ana García",
    email: "ana.garcia@email.com",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150",
    workField: "Desarrollo Frontend",
    customWorkField: null,
    yearsOfExperience: 3,
    totalInterviews: 5,
    completedInterviews: 5,
    avgScore: 82,
    lastInterviewDate: new Date('2024-01-15')
  },
  {
    userId: "2", 
    name: "Carlos López",
    email: "carlos.lopez@email.com",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
    workField: "Data Science",
    customWorkField: null,
    yearsOfExperience: 2,
    totalInterviews: 3,
    completedInterviews: 3,
    avgScore: 75,
    lastInterviewDate: new Date('2024-01-10')
  },
  {
    userId: "3",
    name: "María Rodríguez",
    email: "maria.rodriguez@email.com",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150",
    workField: "UX/UI Design",
    customWorkField: null,
    yearsOfExperience: 4,
    totalInterviews: 7,
    completedInterviews: 6,
    avgScore: 88,
    lastInterviewDate: new Date('2024-01-18')
  },
  {
    userId: "4",
    name: "Pedro Martínez",
    email: "pedro.martinez@email.com",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
    workField: null,
    customWorkField: "DevOps Engineer",
    yearsOfExperience: 5,
    totalInterviews: 4,
    completedInterviews: 4,
    avgScore: 92,
    lastInterviewDate: new Date('2024-01-12')
  },
  {
    userId: "5",
    name: "Laura Fernández",
    email: "laura.fernandez@email.com",
    avatar: null,
    workField: "Desarrollo Backend",
    customWorkField: null,
    yearsOfExperience: 1,
    totalInterviews: 2,
    completedInterviews: 1,
    avgScore: 68,
    lastInterviewDate: null
  },
  {
    userId: "6",
    name: "Juan Ramírez",
    email: "juan.ramirez@email.com",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150",
    workField: "Mobile Development",
    customWorkField: null,
    yearsOfExperience: 6,
    totalInterviews: 8,
    completedInterviews: 7,
    avgScore: 85,
    lastInterviewDate: new Date('2024-01-20')
  },
  {
    userId: "7",
    name: "Sofía Torres",
    email: "sofia.torres@email.com",
    avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150",
    workField: "Full Stack",
    customWorkField: null,
    yearsOfExperience: 4,
    totalInterviews: 6,
    completedInterviews: 5,
    avgScore: 79,
    lastInterviewDate: new Date('2024-01-14')
  },
  {
    userId: "8",
    name: "Diego Morales",
    email: "diego.morales@email.com",
    avatar: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=150",
    workField: null,
    customWorkField: "Cloud Architect",
    yearsOfExperience: 7,
    totalInterviews: 5,
    completedInterviews: 5,
    avgScore: 94,
    lastInterviewDate: new Date('2024-01-16')
  }
];

export async function getCandidates(
  params: GetCandidatesParams = {}
): Promise<CandidateListResponse> {
  const {
    page = 1,
    limit = 20,
    sortBy = SortByField.AVG_SCORE,
    order = SortOrder.DESC
  } = params;

  // Simular delay de red
  await new Promise(resolve => setTimeout(resolve, 300));

  // Clonar datos para no mutar el original
  let filteredCandidates = [...mockCandidates];
  
  // Aplicar ordenamiento
  filteredCandidates.sort((a, b) => {
    let aValue: number | string;
    let bValue: number | string;

    switch (sortBy) {
      case SortByField.AVG_SCORE:
        aValue = a.avgScore ?? -Infinity;
        bValue = b.avgScore ?? -Infinity;
        break;
      case SortByField.NAME:
        aValue = a.name.toLowerCase();
        bValue = b.name.toLowerCase();
        break;
      case SortByField.LAST_INTERVIEW:
        aValue = a.lastInterviewDate?.getTime() ?? 0;
        bValue = b.lastInterviewDate?.getTime() ?? 0;
        break;
      default:
        aValue = 0;
        bValue = 0;
    }

    // Comparación
    if (order === SortOrder.ASC) {
      if (aValue > bValue) return 1;
      if (aValue < bValue) return -1;
      return 0;
    } else {
      if (aValue < bValue) return 1;
      if (aValue > bValue) return -1;
      return 0;
    }
  });

  // Aplicar paginación
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedCandidates = filteredCandidates.slice(startIndex, endIndex);

  return {
    data: paginatedCandidates,
    pagination: {
      total: mockCandidates.length,
      page,
      limit,
      totalPages: Math.ceil(mockCandidates.length / limit)
    }
  };
}