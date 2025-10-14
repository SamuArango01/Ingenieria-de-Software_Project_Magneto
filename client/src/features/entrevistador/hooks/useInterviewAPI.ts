// src/features/entrevistador/hooks/useInterviewAPI.ts
import { useUser } from "@clerk/nextjs";
import { useMutation } from "@tanstack/react-query";
import * as interviewService from "@/features/entrevistador/services/interviewService";

export const useInterviewAPI = () => {
  const { user } = useUser();

  const getUserName = () => {
    return user?.fullName || user?.firstName || user?.username || "Candidato";
  };

  const useStartStarInterview = () => {
    return useMutation({
      mutationFn: interviewService.startStarInterview,
    });
  };

  const useSendAudio = () => {
    return useMutation({
      mutationFn: interviewService.sendAudio,
    });
  };

  const useGenerateAndSaveEvaluation = () => {
    return useMutation({
      mutationFn: interviewService.generateAndSaveEvaluation,
    });
  };

  const useSendEmail = () => {
    return useMutation({
      mutationFn: interviewService.sendEmail,
    });
  };

  const useEvaluateLevelAdvancement = () => {
    return useMutation({
      mutationFn: interviewService.evaluateLevelAdvancement,
    });
  };

  return {
    useStartStarInterview,
    useSendAudio,
    useGenerateAndSaveEvaluation,
    useSendEmail,
    useEvaluateLevelAdvancement,
    userEmail: user?.primaryEmailAddress?.emailAddress,
    userName: getUserName(),
  };
};