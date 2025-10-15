'use client';

import { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { InterviewInitCard } from './components/InterviewInitCard';
import { useInterviewTypes } from './hooks/useInterviewTypes';
import { useStartInterview } from './hooks/useStartInterview';

export function InterviewInit() {
  const router = useRouter();
  const { user } = useUser();
  const [selectedTypeId, setSelectedTypeId] = useState<number | null>(null);

  const { interviewTypes, isLoading: isLoadingTypes } = useInterviewTypes();
  const { startInterview, isLoading: isStarting, isSuccess, data } = useStartInterview();

  const userName = user?.fullName || 'Candidato';

  const handleStartInterview = () => {
    startInterview({
      candidateName: userName,
      interviewTypeId: selectedTypeId ?? undefined,
    });
  };

  // Redirigir a la sesión cuando se crea exitosamente
  if (isSuccess && data) {
    router.push(`/entrevistador/session`);
  }

  return (
    <div className="min-h-screen pt-4 pb-12 px-6 lg:px-8">
      <InterviewInitCard
        userName={userName}
        interviewTypes={interviewTypes}
        selectedTypeId={selectedTypeId}
        onTypeSelect={setSelectedTypeId}
        onStartInterview={handleStartInterview}
        isLoadingTypes={isLoadingTypes}
        isStarting={isStarting}
      />
    </div>
  );
}
