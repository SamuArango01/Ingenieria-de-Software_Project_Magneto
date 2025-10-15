'use client';

import { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';

interface InterviewContextState {
  // Interview data
  interviewId: number | null;
  interviewTypeId: number | null;
  candidateName: string | null;
  initialMessage: string | null;

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
}

const InterviewContext = createContext<InterviewContextState | undefined>(undefined);

export function InterviewProvider({ children }: { children: React.ReactNode }) {
  const [interviewId, setInterviewId] = useState<number | null>(null);
  const [interviewTypeId, setInterviewTypeId] = useState<number | null>(null);
  const [candidateName, setCandidateName] = useState<string | null>(null);
  const [initialMessage, setInitialMessage] = useState<string | null>(null);
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
    setElapsedTime(0);
    setIsTimerRunning(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  return (
    <InterviewContext.Provider
      value={{
        interviewId,
        interviewTypeId,
        candidateName,
        initialMessage,
        elapsedTime,
        isTimerRunning,
        startInterview,
        endInterview,
        pauseTimer,
        resumeTimer,
        resetInterview,
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
