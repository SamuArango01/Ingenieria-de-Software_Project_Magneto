"use client";

import { useCandidates } from "./hooks/useCandidates";
import { HeaderSection } from "./components/HeaderSection";
import { StatsCards } from "./components/StatsCards";
import { ChartsSection } from "./components/ChartsSection";

const interviewData = [
  { month: 'Ene', interviews: 12 },
  { month: 'Feb', interviews: 19 },
  { month: 'Mar', interviews: 8 },
  { month: 'Abr', interviews: 15 },
  { month: 'May', interviews: 22 },
  { month: 'Jun', interviews: 18 },
];

export function CandidatesOverview() {
  const { candidates, isLoading } = useCandidates();

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <HeaderSection />
        <StatsCards candidates={candidates} isLoading={isLoading} />
        <ChartsSection interviewData={interviewData} />
      </div>
    </div>
  );
}