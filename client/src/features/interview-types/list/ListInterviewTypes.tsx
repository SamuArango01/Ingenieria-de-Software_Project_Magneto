'use client';

import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useInterviewTypes } from './hooks/useInterviewTypes';
import { InterviewTypeFilters } from './components/InterviewTypeFilters';
import { InterviewTypeList } from './components/InterviewTypeList';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@clerk/nextjs';
import type { ApiError } from '@/lib/api';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

// Componente específico para el esqueleto de la tabla
function TableSkeleton() {
  return (
    <div className="border rounded-lg p-4 space-y-2">
      <Skeleton className="h-8 w-full" />
      <Skeleton className="h-8 w-full" />
      <Skeleton className="h-8 w-full" />
      <Skeleton className="h-8 w-full" />
    </div>
  );
}

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
  const { userId } = useAuth();

  return (
    <Card className="w-full bg-gray-800">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-white">Tipos de Entrevista</CardTitle>
            <CardDescription className="text-gray-300">Gestiona los tipos de entrevista disponibles.</CardDescription>
          </div>
          <Button className="bg-green-600 text-white hover:bg-green-700" onClick={() => router.push('/interview-types/create')}>
            Crear Nuevo Tipo
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <InterviewTypeFilters 
          activeFilter={activeFilter} 
          onFilterChange={handleFilterChange} 
        />
        <div>
          {isLoading && <TableSkeleton />}
          {isError && (
            <div className="text-center py-8">
              <p className="text-red-500">Error al cargar los datos: {(error as ApiError).message}</p>
            </div>
          )}
          {!isLoading && !isError && (
            <InterviewTypeList 
              interviewTypes={interviewTypes} 
              onToggleActive={handleToggleActive}
              isToggleLoading={isToggleLoading}
              currentUserId={userId}
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
}
