// src/app/(Dashboard)/entrevistador/hooks/useInterview.ts
import { useState, useCallback } from 'react';

// Definir los niveles de dificultad como constante
export const DIFFICULTY_LEVELS = {
  junior: {
    timePerQuestion: 120, // 2 minutos
    totalQuestions: 5,
    totalTime: 1080, // 18 minutos
    name: 'Junior',
    description: 'Nivel básico - Preguntas fundamentales',
    requiredScore: 70 //Puntaje requerido para avanzar
  },
  mid: {
    timePerQuestion: 180, // 3 minutos
    totalQuestions: 5,
    totalTime: 1320, // 22 minutos
    name: 'Mid-Level',
    description: 'Nivel intermedio - Preguntas técnicas',
    requiredScore: 75 // Puntaje requerido para avanzar
  },
  senior: {
    timePerQuestion: 240, // 4 minutos
    totalQuestions: 7,
    totalTime: 2100, // 35 minutos
    name: 'Senior',
    description: 'Nivel avanzado - Preguntas complejas y de liderazgo',
    requiredScore: 80 // Puntaje requerido para avanzar
  }
} as const;


export type DifficultyLevel = keyof typeof DIFFICULTY_LEVELS;

interface InterviewState {
  isRecording: boolean;
  error: string;
  transcribedText: string;
  aiResponse: string;
  isProcessing: boolean;
  isGeneratingFeedback: boolean;
  summary: string;
  interviewHistory: Array<{ user: string; ai: string }>;
  isInterviewFinished: boolean;
  isSendingEmail: boolean;
  selectedInterviewTypeId: string;
  candidateMetricsHistory: any[];
  isInterviewStarted: boolean;
  initialGreeting: string;
  initialQuestion: string;
  timeLeft: number;
  isTimerRunning: boolean;
  currentQuestionTime: number;
  currentQuestionNumber: number;
  totalQuestions: number;
  totalTimeLeft: number;
  totalInterviewTime: number;
  isTotalTimerRunning: boolean;
  currentDifficulty: DifficultyLevel;
  candidateLevel: DifficultyLevel;
  canAdvanceToNextLevel: boolean;
  overallScore?: number; 
  isEvaluatingLevel: boolean; 
}

