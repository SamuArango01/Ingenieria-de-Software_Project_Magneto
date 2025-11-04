"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Power, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useInterviewTTS } from "../contexts/InterviewTTSContext";
import { useSocketConnection } from "./hooks/useSocketConnection";
import { useAudioRecorder } from "./hooks/useAudioRecorder";
import { useAudioPlayback } from "./hooks/useAudioPlayback";
import VoiceVisualizer from "./components/VoiceVisualizer";

export default function InterviewTTSSession() {
  const router = useRouter();
  const {
    isConnected,
    isProcessing,
    processingStatus,
    elapsedTime,
    currentAudio,
    endInterview,
    socket,
    setIsRecording: setContextRecording,
  } = useInterviewTTS();

  const { socket: socketInstance } = useSocketConnection();
  const { isRecording, audioBlob, startRecording, stopRecording, resetRecording } =
    useAudioRecorder();
  const { playAudioFromBase64 } = useAudioPlayback();

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
      playAudioFromBase64(currentAudio);
    }
  }, [currentAudio, playAudioFromBase64]);

  const handleMicClick = () => {
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <Card className="p-8">
          <Alert>
            <AlertDescription>Conectando al servidor...</AlertDescription>
          </Alert>
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

      {/* Main content - Voice Visualizer */}
      <div className="flex-1 flex items-center justify-center">
        <div onClick={handleMicClick} className="cursor-pointer">
          <VoiceVisualizer isRecording={isRecording} isProcessing={isProcessing} />
        </div>
      </div>

      {/* Processing status */}
      {processingStatus && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 mt-32">
          <Badge variant="outline" className="px-4 py-2">
            {processingStatus === "transcribing" && "Transcribiendo audio..."}
            {processingStatus === "generating_response" && "Generando respuesta..."}
            {processingStatus === "generating_audio" && "Generando audio..."}
          </Badge>
        </div>
      )}

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
