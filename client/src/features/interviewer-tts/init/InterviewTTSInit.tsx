"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useInterviewTTS } from "../contexts/InterviewTTSContext";

export default function InterviewTTSInit() {
  const router = useRouter();
  const { startInterview } = useInterviewTTS();
  const [isStarting, setIsStarting] = useState(false);

  const handleStart = () => {
    setIsStarting(true);

    // Start interview without interview type for now (can be added later)
    startInterview();

    // Navigate to session page
    router.push("/entrevistador-tts/session");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Entrevista por Voz
          </h1>
          <p className="text-gray-600">
            Practica tus habilidades de entrevista con IA en tiempo real
          </p>
        </div>

        <div className="space-y-4 mb-8">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">
              Cómo funciona:
            </h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Duración máxima: 10 minutos</li>
              <li>• Conversación natural por voz</li>
              <li>• La IA decide cuándo finalizar</li>
              <li>• Haz clic para grabar, clic para enviar</li>
            </ul>
          </div>
        </div>

        <Button
          onClick={handleStart}
          disabled={isStarting}
          className="w-full"
          size="lg"
        >
          {isStarting ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Iniciando...
            </>
          ) : (
            "Comenzar Entrevista"
          )}
        </Button>
      </div>
    </div>
  );
}
