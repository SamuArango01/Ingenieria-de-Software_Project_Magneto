export interface StartStarInterviewResponse {
  success: boolean;
  data?: {
    initialMessage: string; 
    candidateName: string;
    timestamp: string;
    interviewId: number;
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
  data?: any; // Puede ser la entidad InterviewEvaluation completa
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

// Estas interfaces ya no se usan directamente pero se mantienen por si acaso
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
