export interface InterviewData {
  readonly month: string;
  readonly interviews: number;
}

export interface ChartsSectionProps {
  readonly interviewData: readonly InterviewData[];
}

export interface ChartData {
  readonly month: string;
  readonly interviews: number;
}

// Interface para los stats
export interface StatItem {
  readonly id: string;
  readonly title: string;
  readonly value: string | number;
  readonly trend: string;
  readonly icon: React.ComponentType<any>;
  readonly iconColor: string;
  readonly bgColor: string;
  readonly trendColor: string;
}