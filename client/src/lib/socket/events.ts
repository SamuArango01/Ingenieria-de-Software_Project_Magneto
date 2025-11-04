/**
 * Socket.IO event types for type-safe event handling
 */

// Client -> Server events
export interface ClientToServerEvents {
  start_interview: (data: { interviewTypeId?: number }) => void;
  audio_message: (data: { audio: string }) => void;
  end_interview: () => void;
}

// Server -> Client events
export interface ServerToClientEvents {
  interview_started: (data: {
    interviewId: number;
    message: string;
    audio: string;
  }) => void;
  processing: (data: { status: string }) => void;
  transcription: (data: { text: string }) => void;
  ai_response: (data: {
    message: string;
    audio: string;
    shouldEnd: boolean;
    reason?: string;
  }) => void;
  interview_ended: (data: { interviewId: number; reason: string }) => void;
  error: (data: { message: string }) => void;
}
