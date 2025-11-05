import { CandidateListItem, CandidateListResponse, GetCandidatesParams, SortByField } from '../types/candidates';

export async function getCandidates(params: GetCandidatesParams = {}): Promise<CandidateListResponse> {
  const {
    page = 1,
    limit = 20,
    sortBy = SortByField.AVG_SCORE,
    order = 'DESC'
  } = params;

  // Datos mock 
  const mockCandidates: CandidateListItem[] = [
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
    }
  ];

  // Simular paginación y ordenamiento
  let filteredCandidates = [...mockCandidates];
  
  // Aplicar ordenamiento
  filteredCandidates.sort((a, b) => {
    let aValue: any;
    let bValue: any;

    // Mapear SortByField a las propiedades reales de CandidateListItem
    switch (sortBy) {
      case SortByField.AVG_SCORE:
        aValue = a.avgScore;
        bValue = b.avgScore;
        break;
      case SortByField.NAME:
        aValue = a.name.toLowerCase();
        bValue = b.name.toLowerCase();
        break;
      case SortByField.LAST_INTERVIEW:
        aValue = a.lastInterviewDate?.getTime() || 0;
        bValue = b.lastInterviewDate?.getTime() || 0;
        break;
      
    }

    // Manejar valores nulos/undefined de forma segura
    const handleNullValue = (value: any, sortOrder: string) => {
      if (value === null || value === undefined) {
        return sortOrder === 'ASC' ? Infinity : -Infinity;
      }
      return value;
    };

    aValue = handleNullValue(aValue, order);
    bValue = handleNullValue(bValue, order);

    
    if (order === 'ASC') {
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

  const response: CandidateListResponse = {
    data: paginatedCandidates,
    pagination: {
      total: mockCandidates.length,
      page,
      limit,
      totalPages: Math.ceil(mockCandidates.length / limit)
    }
  };

  // Simular delay de API
  return new Promise(resolve => {
    setTimeout(() => resolve(response), 500);
  });
}