'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { createInterviewType } from '@/features/interview-types/services/interview-type.service';
import { createInterviewTypeSchema, type CreateInterviewTypeValues } from '../schema';

export function useCreateInterviewType() {
  const router = useRouter();

  const form = useForm<CreateInterviewTypeValues>({
    resolver: zodResolver(createInterviewTypeSchema),
    defaultValues: {
      name: '',
      description: '',
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: createInterviewType,
    onSuccess: () => {
      console.log('Tipo de entrevista creado con éxito');
      router.push('/interview-types/list');
    },
    onError: (error) => {
      console.error('Error al crear el tipo de entrevista:', error.message);
    },
  });

  function onSubmit(values: CreateInterviewTypeValues) {
    mutate(values);
  }

  // El hook devuelve todo lo que la UI necesita para renderizarse y funcionar.
  return {
    form,
    onSubmit,
    isPending,
  };
}
