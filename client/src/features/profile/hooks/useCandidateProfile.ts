import { useUser } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";
import { candidateService } from "../services/candidateService";
import { CandidateProfile } from "../types/candidate";

export const useCandidateProfile = (candidateId?: string) => {
  const { user, isLoaded } = useUser();

  return useQuery({
    queryKey: candidateId
      ? ["candidateProfile", "other", candidateId]
      : ["candidateProfile", "own", user?.id],
    queryFn: candidateId
      ? () => candidateService.getCandidateProfile(candidateId)
      : async (): Promise<CandidateProfile> => {
          if (!user?.id) throw new Error("No autenticado");
          return candidateService.getMyProfile(user.id);
        },
    enabled: isLoaded && (!!candidateId || !!user?.id),
    retry: 2,
    retryDelay: 1000,
    staleTime: 5 * 60 * 1000,
  });
};