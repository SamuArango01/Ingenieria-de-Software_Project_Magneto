// src/features/entrevistador/services/interviewService.ts
import apiClient from '@/lib/api/client';
import type {
  StartStarInterviewResponse,
  SendAudioResponse,
  GenerateSummaryResponse,
  SendEmailResponse,
  EvaluateLevelResponse
} from '../types/api.types';

export const startStarInterview = async (
  candidateName: string,
  interviewTypeId: string,
  difficultyLevel: string
): Promise<StartStarInterviewResponse> => {
  try {
    const response = await apiClient.post("v1/interviews/start-star-interview", {
      candidateName,
      interviewTypeId: interviewTypeId ? parseInt(interviewTypeId) : undefined,
      difficultyLevel
    });
    return {
      success: true,
      data: { ...response.data.data, interviewId: response.data.interviewId }
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || error.message || 'Error de conexión al iniciar la entrevista'
    };
  }
};

export const sendAudio = async (
  audioBlob: Blob, 
  interviewTypeId: string | null,
  difficultyLevel: string
): Promise<SendAudioResponse> => {
  try {
    const formData = new FormData();
    formData.append("audio", audioBlob, "recording.webm");
    formData.append("difficultyLevel", difficultyLevel);

    if (interviewTypeId && interviewTypeId !== 'generic') {
      formData.append("interviewTypeId", interviewTypeId);
    }

    const response = await apiClient.post("v1/interviews/audio", formData, {
      headers: { "Content-Type": "multipart/form-data" },
      timeout: 60000
    });

    return { success: true, ...response.data };
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || error.message || 'Error de conexión al procesar audio'
    };
  }
};

export const generateAndSaveEvaluation = async (
  interviewHistory: any[], 
  interviewId: number
): Promise<GenerateSummaryResponse> => {
  try {
    const response = await apiClient.post("/interview-evaluations", {
      interviewHistory,
      interviewId
    });
    return {
      success: true,
      summary: response.data.feedback,
      data: response.data
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || error.message || 'Error de conexión al generar la evaluación'
    };
  }
};

export const sendEmail = async (
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
    return { success: true, message: response.data.message };
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || error.message || 'Error de conexión al enviar email'
    };
  }
};

export const evaluateLevelAdvancement = async (
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
    return { success: true, ...response.data };
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
