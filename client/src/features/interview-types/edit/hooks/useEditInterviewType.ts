'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import { getInterviewTypeById, updateInterviewType } from '../../services/interview-type.service';
import { createInterviewTypeSchema, type CreateInterviewTypeValues } from '../../create/schema'; // Reutilizamos el schema de creación

export function useEditInterviewType(id: number) {
  const router = useRouter();
  const queryClient = useQueryClient();

  // 1. Obtener los datos actuales para pre-rellenar el formulario
  const { data: currentData, isLoading: isFetchLoading, isError } = useQuery({
    queryKey: ['interviewType', id], // Clave única para este item
    queryFn: () => getInterviewTypeById(id),
    enabled: !!id, // Solo ejecutar la query si el ID es válido
  });

  const form = useForm<CreateInterviewTypeValues>({
    resolver: zodResolver(createInterviewTypeSchema),
    defaultValues: {
      name: '',
      description: '',
    },
  });

  // 2. Usar useEffect para rellenar el formulario cuando los datos llegan
  useEffect(() => {
    if (currentData) {
      form.reset({
        name: currentData.name,
        description: currentData.description,
      });
    }
  }, [currentData, form]);

  // 3. Configurar la mutación para la actualización
  const { mutate, isPending: isUpdateLoading } = useMutation({
    mutationFn: (values: CreateInterviewTypeValues) => updateInterviewType(id, values),
    onSuccess: () => {
      console.log('Tipo de entrevista actualizado con éxito');
      // Invalidar las queries para que los datos se refresquen en toda la app
      queryClient.invalidateQueries({ queryKey: ['interviewTypes'] });
      queryClient.invalidateQueries({ queryKey: ['interviewType', id] });
      router.push('/dashboard/interview-types/list');
    },
    onError: (error) => {
      console.error('Error al actualizar el tipo de entrevista:', error.message);
    },
  });

  function onSubmit(values: CreateInterviewTypeValues) {
    mutate(values);
  }

  return {
    form,
    onSubmit,
    isUpdateLoading,
    isFetchLoading,
    isError,
  };
}
