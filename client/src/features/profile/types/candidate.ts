export interface InterviewHistory {
  readonly date: string;
  readonly score: number;
}

export interface CandidateProfile {
  readonly name: string;
  readonly workField: string;
  readonly yearsExperience: number;
  readonly totalInterviews: number;
  readonly averageScore: number;
  readonly averageDuration: number;
  readonly avatar?: string;
  readonly interviewHistory: InterviewHistory[];
  readonly strengths: string[];
  readonly weaknesses: string[];
}