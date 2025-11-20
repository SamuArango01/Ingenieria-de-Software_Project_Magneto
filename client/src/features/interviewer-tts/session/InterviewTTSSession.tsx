"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Power, Clock, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useInterviewTTS } from "../contexts/InterviewTTSContext";
import { useSocketConnection } from "./hooks/useSocketConnection";
import { useAudioRecorder } from "./hooks/useAudioRecorder";
import { useAudioPlayback } from "./hooks/useAudioPlayback";
import { useStreamingAudioPlayback } from "./hooks/useStreamingAudioPlayback";
import VoiceVisualizer from "./components/VoiceVisualizer";
import { ConversationTranscript } from "./components/ConversationTranscript";

export default function InterviewTTSSession() {
  const router = useRouter();
  const {
    isConnected,
    interviewId,
    isProcessing,
    processingStatus,
    elapsedTime,
    currentAudio,
    endInterview,
    socket,
    startInterview,
    setIsRecording: setContextRecording,
    isStreamingAudio,
  } = useInterviewTTS();

  const { socket: socketInstance } = useSocketConnection();
  const { isRecording, audioBlob, startRecording, stopRecording, resetRecording } =
    useAudioRecorder();
  const { playAudioFromBase64 } = useAudioPlayback();
  const { enqueueAudioChunk } = useStreamingAudioPlayback();

  // Start interview automatically when connected
  useEffect(() => {
    if (isConnected && !interviewId && socket) {
      console.log("Auto-starting interview...");
      startInterview();
    }
  }, [isConnected, interviewId, socket, startInterview]);

  // Sync recording state with context
  useEffect(() => {
    setContextRecording(isRecording);
  }, [isRecording, setContextRecording]);

  // Send audio when recording stops
  useEffect(() => {
    if (audioBlob && socket) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Audio = (reader.result as string).split(",")[1];
        socket.emit("audio_message", { audio: base64Audio });
        resetRecording();
      };
      reader.readAsDataURL(audioBlob);
    }
  }, [audioBlob, socket, resetRecording]);

  // Play AI audio when available
  useEffect(() => {
    if (currentAudio) {
      // If streaming mode, enqueue chunks; otherwise play complete audio
      if (isStreamingAudio) {
        enqueueAudioChunk(currentAudio);
      } else {
        playAudioFromBase64(currentAudio);
      }
    }
  }, [currentAudio, playAudioFromBase64, enqueueAudioChunk, isStreamingAudio]);

  const handleMicClick = () => {
    if (!interviewId) {
      console.warn("No active interview, cannot record");
      return;
    }

    if (isRecording) {
      stopRecording();
    } else if (!isProcessing) {
      startRecording();
    }
  };

  const handleEndInterview = () => {
    if (confirm("¿Estás seguro de que deseas finalizar la entrevista?")) {
      endInterview();
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const remainingTime = 600 - elapsedTime; // 10 minutes = 600 seconds

  if (!isConnected) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        <Card className="p-8 min-w-[300px]">
          <CardHeader className="space-y-4">
            <div className="flex justify-center">
              <Loader2 className="w-12 h-12 animate-spin text-indigo-600" />
            </div>
            <CardTitle className="text-center text-xl">
              Conectando al servidor...
            </CardTitle>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex flex-col">
      {/* Header with timer */}
      <div className="w-full p-6 flex justify-between items-center">
        {/* Logo/Brand (left) */}
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg"></div>

        {/* Timer (right) */}
        <Badge variant="secondary" className="text-lg px-6 py-3 font-mono">
          <Clock className="w-5 h-5 mr-2" />
          {formatTime(remainingTime)}
        </Badge>
      </div>

      {/* Main container with two columns */}
      <div className="flex-1 flex items-stretch px-4 gap-4">
        {/* Left side: Conversation Transcript */}
        <div className="w-1/2 flex items-center">
          <ConversationTranscript />
        </div>

        {/* Right side: Voice Visualizer */}
        <div className="w-1/2 flex items-center justify-center relative">
          <div
            onClick={handleMicClick}
            className={interviewId ? "cursor-pointer" : "cursor-not-allowed opacity-50"}
          >
            <VoiceVisualizer isRecording={isRecording} isProcessing={isProcessing} />
          </div>
          {!interviewId && (
            <div className="absolute top-2/3">
              <Badge variant="outline" className="px-4 py-2">
                Iniciando entrevista...
              </Badge>
            </div>
          )}

          {/* Processing status */}
          {processingStatus && (
            <div className="absolute top-1/4">
              <Badge variant="outline" className="px-4 py-2">
                {processingStatus === "transcribing" && "Transcribiendo audio..."}
                {processingStatus === "generating_response" && "Generando respuesta..."}
                {processingStatus === "generating_audio" && "Generando audio..."}
                {processingStatus === "streaming_response" && "Respuesta en tiempo real..."}
              </Badge>
            </div>
          )}
        </div>
      </div>

      {/* Footer with end button */}
      <div className="w-full p-6 flex justify-end">
        <Button
          onClick={handleEndInterview}
          variant="destructive"
          size="lg"
          className="px-8"
        >
          <Power className="w-5 h-5 mr-2" />
          Finalizar Entrevista
        </Button>
      </div>
    </div>
  );
}
