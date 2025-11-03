
// La lista de candidatos ira en otra page

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CandidatesTable } from "./CandidatesTable";
import { LoadingTable } from "../ui/LoadingTable";
import { ErrorState } from "../ui/ErrorState";
import { EmptyState } from "../ui/EmptyState";
import { Candidate } from "../types/candidate";

interface CandidatesListProps {
  candidates: Candidate[];
  filteredCandidates: Candidate[];
  isLoading: boolean;
  isError: boolean;
  search: string;
}

export function CandidatesList({ 
  candidates, 
  filteredCandidates, 
  isLoading, 
  isError, 
  search 
}: CandidatesListProps) {
  return (
    <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700 shadow-2xl rounded-2xl overflow-hidden">
      <CardHeader className="pb-4 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl font-bold text-white flex items-center gap-3">
            <div className="w-2 h-8 bg-blue-500 rounded-full"></div>
            Lista de Candidatos
          </CardTitle>
          <div className="text-sm text-gray-400">
            Mostrando <span className="text-white font-semibold">{filteredCandidates.length}</span> de{" "}
            <span className="text-white font-semibold">{candidates.length}</span> candidatos
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {isLoading ? (
          <div className="p-8">
            <LoadingTable />
          </div>
        ) : isError ? (
          <div className="p-12">
            <ErrorState />
          </div>
        ) : filteredCandidates.length === 0 ? (
          <div className="p-12">
            <EmptyState search={search} />
          </div>
        ) : (
          <div className="rounded-b-2xl overflow-hidden">
            <CandidatesTable candidates={filteredCandidates} />
          </div>
        )}
      </CardContent>
    </Card>
  );
}