export const useInterview = () => {
  const [state, setState] = useState<InterviewState>({
    isRecording: false,
    error: '',
    transcribedText: '',
    aiResponse: '',
    isProcessing: false,
    isGeneratingFeedback: false,
    summary: '',
    interviewHistory: [],
    isInterviewFinished: false,
    isSendingEmail: false,
    selectedInterviewTypeId: '',
    candidateMetricsHistory: [],
    isInterviewStarted: false,
    initialGreeting: '',
    initialQuestion: '',
    timeLeft: DIFFICULTY_LEVELS.junior.timePerQuestion,
    isTimerRunning: false,
    currentQuestionTime: DIFFICULTY_LEVELS.junior.timePerQuestion,
    currentQuestionNumber: 1,
    totalQuestions: DIFFICULTY_LEVELS.junior.totalQuestions,
    totalTimeLeft: DIFFICULTY_LEVELS.junior.totalTime,
    totalInterviewTime: DIFFICULTY_LEVELS.junior.totalTime,
    isTotalTimerRunning: false,
    currentDifficulty: 'junior', 
    candidateLevel: 'junior',
    canAdvanceToNextLevel: false,
    overallScore: undefined,
    isEvaluatingLevel: false,
  });

  const updateState = useCallback((newState: Partial<InterviewState>) => {
    setState(prev => ({ ...prev, ...newState }));
  }, []);

  const clearFeedback = useCallback(() => {
    setState(prev => ({
      ...prev,
      summary: '',
      overallScore: undefined,
      canAdvanceToNextLevel: false,
      isGeneratingFeedback: false,
      isEvaluatingLevel: false,
      error: prev.error.includes('Evaluando') || prev.error.includes('Puntuación') ? '' : prev.error
    }));
  }, []);


  const advanceToNextLevel = useCallback(() => {
    setState(prev => {
      const currentLevel = prev.currentDifficulty;
      const levels: DifficultyLevel[] = ['junior', 'mid', 'senior'];
      const currentIndex = levels.indexOf(currentLevel);
      
      if (currentIndex < levels.length - 1) {
        const nextLevel = levels[currentIndex + 1];
        const difficultyConfig = DIFFICULTY_LEVELS[nextLevel];
        
        console.log("🚀 Avanzando automáticamente al nivel:", nextLevel);
        
        return {
          ...prev,
          currentDifficulty: nextLevel,
          candidateLevel: nextLevel,
          currentQuestionTime: difficultyConfig.timePerQuestion,
          totalQuestions: difficultyConfig.totalQuestions,
          totalInterviewTime: difficultyConfig.totalTime,
          totalTimeLeft: difficultyConfig.totalTime,
          timeLeft: difficultyConfig.timePerQuestion,
          currentQuestionNumber: 1,
          canAdvanceToNextLevel: false,
          isInterviewFinished: false,
          isEvaluatingLevel: false,
          isInterviewStarted: false, 
          interviewHistory: [],
          candidateMetricsHistory: [],
          transcribedText: '',
          aiResponse: '',
          initialQuestion: '',
          summary: '', 
          overallScore: undefined, 
          error: '',
        };
      }
      
      console.log("🏆 ¡Has alcanzado el nivel máximo!");
      return {
        ...prev,
        canAdvanceToNextLevel: false,
        isEvaluatingLevel: false,
        error: "🏆 ¡Felicidades! Has alcanzado el nivel máximo (Senior)"
      };
    });
  }, []);


  const evaluateLevelAdvancement = useCallback((score: number, currentLevel: DifficultyLevel) => {
    const levelConfig = DIFFICULTY_LEVELS[currentLevel];
    const canAdvance = score >= levelConfig.requiredScore;
    
    console.log("📊 Evaluación de avance:", {
      score,
      requiredScore: levelConfig.requiredScore,
      currentLevel,
      canAdvance
    });

    return canAdvance;
  }, []);


  const finishInterviewForEvaluation = useCallback(() => {
    setState(prev => ({
      ...prev,
      isInterviewFinished: true,
      isTimerRunning: false,
      isTotalTimerRunning: false,
      isEvaluatingLevel: true, 
      error: "📊 Evaluando tu desempeño completo..."
    }));
  }, []);

  const startTimer = useCallback((duration?: number) => {
    setState(prev => ({ 
      ...prev, 
      timeLeft: duration || prev.currentQuestionTime,
      isTimerRunning: true 
    }));
  }, []);

  const stopTimer = useCallback(() => {
    setState(prev => ({ ...prev, isTimerRunning: false }));
  }, []);

  const updateTimeLeft = useCallback((time: number) => {
    setState(prev => ({ ...prev, timeLeft: time }));
  }, []);

  const resetTimer = useCallback((duration?: number) => {
    setState(prev => ({ 
      ...prev, 
      timeLeft: duration || prev.currentQuestionTime,
      isTimerRunning: false 
    }));
  }, []);

  const startTotalTimer = useCallback(() => {
    setState(prev => ({ 
      ...prev, 
      isTotalTimerRunning: true 
    }));
  }, []);

  const stopTotalTimer = useCallback(() => {
    setState(prev => ({ 
      ...prev, 
      isTotalTimerRunning: false 
    }));
  }, []);

  const updateTotalTimeLeft = useCallback((time: number) => {
    setState(prev => ({ ...prev, totalTimeLeft: time }));
  }, []);


  const restartInterview = useCallback(() => {
    const difficultyConfig = DIFFICULTY_LEVELS.junior;
    
    setState({
      isRecording: false,
      error: '',
      transcribedText: '',
      aiResponse: '',
      isProcessing: false,
      isGeneratingFeedback: false,
      summary: '', 
      interviewHistory: [],
      isInterviewFinished: false,
      isSendingEmail: false,
      selectedInterviewTypeId: state.selectedInterviewTypeId,
      candidateMetricsHistory: [],
      isInterviewStarted: false,
      initialGreeting: '',
      initialQuestion: '',
      timeLeft: difficultyConfig.timePerQuestion,
      isTimerRunning: false,
      currentQuestionTime: difficultyConfig.timePerQuestion,
      currentQuestionNumber: 1,
      totalQuestions: difficultyConfig.totalQuestions,
      totalTimeLeft: difficultyConfig.totalTime,
      totalInterviewTime: difficultyConfig.totalTime,
      isTotalTimerRunning: false,
      currentDifficulty: 'junior',
      candidateLevel: 'junior',
      canAdvanceToNextLevel: false,
      overallScore: undefined, 
      isEvaluatingLevel: false,
    });
  }, [state.selectedInterviewTypeId]);

 
  const restartSameLevel = useCallback(() => {
    setState(prev => {
      const difficultyConfig = DIFFICULTY_LEVELS[prev.currentDifficulty];
      
      return {
        ...prev,
        isRecording: false,
        error: '',
        transcribedText: '',
        aiResponse: '',
        isProcessing: false,
        isGeneratingFeedback: false,
        summary: '', 
        interviewHistory: [],
        isInterviewFinished: false,
        isSendingEmail: false,
        isInterviewStarted: false, 
        initialGreeting: '',
        initialQuestion: '',
        timeLeft: difficultyConfig.timePerQuestion,
        isTimerRunning: false,
        currentQuestionTime: difficultyConfig.timePerQuestion,
        currentQuestionNumber: 1,
        totalQuestions: difficultyConfig.totalQuestions,
        totalTimeLeft: difficultyConfig.totalTime,
        totalInterviewTime: difficultyConfig.totalTime,
        isTotalTimerRunning: false,
        canAdvanceToNextLevel: false,
        overallScore: undefined, 
        isEvaluatingLevel: false,
        currentDifficulty: prev.currentDifficulty,
        candidateLevel: prev.currentDifficulty,
      };
    });
  }, []);


  const startInterview = useCallback((initialMessage: string) => {
    setState(prev => {
      const difficultyConfig = DIFFICULTY_LEVELS[prev.currentDifficulty];
      
      return {
        ...prev,
        isInterviewStarted: true,
        initialGreeting: '', 
        initialQuestion: initialMessage, 
        aiResponse: initialMessage, 
        error: '',
        currentQuestionNumber: 1,
        currentQuestionTime: difficultyConfig.timePerQuestion,
        timeLeft: difficultyConfig.timePerQuestion,
        totalTimeLeft: difficultyConfig.totalTime,
        isTotalTimerRunning: true,
        summary: '', 
        overallScore: undefined, 
        canAdvanceToNextLevel: false, 
      };
    });
  }, []);

  
  const goToNextQuestion = useCallback(() => {
    setState(prev => {
      console.log("🔄 goToNextQuestion - Estado actual:", {
        currentQuestion: prev.currentQuestionNumber,
        totalQuestions: prev.totalQuestions,
        hasAIResponse: !!prev.aiResponse,
        aiResponseLength: prev.aiResponse?.length
      });

  
      if (prev.currentQuestionNumber >= prev.totalQuestions) {
        console.log("🎯 Última pregunta completada, preparando evaluación final");
        return {
          ...prev,
          isInterviewFinished: true,
          isTimerRunning: false,
          isTotalTimerRunning: false,
          isEvaluatingLevel: true, 
          error: "🎉 ¡Has completado todas las preguntas! Evaluando tu desempeño..."
        };
      }
      
      console.log("➡️ Avanzando a pregunta:", prev.currentQuestionNumber + 1);
      return {
        ...prev,
        currentQuestionNumber: prev.currentQuestionNumber + 1,
        transcribedText: '', 
        error: '',
        timeLeft: prev.currentQuestionTime,
        isTimerRunning: false,
      };
    });
  }, []);

  const isLastQuestion = useCallback(() => {
    const isLast = state.currentQuestionNumber >= state.totalQuestions;
    return isLast;
  }, [state.currentQuestionNumber, state.totalQuestions]);

  const getCurrentDifficultyConfig = useCallback(() => {
    return DIFFICULTY_LEVELS[state.currentDifficulty];
  }, [state.currentDifficulty]);

  const getNextLevel = useCallback(() => {
    const currentLevel = state.currentDifficulty;
    const levels: DifficultyLevel[] = ['junior', 'mid', 'senior'];
    const currentIndex = levels.indexOf(currentLevel);
    
    if (currentIndex < levels.length - 1) {
      return levels[currentIndex + 1];
    }
    return null; 
  }, [state.currentDifficulty]);

  return {
    state,
    updateState,
    restartInterview,
    restartSameLevel, 
    startInterview,
    startTimer,
    stopTimer,
    updateTimeLeft,
    resetTimer,
    goToNextQuestion,
    isLastQuestion,
    startTotalTimer,
    stopTotalTimer,
    updateTotalTimeLeft,
    advanceToNextLevel,
    evaluateLevelAdvancement,
    finishInterviewForEvaluation,
    getCurrentDifficultyConfig,
    getNextLevel,
    clearFeedback, 
  };
};