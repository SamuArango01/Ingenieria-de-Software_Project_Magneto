'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  getAvailableInterviewTypes, 
  getUserInterviewTypes, 
  toggleInterviewTypeActive 
} from '../../services/interview-type.service';
import type { FilterType } from './components/InterviewTypeFilters';

export function useInterviewTypes() {
  const [filter, setFilter] = useState<FilterType>('all');
  const queryClient = useQueryClient();

  const queryKey = ['interviewTypes', filter];

  const { data, isLoading, isError, error } = useQuery({
    queryKey: queryKey,
    queryFn: () => {
      if (filter === 'user') {
        return getUserInterviewTypes();
      }
      // Por ahora, 'all' y 'public' usan el mismo endpoint. 
      // El filtrado real de 'public' se haría en el frontend si es necesario,
      // o con un nuevo endpoint en el backend.
      return getAvailableInterviewTypes();
    },
  });

  const toggleActiveMutation = useMutation({
    mutationFn: toggleInterviewTypeActive,
    onSuccess: () => {
      // Invalida la query actual para que se vuelva a cargar con los datos frescos.
      queryClient.invalidateQueries({ queryKey: queryKey });
      console.log('Estado del tipo de entrevista actualizado');
    },
    onError: (error) => {
      console.error('Error al actualizar el estado:', error.message);
    },
  });

  const handleToggleActive = (id: number) => {
    toggleActiveMutation.mutate(id);
  };

  return {
    interviewTypes: data ?? [],
    isLoading,
    isError,
    error,
    activeFilter: filter,
    handleFilterChange: setFilter,
    handleToggleActive,
    isToggleLoading: toggleActiveMutation.isPending,
  };
}
