export interface Candidate {
  readonly id: string;
  readonly name: string;
  readonly avatar: string;
  readonly workField: string;
  readonly yearsExperience: number;
  readonly interviews: number;
  readonly averageScore: number;
}

export interface Filters {
  readonly workField: string;
  readonly minExperience: number;
  readonly minScore: number;
  readonly minInterviews: number;
}
