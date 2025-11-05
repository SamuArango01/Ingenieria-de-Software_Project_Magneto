"use client";

import { useProfileData } from "./hooks/useProfileData";
import { ProfileHeader } from "./components/ProfileHeader";
import { StatsCards } from "./components/StatsCards";
import { ProgressChart } from "./components/ProgressChart";
import { StrengthsWeaknesses } from "./components/StrengthsWeaknesses";
import { LoadingState, ErrorState, RefetchingState } from "./states";

interface CandidateProfileProps {
  readonly candidateId?: string;
}

export function CandidateProfile({ candidateId }: CandidateProfileProps) {
  const {
    profile,
    isLoading,
    isError,
    error,
    refetch,
    isRefetching,
    formatDuration,
    getPerformanceLevel
  } = useProfileData(candidateId);

  // Estados de carga y error
  if (isLoading) return <LoadingState />;
  if (isError) return <ErrorState error={error!} onRetry={refetch} />;

  // Estados de recarga
  if (isRefetching && profile) {
    return (
      <RefetchingState 
        profile={profile} 
        performance={getPerformanceLevel(profile.averageScore)} 
        formatDuration={formatDuration} 
      />
    );
  }
  if (isRefetching) return <LoadingState />;

  // Estado sin perfil 
  if (!profile) return <LoadingState />;

  // Estado exitoso - mostrar perfil
  const performance = getPerformanceLevel(profile.averageScore);

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        <ProfileHeader profile={profile} performance={performance} />
        <StatsCards 
          profile={profile} 
          performance={performance}
          formatDuration={formatDuration}
        />
        <ProgressChart interviewHistory={profile.interviewHistory} />
        <StrengthsWeaknesses 
          strengths={profile.strengths} 
          weaknesses={profile.weaknesses} 
        />
      </div>
    </div>
  );

}





