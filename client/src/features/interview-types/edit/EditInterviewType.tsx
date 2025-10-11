'use client';

import { useEditInterviewType } from './hooks/useEditInterviewType';
// ¡Reutilizamos el componente del formulario de creación!
import { CreateInterviewTypeForm } from '@/features/interview-types/create/components/CreateInterviewTypeForm';
import { Skeleton } from '@/components/ui/skeleton';

interface EditInterviewTypeProps {
  id: number;
}

export function EditInterviewType({ id }: EditInterviewTypeProps) {
  const { form, onSubmit, isUpdateLoading, isFetchLoading, isError } = useEditInterviewType(id);

  if (isFetchLoading) {
    return (
      <div className="w-full max-w-2xl space-y-4">
        <Skeleton className="h-10 w-1/2" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-10 w-32" />
      </div>
    );
  }

  if (isError) {
    return <p className="text-red-500">Error al cargar los datos del tipo de entrevista.</p>;
  }

  return (
    <CreateInterviewTypeForm 
      form={form} 
      onSubmit={onSubmit} 
      isLoading={isUpdateLoading} 
    />
  );
}
