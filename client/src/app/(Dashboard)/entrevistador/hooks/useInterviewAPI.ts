// src/app/(Dashboard)/entrevistador/hooks/useInterviewAPI.ts
import { useUser } from "@clerk/nextjs";
import apiClient from '@/lib/api/client';

export interface StartStarInterviewResponse {
  success: boolean;
  data?: {
    initialMessage: string; 
    candidateName: string;
    timestamp: string;
  };
  error?: string;
}

export interface SendAudioResponse {
  success: boolean;
  text?: string;
  translate?: string;
  aiResponse?: string;
  candidateMetrics?: any;
  provider?: string;
  error?: string;
}

export interface GenerateSummaryResponse {
  success: boolean;
  summary?: string;
  data?: {
    summary: string;
  };
  error?: string;
}

export interface SendEmailResponse {
  success: boolean;
  message?: string;
  error?: string;
}

export interface EvaluateLevelResponse {
  success: boolean;
  canAdvance: boolean;
  recommendedLevel: string;
  score: number;
  feedback: string;
  error?: string;
}
export interface SaveFeedbackResponse {
  success: boolean;
  evaluationId?: number;
  error?: string;
}

export interface FeedbackData {
  interviewId?: number;
  areasToImprove: string[];
  strengths?: string[];
  aiFeedback: string;
  overallScore?: number;
  difficultyLevel: string;
}

export const useInterviewAPI = () => {
  const { user } = useUser();

  const getUserName = () => {
    return user?.fullName || 
           user?.firstName || 
           user?.username || 
           'Candidato';
  };

  const startStarInterview = async (
    interviewTypeId: string,
    difficultyLevel: string
  ): Promise<StartStarInterviewResponse> => {
    try {
      const candidateName = getUserName();
      const response = await apiClient.post("v1/interviews/start-star-interview", {
        candidateName,
        interviewTypeId: interviewTypeId ? parseInt(interviewTypeId) : undefined,
        difficultyLevel
      });

      
      return {
        success: true,
        data: response.data.data 
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Error de conexión al iniciar la entrevista'
      };
    }
  };

  const sendAudio = async (
    audioBlob: Blob, 
    interviewTypeId: string | null,
    difficultyLevel: string
  ): Promise<SendAudioResponse> => {
    try {
      const formData = new FormData();
      formData.append("audio", audioBlob, "recording.webm");
      formData.append("difficultyLevel", difficultyLevel);

      let url = "v1/interviews/audio";
      
      if (interviewTypeId && interviewTypeId !== 'generic') {
        formData.append("interviewTypeId", interviewTypeId);
      }

      const startTime = Date.now();
      const response = await apiClient.post(url, formData, {
        headers: { 
          "Content-Type": "multipart/form-data",
        },
        timeout: 60000
      });
      const endTime = Date.now();

      console.log("Respuesta recibida:", {
        status: response.status,
        tiempo: endTime - startTime + "ms",
        datos: response.data
      });

      return {
        success: true,
        text: response.data.text,
        translate: response.data.translate,
        aiResponse: response.data.aiResponse,
        candidateMetrics: response.data.candidateMetrics,
        provider: response.data.provider
      };

    } catch (error: any) {
      console.error(' Error:', {
        message: error.message,
        responseStatus: error.response?.status,
        responseData: error.response?.data
      });
      
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Error de conexión al procesar audio'
      };
    }
  };

  const generateSummary = async (
    interviewHistory: any[], 
    candidateMetricsHistory: any[],
    difficultyLevel: string
  ): Promise<GenerateSummaryResponse> => {
    try {
      console.log("Enviando para análisis completo:", {
        interviewHistoryLength: interviewHistory.length,
        candidateMetricsHistoryLength: candidateMetricsHistory?.length || 0,
        difficultyLevel
      });

      const response = await apiClient.post("v1/interviews/summary", {
        interviewHistory,
        candidateMetricsHistory,
        difficultyLevel
      });

      return {
        success: true,
        summary: response.data.summary,
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Error de conexión al generar resumen'
      };
    }
  };

  const sendEmail = async (
    candidateEmail: string, 
    candidateName: string, 
    interviewHistory: any[], 
    summary: string,
    difficultyLevel: string
  ): Promise<SendEmailResponse> => {
    try {

      const response = await apiClient.post("v1/interviews/email", {
        candidateEmail,
        candidateName,
        interviewHistory,
        summary,
        difficultyLevel
      });

      return {
        success: true,
        message: response.data.message
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Error de conexión al enviar email'
      };
    }
  };

  const evaluateLevelAdvancement = async (
    interviewHistory: any[], 
    candidateMetricsHistory: any[],
    currentLevel: string
  ): Promise<EvaluateLevelResponse> => {
    try {

      const response = await apiClient.post("v1/interviews/evaluate-level", {
        interviewHistory,
        candidateMetricsHistory,
        currentLevel
      });

      return {
        success: true,
        canAdvance: response.data.canAdvance,
        recommendedLevel: response.data.recommendedLevel,
        score: response.data.score,
        feedback: response.data.feedback
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Error de conexión al evaluar nivel',
        canAdvance: false,
        recommendedLevel: currentLevel,
        score: 0,
        feedback: 'Error evaluando el nivel'
      };
    }
  };
  
  const saveFeedback = async (feedbackData: FeedbackData): Promise<SaveFeedbackResponse> => {
    try {
  
      const response = await apiClient.post("v1/interview-evaluations", {
        interviewId: feedbackData.interviewId,
        areasToImprove: feedbackData.areasToImprove,
        strengths: feedbackData.strengths || [],
        aiFeedback: feedbackData.aiFeedback,
        overallScore: feedbackData.overallScore,
        difficultyLevel: feedbackData.difficultyLevel
      });


      
      return {
        success: true,
        evaluationId: response.data.evaluationId
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Error de conexión al guardar feedback'
      };
    }
  };

  return {
    startStarInterview,
    sendAudio,
    generateSummary,
    sendEmail,
    saveFeedback, 
    evaluateLevelAdvancement,
    userEmail: user?.primaryEmailAddress?.emailAddress,
    userName: getUserName()
  };
};