import { OverviewResponse } from '../types/overview';

//Coincide con interfaz OverviewResponse
const mockOverviewData: OverviewResponse = {
  totalCandidates: 45,
  totalInterviews: 128,
  completedInterviews: 112,
  completionRate: 87.5,
  avgGlobalScore: 4.2,
  interviewsByMonth: [
    { month: 'Ene', total: 12 },
    { month: 'Feb', total: 19 },
    { month: 'Mar', total: 8 },
    { month: 'Abr', total: 15 },
    { month: 'May', total: 22 },
    { month: 'Jun', total: 18 },
  ],
};

export const getOverview = async (): Promise<OverviewResponse> => {
  
  await new Promise(resolve => setTimeout(resolve, 800));


  return mockOverviewData;
};