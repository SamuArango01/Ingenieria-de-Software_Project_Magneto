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
        return candidateService.getCandidateProfile(candidateId);
      }
      
      if (!user?.id) throw new Error("No autenticado");
      return candidateService.getMyProfile(user.id, user);
    },
    enabled: isLoaded && (!!candidateId || !!user?.id),
    retry: 2,
    retryDelay: 1000,
    staleTime: 5 * 60 * 1000,
  });
};