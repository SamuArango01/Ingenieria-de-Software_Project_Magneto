"use client";

import { MicrophoneIcon } from "@heroicons/react/24/solid";
import { useState, useRef } from "react";

export default function EntrevistadorPage() {
  const [isRecording, setIsRecording] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [error, setError] = useState<string>("");
  const [transcribedText, setTranscribedText] = useState<string>("");
  const [aiResponse, setAiResponse] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const requestMicrophonePermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setHasPermission(true);
      setError("");
      return stream;
    } catch (err) {
      setHasPermission(false);
      setError("Permiso de micrófono denegado. Por favor, permite el acceso al micrófono.");
      console.error("Error accessing microphone:", err);
      return null;
    }
  };

  const startRecording = async () => {
    const stream = await requestMicrophonePermission();
    if (!stream) return;

    try {
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
        await sendAudioToBackend(audioBlob);
        
        // Stop all tracks to release microphone
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setError("");
    } catch (err) {
      setError("Error al iniciar la grabación");
      console.error("Error starting recording:", err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const sendAudioToBackend = async (audioBlob: Blob) => {
    setIsProcessing(true);
    setError("");
    
    try {
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.webm');

      const response = await fetch('http://localhost:3211/api/audio', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Audio sent successfully:', result);
      
      if (result.success && result.text) {
        setTranscribedText(result.text);
        setAiResponse(result.aiResponse || "");
      } else {
        setError("No se pudo obtener la transcripción del audio");
      }
    } catch (err) {
      setError("Error al procesar audio en el servidor");
      console.error("Error sending audio to backend:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleMicrophoneClick = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-8">
      <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-12 max-w-lg w-full shadow-2xl text-center">
        <h1 className="text-3xl font-bold text-white mb-8">
          Iniciar Entrevista
        </h1>

        <div className="flex flex-col items-center space-y-6">
          <button
            type="button"
            onClick={handleMicrophoneClick}
            className={`
              relative p-8 rounded-full transition-all duration-300 transform hover:scale-105
              ${
                isRecording
                  ? "bg-red-500 hover:bg-red-400 animate-pulse"
                  : "bg-emerald-500 hover:bg-emerald-400"
              }
              shadow-lg hover:shadow-xl
            `}
          >
            <MicrophoneIcon className="h-16 w-16 text-white" />
            {isRecording && (
              <div className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-75"></div>
            )}
          </button>

          <div className="text-center">
            <p className="text-xl font-semibold text-white mb-2">
              {isProcessing 
                ? 'Procesando audio...' 
                : isRecording 
                  ? 'Grabando...' 
                  : 'Hablar'
              }
            </p>
            <p className="text-gray-400 text-sm">
              {isProcessing
                ? 'Convirtiendo audio a texto'
                : isRecording 
                  ? 'Toca para detener la grabación' 
                  : 'Toca el micrófono para comenzar'
              }
            </p>
          </div>
        </div>

        {error && (
          <div className="mt-8 p-4 bg-red-900/30 border border-red-700 rounded-lg">
            <p className="text-red-300 text-sm">
              ⚠️ {error}
            </p>
          </div>
        )}

        {isRecording && !error && (
          <div className="mt-8 p-4 bg-red-900/30 border border-red-700 rounded-lg">
            <p className="text-red-300 text-sm">
              🔴 Entrevista en curso
            </p>
          </div>
        )}

        {hasPermission === false && (
          <div className="mt-8 p-4 bg-yellow-900/30 border border-yellow-700 rounded-lg">
            <p className="text-yellow-300 text-sm">
              🎤 Necesitas permitir el acceso al micrófono para continuar
            </p>
          </div>
        )}

        {transcribedText && (
          <div className="mt-8 space-y-6">
            {/* Transcription Section */}
            <div className="p-6 bg-emerald-900/30 border border-emerald-700 rounded-lg">
              <h3 className="text-emerald-300 font-semibold mb-3 flex items-center">
                📝 Tu respuesta:
              </h3>
              <p className="text-white text-base leading-relaxed bg-gray-800/50 p-4 rounded-lg">
                {transcribedText}
              </p>
            </div>

            {/* AI Response Section */}
            {aiResponse && (
              <div className="p-6 bg-blue-900/30 border border-blue-700 rounded-lg">
                <h3 className="text-blue-300 font-semibold mb-3 flex items-center">
                  🤖 Respuesta del Entrevistador AI:
                </h3>
                <p className="text-white text-base leading-relaxed bg-gray-800/50 p-4 rounded-lg">
                  {aiResponse}
                </p>
              </div>
            )}
          </div>
        )}

        {isProcessing && (
          <div className="mt-8 p-4 bg-blue-900/30 border border-blue-700 rounded-lg">
            <p className="text-blue-300 text-sm flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Procesando audio con Whisper AI...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
