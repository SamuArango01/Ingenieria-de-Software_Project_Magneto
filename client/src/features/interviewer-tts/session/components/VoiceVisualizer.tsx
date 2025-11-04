"use client";

import { Mic, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface VoiceVisualizerProps {
  isRecording: boolean;
  isProcessing: boolean;
}

export default function VoiceVisualizer({ isRecording, isProcessing }: VoiceVisualizerProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-6">
      <div className="relative">
        {/* Outer pulsing ring when recording */}
        {isRecording && (
          <div className="absolute inset-0 animate-ping">
            <div className="w-48 h-48 rounded-full bg-red-400 opacity-75"></div>
          </div>
        )}

        {/* Outer glow when processing */}
        {isProcessing && (
          <div className="absolute inset-0 animate-pulse">
            <div className="w-48 h-48 rounded-full bg-blue-400 opacity-50"></div>
          </div>
        )}

        {/* Main microphone circle */}
        <div
          className={`relative w-48 h-48 rounded-full flex items-center justify-center transition-all duration-300 ${
            isRecording
              ? "bg-red-500 shadow-2xl shadow-red-500/50 scale-110"
              : isProcessing
              ? "bg-blue-500 shadow-2xl shadow-blue-500/50"
              : "bg-gradient-to-br from-indigo-500 to-purple-600 shadow-xl hover:scale-105 cursor-pointer"
          }`}
        >
          {isProcessing ? (
            <Loader2 className="w-24 h-24 text-white animate-spin" />
          ) : (
            <Mic className="w-24 h-24 text-white" />
          )}
        </div>
      </div>

      {/* Status badge */}
      <Badge
        variant={isRecording ? "destructive" : isProcessing ? "default" : "secondary"}
        className="text-sm px-4 py-2"
      >
        {isRecording ? "Grabando..." : isProcessing ? "Procesando..." : "Toca para hablar"}
      </Badge>
    </div>
  );
}
