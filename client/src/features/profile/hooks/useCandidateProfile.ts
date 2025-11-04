import { useUser } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";
import { candidateService } from "../services/candidateService";
import { CandidateProfile } from "../types/candidate";

export const useCandidateProfile = (candidateId?: string) => {
  const { user, isLoaded } = useUser();

  return useQuery({
    queryKey: ["candidateProfile", candidateId || user?.id],
    queryFn: async (): Promise<CandidateProfile> => {
      if (candidateId) {
        // Si se proporciona un candidateId, obtener ese perfil específico
        return candidateService.getCandidateProfile(candidateId);
      }
      
      if (!user?.id) throw new Error("No autenticado");
      // Obtener perfil del usuario autenticado
      return candidateService.getMyProfile(user.id);
    },
    enabled: isLoaded && (!!candidateId || !!user?.id),
    retry: 2, // Reintentar 2 veces antes de mostrar error
    retryDelay: 1000, 
    staleTime: 5 * 60 * 1000, 
  });
};