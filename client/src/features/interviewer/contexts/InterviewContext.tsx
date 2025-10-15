'use client';

import { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import type { CandidateMetrics } from '../session/models/session.model';

// Constantes de la entrevista
export const TOTAL_QUESTIONS = 5;
export const TIME_PER_QUESTION = 120; // en segundos (2 minutos)

interface InterviewContextState {
  // Interview data
  interviewId: number | null;
  interviewTypeId: number | null;
  candidateName: string | null;
  initialMessage: string | null;

  // Interview history
  interviewHistory: Array<{ user: string; ai: string }>;
  candidateMetricsHistory: CandidateMetrics[];

  // Timer
  elapsedTime: number; // en segundos
  isTimerRunning: boolean;

  // Actions
  startInterview: (data: {
    interviewId: number;
    interviewTypeId: number | null;
    candidateName: string;
    initialMessage: string;
  }) => void;
  endInterview: () => void;
  pauseTimer: () => void;
  resumeTimer: () => void;
  resetInterview: () => void;
  addInterviewTurn: (userAnswer: string, aiQuestion: string, metrics: CandidateMetrics) => void;
}

const InterviewContext = createContext<InterviewContextState | undefined>(undefined);

export function InterviewProvider({ children }: { children: React.ReactNode }) {
  const [interviewId, setInterviewId] = useState<number | null>(null);
  const [interviewTypeId, setInterviewTypeId] = useState<number | null>(null);
  const [candidateName, setCandidateName] = useState<string | null>(null);
  const [initialMessage, setInitialMessage] = useState<string | null>(null);
  const [interviewHistory, setInterviewHistory] = useState<Array<{ user: string; ai: string }>>([]);
  const [candidateMetricsHistory, setCandidateMetricsHistory] = useState<CandidateMetrics[]>([]);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Iniciar el timer automáticamente
  useEffect(() => {
    if (isTimerRunning) {
      intervalRef.current = setInterval(() => {
        setElapsedTime((prev) => prev + 1);
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isTimerRunning]);

  const startInterview = useCallback((data: {
    interviewId: number;
    interviewTypeId: number | null;
    candidateName: string;
    initialMessage: string;
  }) => {
    setInterviewId(data.interviewId);
    setInterviewTypeId(data.interviewTypeId);
    setCandidateName(data.candidateName);
    setInitialMessage(data.initialMessage);
    setElapsedTime(0);
    setIsTimerRunning(true);
  }, []);

  const endInterview = useCallback(() => {
    setIsTimerRunning(false);
  }, []);

  const pauseTimer = useCallback(() => {
    setIsTimerRunning(false);
  }, []);

  const resumeTimer = useCallback(() => {
    setIsTimerRunning(true);
  }, []);

  const resetInterview = useCallback(() => {
    setInterviewId(null);
    setInterviewTypeId(null);
    setCandidateName(null);
    setInitialMessage(null);
    setInterviewHistory([]);
    setCandidateMetricsHistory([]);
    setElapsedTime(0);
    setIsTimerRunning(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const addInterviewTurn = useCallback((userAnswer: string, aiQuestion: string, metrics: CandidateMetrics) => {
    setInterviewHistory((prev) => [...prev, { user: userAnswer, ai: aiQuestion }]);
    setCandidateMetricsHistory((prev) => [...prev, metrics]);
  }, []);

  return (
    <InterviewContext.Provider
      value={{
        interviewId,
        interviewTypeId,
        candidateName,
        initialMessage,
        interviewHistory,
        candidateMetricsHistory,
        elapsedTime,
        isTimerRunning,
        startInterview,
        endInterview,
        pauseTimer,
        resumeTimer,
        resetInterview,
        addInterviewTurn,
      }}
    >
      {children}
    </InterviewContext.Provider>
  );
}

export function useInterviewContext() {
  const context = useContext(InterviewContext);
  if (context === undefined) {
    throw new Error('useInterviewContext must be used within an InterviewProvider');
  }
  return context;
}
