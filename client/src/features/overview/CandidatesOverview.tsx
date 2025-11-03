"use client";

import { useState } from "react";
import { useCandidates } from "./hooks/useCandidates";
import { HeaderSection } from "./components/HeaderSection";
import { StatsCards } from "./components/StatsCards";
import { ChartsSection } from "./components/ChartsSection";
import { CandidatesList } from "./components/CandidatesList";

const interviewData = [
  { month: 'Ene', interviews: 12 },
  { month: 'Feb', interviews: 19 },
  { month: 'Mar', interviews: 8 },
  { month: 'Abr', interviews: 15 },
  { month: 'May', interviews: 22 },
  { month: 'Jun', interviews: 18 },
];

export function CandidatesOverview() {
  const { candidates, isLoading, isError, error } = useCandidates();
  const [search, setSearch] = useState("");

  const filteredCandidates = candidates.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.workField.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <HeaderSection search={search} onSearchChange={setSearch} />
        <StatsCards candidates={candidates} isLoading={isLoading} />
        <ChartsSection interviewData={interviewData} />
        <CandidatesList
          candidates={candidates}
          filteredCandidates={filteredCandidates}
          isLoading={isLoading}
          isError={isError}
          search={search}
        />
      </div>
    </div>
  );
}