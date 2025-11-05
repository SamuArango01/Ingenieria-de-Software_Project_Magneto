export async function getCandidates() {
  // Datos mock - reemplazar con  API
  const mockCandidates = [
    {
      id: "1",
      name: "Ana García",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150",
      workField: "Desarrollo Frontend",
      yearsExperience: 3,
      interviews: 5,
      averageScore: 82
    },
    {
      id: "2", 
      name: "Carlos López",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
      workField: "Data Science",
      yearsExperience: 2,
      interviews: 3,
      averageScore: 75
    },
    // ... más candidatos
  ];

  
  return mockCandidates;
}