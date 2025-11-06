"use client";

import { useCandidates } from "./hooks/useCandidates";
import { useOverviewStats } from "./hooks/useOverviewStats";
import { HeaderSection } from "./components/HeaderSection";
import { StatsCards } from "./components/StatsCards";
import { ChartsSection } from "./components/ChartsSection";

export function CandidatesOverview() {
  const { candidates, isLoading: candidatesLoading } = useCandidates();
  const { interviewData, isLoading: statsLoading } = useOverviewStats();

  const isLoading = candidatesLoading || statsLoading;

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