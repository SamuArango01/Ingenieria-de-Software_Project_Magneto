// src/app/(Dashboard)/entrevistador/types/interview.ts
export interface InterviewTurn {
  user: string;
  ai: string;
}

export interface InterviewState {
  isRecording: boolean;
  hasPermission: boolean | null;
  error: string;
  transcribedText: string;
  aiResponse: string;
  isProcessing: boolean;
  isGeneratingContentFeedback: boolean;
  isGeneratingVerbalFeedback: boolean;
  contentFeedback: string;
  verbalFeedback: string;
  interviewHistory: InterviewTurn[];
  isInterviewFinished: boolean;
  isSendingEmail: boolean;
  selectedInterviewTypeId: string | null;
  toneMetricsHistory: any[]; // Para métricas de voz
}

export interface DifficultyLevel {
  id: string;
  name: string;
  description: string;
  timePerQuestion: number; // en segundos
  totalQuestions: number;
  totalTime: number; // en segundos
  requiredScore?: number; // puntuación mínima para pasar al siguiente nivel
}

export const DIFFICULTY_LEVELS: DifficultyLevel[] = [
  {
    id: 'junior',
    name: 'Junior',
    description: 'Nivel básico - Preguntas fundamentales',
    timePerQuestion: 120, // 2 minutos
    totalQuestions: 5,
    totalTime: 1080, // 18 minutos
    requiredScore: 70
  },
  {
    id: 'mid',
    name: 'Mid-Level',
    description: 'Nivel intermedio - Preguntas técnicas',
    timePerQuestion: 180, // 3 minutos
    totalQuestions: 5,
    totalTime: 1320, // 22 minutos
    requiredScore: 75
  },
  {
    id: 'senior',
    name: 'Senior',
    description: 'Nivel avanzado - Preguntas complejas y de liderazgo',
    timePerQuestion: 240, // 4 minutos
    totalQuestions: 7,
    totalTime: 2100, // 35 minutos
    requiredScore: 80
  }
];

export interface CandidateMetrics {
  clarity: number;
  technicalAccuracy: number;
  relevance: number;
  confidence: number;
  communication: number;
  overallScore: number;
  recommendedLevel?: string;
  passedToNextLevel?: boolean;
}