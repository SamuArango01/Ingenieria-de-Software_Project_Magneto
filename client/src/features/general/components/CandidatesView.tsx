"use client";

import { useState, useMemo } from "react";
import { SearchInput } from "./SearchInput";
import { CandidatesTable } from "./CandidatesTable";
import { FiltersSection } from "./FiltersSection";
import { Filters, SortByField, SortOrder } from "../types/candidates";
import { useCandidatesWithClientFilters } from "../hooks/useCandidates";
import { Users, Search, Filter, User, Loader2 } from "lucide-react";

export function CandidatesView() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<Filters>({
    workField: "Todos",
    minExperience: 0,
    minScore: 0,
    minInterviews: 0
  });
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  

  const [backendParams] = useState({
    page: 1,
    limit: 100, 
    sortBy: SortByField.AVG_SCORE,
    order: SortOrder.DESC
  });

  // Usar el hook con React Query
  const { 
    candidates: filteredCandidates, 
    pagination,
    isLoading, 
    isFetching,
    isError,
    error
  } = useCandidatesWithClientFilters(
    backendParams,
    {
      searchTerm,
      workField: filters.workField,
      minExperience: filters.minExperience,
      minScore: filters.minScore,
      minInterviews: filters.minInterviews
    }
  );

  const clearFilters = () => {
    setFilters({
      workField: "Todos",
      minExperience: 0,
      minScore: 0,
      minInterviews: 0
    });
    setSearchTerm("");
    setIsFiltersOpen(false);
  };

  const activeFilters = [
    filters.workField !== "Todos",
    filters.minExperience > 0,
    filters.minScore > 0,
    filters.minInterviews > 0,
    searchTerm.length > 0
  ].filter(Boolean).length;

  
  const workFields = useMemo(() => {
    const fields = new Set<string>();
    
  
    if (pagination.total > 0 && filteredCandidates.length > 0) {
      for (const candidate of filteredCandidates) {
        if (candidate.workField) fields.add(candidate.workField);
        if (candidate.customWorkField) fields.add(candidate.customWorkField);
      }
    }
    
    return ["Todos", ...Array.from(fields)].sort((a, b) => a.localeCompare(b));
  }, [filteredCandidates, pagination.total]);


  if (isError) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/20 flex items-center justify-center">
            <Search className="w-8 h-8 text-red-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Error al cargar candidatos</h2>
          <p className="text-gray-400 mb-4">{error || 'Ha ocurrido un error inesperado'}</p>
          <button
            onClick={() => {
              if (typeof globalThis !== 'undefined') {
                globalThis.location.reload();
              }
            }}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 py-4 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto space-y-6">
     
        <div className="space-y-4 p-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                <Users className="w-10 h-10 text-blue-400" />
              </div>
              <div className="flex-1">
                <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
                  Candidatos
                </h1>
                <p className="text-gray-400 text-base">
                  Gestiona el talento de tu equipo
                </p>
              </div>
            </div>
            
            {/* Stats Card */}
            <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-lg p-4 border border-blue-500/20 w-full sm:w-auto text-center sm:min-w-32">
              <div className="flex items-center justify-center gap-2 mb-1">
                <User className="w-5 h-5 text-blue-400" />
                <div className="text-2xl sm:text-3xl font-bold text-white">
                  {isLoading ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : (
                    filteredCandidates.length
                  )}
                </div>
              </div>
              <div className="text-sm text-blue-300 font-medium">
                {filteredCandidates.length === 1 ? 'CANDIDATO' : 'CANDIDATOS'}
              </div>
            </div>
          </div>
        </div>

    
        <div className="bg-gray-800/50 rounded-lg p-5 border border-gray-700/50 backdrop-blur-sm">
          <div className="flex flex-col lg:flex-row items-start lg:items-end gap-5">
            <div className="flex-1 w-full">
              <div className="flex items-center gap-3 mb-3">
                <Search className="w-6 h-6 text-blue-400" />
                <span className="text-white font-medium text-lg">Buscar candidatos</span>
              </div>
              <SearchInput
                value={searchTerm}
                onChange={setSearchTerm}
                placeholder="Nombre, email..."
              />
            </div>

            <div className="flex-shrink-0 w-full lg:w-auto">
              <div className="flex items-center gap-3 mb-3">
                <Filter className="w-6 h-6 text-blue-400" />
                <span className="text-white font-medium text-lg">Filtrar</span>
              </div>
              <FiltersSection
                filters={filters}
                onFiltersChange={setFilters}
                onClearFilters={clearFilters}
                isOpen={isFiltersOpen}
                onToggle={() => setIsFiltersOpen(!isFiltersOpen)}
                onClose={() => setIsFiltersOpen(false)}
                workFields={workFields}
              />
            </div>
          </div>

          {activeFilters > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-700/30">
              <div className="flex flex-wrap items-center gap-2 text-base text-gray-400">
                <Filter className="w-4 h-4" />
                <span>Filtros activos:</span>
                {searchTerm && (
                  <span className="bg-purple-500/20 text-purple-300 px-3 py-1.5 rounded-md text-sm">
                    Búsqueda: "{searchTerm}"
                  </span>
                )}
                {filters.workField !== "Todos" && (
                  <span className="bg-blue-500/20 text-blue-300 px-3 py-1.5 rounded-md text-sm">
                    {filters.workField}
                  </span>
                )}
                {filters.minExperience > 0 && (
                  <span className="bg-green-500/20 text-green-300 px-3 py-1.5 rounded-md text-sm">
                    Exp: {filters.minExperience}+ años
                  </span>
                )}
                {filters.minScore > 0 && (
                  <span className="bg-purple-500/20 text-purple-300 px-3 py-1.5 rounded-md text-sm">
                    Score: {filters.minScore}%+
                  </span>
                )}
                {filters.minInterviews > 0 && (
                  <span className="bg-yellow-500/20 text-yellow-300 px-3 py-1.5 rounded-md text-sm">
                    Entrevistas: {filters.minInterviews}+
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="bg-gray-800/50 rounded-lg border border-gray-700/50 p-12 text-center">
            <Loader2 className="w-12 h-12 mx-auto mb-4 text-blue-400 animate-spin" />
            <p className="text-gray-400">Cargando candidatos...</p>
          </div>
        )}

     
        {!isLoading && (
          <div className="bg-gray-800/50 rounded-lg border border-gray-700/50 overflow-hidden backdrop-blur-sm">
            {filteredCandidates.length > 0 ? (
              <div className="relative">
                {isFetching && (
                  <div className="absolute top-2 right-2 z-10">
                    <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />
                  </div>
                )}
                <div className="overflow-x-auto">
                  <CandidatesTable candidates={filteredCandidates} />
                </div>
              </div>
            ) : (
              <div className="text-center py-20 px-6">
                <div className="max-w-md mx-auto">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-700/30 flex items-center justify-center border border-gray-600/30">
                    <Search className="w-10 h-10 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">
                    No hay resultados
                  </h3>
                  <p className="text-gray-400 text-base mb-6">
                    {searchTerm || activeFilters > 0 
                     ? "Prueba ajustando la búsqueda o los filtros"
                     : "No hay candidatos en el sistema"}
                  </p>
                  {(searchTerm || activeFilters > 0) && (
                    <button
                      onClick={clearFilters}
                      className="px-8 py-3 bg-blue-600/80 hover:bg-blue-600 text-white rounded-lg transition-all duration-200 text-base font-medium"
                    >
                      Limpiar búsqueda
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

      
        {!isLoading && filteredCandidates.length > 0 && (
          <div className="flex flex-col sm:flex-row justify-between items-center gap-2 text-base text-gray-400 px-2">
            <div className="text-center sm:text-left">
              Mostrando <span className="text-white font-medium">{filteredCandidates.length}</span> de {pagination.total} candidatos
            </div>
            {searchTerm && (
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4" />
                <span>"{searchTerm}"</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}