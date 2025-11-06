"use client";

import { useOverview } from "./hooks/useOverview";
import { HeaderSection } from "./components/HeaderSection";
import { StatsCards } from "./components/StatsCards";
import { ChartsSection } from "./components/ChartsSection";

export function CandidatesOverview() {
  const { overview, isLoading: overviewLoading } = useOverview();

  const isLoading = overviewLoading;

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <HeaderSection />
        <StatsCards
          overviewData={overview}
          isLoading={isLoading}
        />
        <ChartsSection
          overviewData={overview}

        />
      </div>
    </div>
  );
}
