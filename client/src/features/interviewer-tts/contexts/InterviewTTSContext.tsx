"use client";

import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from "react";
import { Socket } from "socket.io-client";
import { InterviewTTSState, Message } from "../models/interviewer-tts.model";

interface InterviewTTSContextType extends InterviewTTSState {
  // Socket
  socket: Socket | null;
  setSocket: (socket: Socket | null) => void;

  // Interview actions
  startInterview: (interviewTypeId?: number) => void;
  endInterview: () => void;
  setInterviewId: (id: number | null) => void;

  // Message actions
  addMessage: (role: "user" | "ai", text: string) => void;

  // Recording state
  setIsRecording: (isRecording: boolean) => void;

  // Processing state
  setProcessingStatus: (status: string | null) => void;

  // Audio
  setCurrentAudio: (audio: string | null) => void;

  // Streaming state
  streamingMessage: string;
  isStreamingText: boolean;
  isStreamingAudio: boolean;
  appendTextChunk: (chunk: string) => void;
  setIsStreamingText: (isStreaming: boolean) => void;
  setIsStreamingAudio: (isStreaming: boolean) => void;
  finalizeStreamingMessage: () => void;
  clearStreamingState: () => void;

  // Timer
  startTimer: () => void;
  pauseTimer: () => void;
  resetTimer: () => void;

  // Reset
  reset: () => void;
}

const InterviewTTSContext = createContext<InterviewTTSContextType | undefined>(undefined);

const MAX_TIME = 600; // 10 minutes in seconds

export function InterviewTTSProvider({ children }: { children: React.ReactNode }) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [interviewId, setInterviewId] = useState<number | null>(null);
  const [interviewTypeId, setInterviewTypeId] = useState<number | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStatus, setProcessingStatusState] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [currentAudio, setCurrentAudio] = useState<string | null>(null);

  // Streaming state
  const [streamingMessage, setStreamingMessage] = useState<string>("");
  const [isStreamingText, setIsStreamingText] = useState(false);
  const [isStreamingAudio, setIsStreamingAudio] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Timer effect
  useEffect(() => {
    if (isTimerRunning) {
      timerRef.current = setInterval(() => {
        setElapsedTime((prev) => {
          if (prev >= MAX_TIME) {
            setIsTimerRunning(false);
            return MAX_TIME;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isTimerRunning]);

  // Socket connection status
  useEffect(() => {
    if (socket) {
      const handleConnect = () => setIsConnected(true);
      const handleDisconnect = () => setIsConnected(false);

      socket.on("connect", handleConnect);
      socket.on("disconnect", handleDisconnect);

      setIsConnected(socket.connected);

      return () => {
        socket.off("connect", handleConnect);
        socket.off("disconnect", handleDisconnect);
      };
    }
  }, [socket]);

  const startInterview = useCallback((typeId?: number) => {
    if (!socket) return;

    setInterviewTypeId(typeId || null);
    socket.emit("start_interview", { interviewTypeId: typeId });
  }, [socket]);

  const endInterview = useCallback(() => {
    if (!socket) return;

    socket.emit("end_interview");
    setIsTimerRunning(false);
  }, [socket]);

  const addMessage = useCallback((role: "user" | "ai", text: string) => {
    setMessages((prev) => [...prev, { role, text, timestamp: new Date() }]);
  }, []);

  const setProcessingStatus = useCallback((status: string | null) => {
    setProcessingStatusState(status);
    setIsProcessing(status !== null);
  }, []);

  const startTimer = useCallback(() => {
    setIsTimerRunning(true);
  }, []);

  const pauseTimer = useCallback(() => {
    setIsTimerRunning(false);
  }, []);

  const resetTimer = useCallback(() => {
    setElapsedTime(0);
    setIsTimerRunning(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // Streaming functions
  const appendTextChunk = useCallback((chunk: string) => {
    setStreamingMessage((prev) => prev + chunk);
  }, []);

  const finalizeStreamingMessage = useCallback(() => {
    if (streamingMessage.trim().length > 0) {
      addMessage("ai", streamingMessage);
      setStreamingMessage("");
    }
    setIsStreamingText(false);
  }, [streamingMessage, addMessage]);

  const clearStreamingState = useCallback(() => {
    setStreamingMessage("");
    setIsStreamingText(false);
    setIsStreamingAudio(false);
  }, []);

  const reset = useCallback(() => {
    setInterviewId(null);
    setInterviewTypeId(null);
    setIsRecording(false);
    setIsProcessing(false);
    setProcessingStatusState(null);
    setMessages([]);
    setCurrentAudio(null);
    clearStreamingState();
    resetTimer();
  }, [resetTimer, clearStreamingState]);

  const value: InterviewTTSContextType = {
    socket,
    setSocket,
    interviewId,
    interviewTypeId,
    isConnected,
    isRecording,
    isProcessing,
    processingStatus,
    messages,
    elapsedTime,
    isTimerRunning,
    currentAudio,
    streamingMessage,
    isStreamingText,
    isStreamingAudio,
    startInterview,
    endInterview,
    setInterviewId,
    addMessage,
    setIsRecording,
    setProcessingStatus,
    setCurrentAudio,
    appendTextChunk,
    setIsStreamingText,
    setIsStreamingAudio,
    finalizeStreamingMessage,
    clearStreamingState,
    startTimer,
    pauseTimer,
    resetTimer,
    reset,
  };

  return (
    <InterviewTTSContext.Provider value={value}>
      {children}
    </InterviewTTSContext.Provider>
  );
}

export function useInterviewTTS() {
  const context = useContext(InterviewTTSContext);
  if (!context) {
    throw new Error("useInterviewTTS must be used within InterviewTTSProvider");
  }
  return context;
}
