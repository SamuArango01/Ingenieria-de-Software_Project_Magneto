export interface Candidate {
  id: string;
  name: string;
  avatar: string;
  workField: string;
  yearsExperience: number;
  interviews: number;
  averageScore: number;
}

export interface ChartData {
  month: string;
  interviews: number;
}