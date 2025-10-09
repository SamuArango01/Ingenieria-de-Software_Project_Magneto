'use client';

import { useCreateInterviewType } from './hooks/useCreateInterviewType';
import { CreateInterviewTypeForm } from './components/CreateInterviewTypeForm';

// Este componente es el ensamblador. Une la lógica (hook) con la UI (form).
export function CreateInterviewType() {
  const { form, onSubmit, isPending } = useCreateInterviewType();

  return (
    <CreateInterviewTypeForm 
      form={form} 
      onSubmit={onSubmit} 
      isLoading={isPending} 
    />
  );
}
