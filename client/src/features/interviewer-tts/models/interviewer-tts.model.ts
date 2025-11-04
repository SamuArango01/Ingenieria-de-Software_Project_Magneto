export interface Message {
  role: "user" | "ai";
  text: string;
  timestamp: Date;
}

export interface InterviewTTSState {
  interviewId: number | null;
  interviewTypeId: number | null;
  isConnected: boolean;
  isRecording: boolean;
  isProcessing: boolean;
  processingStatus: string | null;
  messages: Message[];
  elapsedTime: number; // in seconds
  isTimerRunning: boolean;
  currentAudio: string | null; // base64 audio from AI
}
