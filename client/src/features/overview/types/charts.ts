import { InterviewsByMonth } from './overview';

export interface ChartsSectionProps {
  readonly interviewData: readonly InterviewsByMonth[];
  readonly isLoading?: boolean;
}

export type InterviewData = InterviewsByMonth;
export type ChartData = InterviewsByMonth;

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