'use client';

import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useInterviewTypes } from './hooks/useInterviewTypes';
import { InterviewTypeFilters } from './components/InterviewTypeFilters';
import { InterviewTypeList } from './components/InterviewTypeList';
import { Skeleton } from '@/components/ui/skeleton'; // Para el estado de carga
import type { ApiError } from '@/lib/api';

// Componente Ensamblador
export function ListInterviewTypes() {
  const router = useRouter();
  const {
    interviewTypes,
    isLoading,
    isError,
    error,
    activeFilter,
    handleFilterChange,
    handleToggleActive,
    isToggleLoading,
  } = useInterviewTypes();

  return (
    <div className="w-full space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Tipos de Entrevista</h1>
        <Button onClick={() => router.push('/dashboard/interview-types/create')}>
          Crear Nuevo Tipo
        </Button>
      </div>
      
      <InterviewTypeFilters 
        activeFilter={activeFilter} 
        onFilterChange={handleFilterChange} 
      />

      <div>
        {isLoading && (
          <div className="space-y-2 border rounded-lg p-4">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
          </div>
        )}
        {isError && (
          <p className="text-center text-red-500 py-8">
            Error al cargar los datos: {(error as ApiError).message}
          </p>
        )}
        {!isLoading && !isError && (
          <InterviewTypeList 
            interviewTypes={interviewTypes} 
            onToggleActive={handleToggleActive}
            isToggleLoading={isToggleLoading}
          />
        )}
      </div>
    </div>
  );
}
