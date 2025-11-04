import { useCandidateProfile } from "./useCandidateProfile";

export function useProfileData(candidateId?: string) {
  const { 
    data: profile, 
    isLoading, 
    isError, 
    error, 
    refetch,
    isRefetching 
  } = useCandidateProfile(candidateId);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const getPerformanceLevel = (score: number) => {
    if (score >= 90) return { level: "Excelente", color: "text-green-400" };
    if (score >= 80) return { level: "Bueno", color: "text-blue-400" };
    if (score >= 70) return { level: "Regular", color: "text-yellow-400" };
    return { level: "Necesita mejorar", color: "text-orange-400" };
  };

  return {
    profile,
    isLoading,
    isError,
    error,
    refetch,
    isRefetching,
    formatDuration,
    getPerformanceLevel
  };
}