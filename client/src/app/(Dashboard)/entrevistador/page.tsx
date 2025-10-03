"use client";

import { MicrophoneIcon, ArrowPathIcon } from "@heroicons/react/24/solid";
import { useState, useRef } from "react";
import { useUser } from "@clerk/nextjs";
import ReactMarkdown from 'react-markdown';

export default function EntrevistadorPage() {
  const [isRecording, setIsRecording] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [error, setError] = useState<string>("");
  const [transcribedText, setTranscribedText] = useState<string>("");
  const [aiResponse, setAiResponse] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [summary, setSummary] = useState<string>("");
  const [interviewHistory, setInterviewHistory] = useState<
    { user: string; ai: string }[]
  >([]);
  const [isInterviewFinished, setIsInterviewFinished] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const { user } = useUser();
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);

 
  const restartInterview = () => {
    
    if (isRecording && mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }
    
    setIsRecording(false);
    setHasPermission(null);
    setError("");
    setTranscribedText("");
    setAiResponse("");
    setIsProcessing(false);
    setIsGeneratingSummary(false);
    setSummary("");
    setInterviewHistory([]);
    setIsInterviewFinished(false);
    chunksRef.current = [];
    mediaRecorderRef.current = null;
    setShowConfirm(false);
    setLoading(false);
    setIsSendingEmail(false);
  };

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
    if (isInterviewFinished) {
      setError("La entrevista ya fue finalizada.");
      return;
    }

    setError("");
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
        const audioBlob = new Blob(chunksRef.current, { type: "audio/webm" });
        await sendAudioToBackend(audioBlob);

        // Stop all tracks to release microphone
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start(); 
      setIsRecording(true);
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
    formData.append("audio", audioBlob, "recording.webm");

    const response = await fetch("http://localhost:3211/api/audio", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("No se pudo transcribir el audio. Por favor, intenta hablar más claro o verifica tu micrófono.");
    }

    const result = await response.json();
    console.log('Audio sent successfully:', result);

    if (result.success) {
      if (!result.text || result.text.trim() === "") {
        throw new Error("No se detectó ninguna voz. Por favor, intenta hablar nuevamente.");
      }
      
      setTranscribedText(result.text);
      setAiResponse(result.aiResponse || "");
      
      setInterviewHistory((prev) => [
        ...prev,
        { 
          user: result.text, 
          ai: result.aiResponse || "No response" 
        },
      ]);
    } else {
      throw new Error(result.error || "No se pudo procesar el audio correctamente");
    }
  } catch (err) {
    setError(err instanceof Error ? err.message : "Error al procesar audio");
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

  const generateSummary = async () => {
    if (interviewHistory.length === 0) {
      setError("No hay historial de entrevista para generar resumen");
      return;
    }

    setIsGeneratingSummary(true);
    setError("");
    
    try {
      const response = await fetch("http://localhost:3211/api/summary", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json" 
        },
        body: JSON.stringify({ interviewHistory }),
      });

      if (!response.ok) {
        throw new Error(`Error del servidor: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success) {
        setSummary(result.summary);
      } else {
        throw new Error(result.error || "Error generando resumen");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al conectar con el servidor");
      console.error("Error generating summary:", err);
    } finally {
      setIsGeneratingSummary(false);
    }
  };

  const finishInterview = () => {
    if (isRecording) {
      stopRecording();
    }
    setIsInterviewFinished(true);
    setShowConfirm(false);
  };

  const handleConfirm = async () => {
    setLoading(true);
    finishInterview();
    setLoading(false);
  };

  const sendEmailToCandidate = async () => {
    if (!summary) {
      setError("Primero genera el resumen antes de enviar el email");
      return;
    }

    if (!user?.primaryEmailAddress) {
      setError("No se pudo obtener tu email");
      return;
    }

    setIsSendingEmail(true);
    setError("");
    
    try {
      const candidateEmail = user.primaryEmailAddress.emailAddress;
      const candidateName = user.fullName || 'Candidato';

      const response = await fetch("http://localhost:3211/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          candidateEmail,
          candidateName,
          interviewHistory,
          summary
        }),
      });

      const result = await response.json();

      if (result.success) {
        alert(` Correo enviado exitosamente a ${candidateEmail}`);
      } else {
        throw new Error(result.error || "Error al enviar el correo");
      }

    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error de conexión al enviar el correo');
      console.error('Error enviando email:', error);
    } finally {
      setIsSendingEmail(false);
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
            disabled={isInterviewFinished || isProcessing}
            className={`
              relative p-8 rounded-full transition-all duration-300 transform hover:scale-105
              ${
                isRecording
                  ? "bg-red-500 hover:bg-red-400 animate-pulse"
                  : "bg-emerald-500 hover:bg-emerald-400"
              }
              ${(isInterviewFinished || isProcessing) ? "opacity-50 cursor-not-allowed" : ""}
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
                  : isInterviewFinished
                    ? 'Finalizada'
                    : 'Hablar'
              }
            </p>
            <p className="text-gray-400 text-sm">
              {isProcessing
                ? 'Convirtiendo audio a texto'
                : isRecording 
                  ? 'Toca para detener la grabación' 
                  : isInterviewFinished
                    ? 'La entrevista ha finalizado'
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

        {(transcribedText || aiResponse) && (
          <div className="mt-8 space-y-6">
            {transcribedText && (
              <div className="p-6 bg-emerald-900/30 border border-emerald-700 rounded-lg">
                <h3 className="text-emerald-300 font-semibold mb-3 flex items-center">
                  📝 Tu respuesta:
                </h3>
                <p className="text-white text-base leading-relaxed bg-gray-800/50 p-4 rounded-lg">
                  {transcribedText}
                </p>
              </div>
            )}

            {aiResponse && (
              <div className="p-6 bg-blue-900/30 border border-blue-700 rounded-lg">
                <h3 className="text-blue-300 font-semibold mb-3 flex items-center">
                  🤖 Entrevistador AI:
                </h3>
                <div className="text-white text-base leading-relaxed bg-gray-800/50 p-4 rounded-lg prose prose-invert max-w-none">
                  <ReactMarkdown
                    components={{
                      strong: ({children}) => <strong className="font-bold text-blue-100">{children}</strong>,
                      p: ({children}) => <p className="mb-2 last:mb-0">{children}</p>,
                      ul: ({children}) => <ul className="list-disc list-inside mb-2 space-y-1">{children}</ul>,
                      ol: ({children}) => <ol className="list-decimal list-inside mb-2 space-y-1">{children}</ol>,
                      li: ({children}) => <li className="ml-2">{children}</li>
                    }}
                  >
                    {aiResponse}
                  </ReactMarkdown>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="mt-8 flex flex-col space-y-4">
          {!isInterviewFinished && (
            <div className="flex justify-center">
              <button
                onClick={() => setShowConfirm(true)}
                disabled={isRecording}
                className={`
                  flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold shadow-md transition-all duration-300
                  ${isRecording 
                    ? "opacity-50 cursor-not-allowed bg-red-800/40 border border-red-700 text-red-200"
                    : "bg-red-600 hover:bg-red-500 text-white hover:shadow-lg"
                  }
                `}
              >
                🏁 Finalizar entrevista
              </button>
            </div>
          )}

          {isInterviewFinished && !summary && (
            <button
              onClick={generateSummary}
              disabled={isGeneratingSummary || interviewHistory.length === 0}
              className="px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white font-semibold rounded-lg shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-xl"
            >
              {isGeneratingSummary ? "📝 Generando..." : "📝 Generar Feedback"}
            </button>
          )}
        </div>

        {summary && (
          <div className="mt-8 space-y-6">
            <div className="p-6 bg-purple-900/30 border border-purple-700 rounded-lg">
              <h3 className="text-purple-300 font-semibold mb-3 flex items-center">
                📊 Resumen de la Entrevista
              </h3>
              <div className="text-white text-base leading-relaxed bg-gray-800/50 p-4 rounded-lg prose prose-invert max-w-none">
                <ReactMarkdown
                  components={{
                    strong: ({children}) => <strong className="font-bold text-purple-100">{children}</strong>,
                    p: ({children}) => <p className="mb-3 last:mb-0">{children}</p>,
                    ul: ({children}) => <ul className="list-disc list-inside mb-3 space-y-1">{children}</ul>,
                    ol: ({children}) => <ol className="list-decimal list-inside mb-3 space-y-1">{children}</ol>,
                    li: ({children}) => <li className="ml-2">{children}</li>
                  }}
                >
                  {summary}
                </ReactMarkdown>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={sendEmailToCandidate}
                disabled={isSendingEmail}
                className="flex-1 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-xl"
              >
                {isSendingEmail ? "📧 Enviando..." : "📧 Enviar Feedback por Email"}
              </button>

              <button
                onClick={restartInterview}
                className="flex-1 px-6 py-3 bg-green-600 hover:bg-green-500 text-white font-semibold rounded-lg shadow-lg transition-all duration-200 hover:shadow-xl flex items-center justify-center gap-2"
              >
                <ArrowPathIcon className="h-5 w-5" />
                Reiniciar Entrevista
              </button>
            </div>
          </div>
        )}

        {isInterviewFinished && !summary && (
          <div className="mt-6">
            <button
              onClick={restartInterview}
              className="w-full px-6 py-3 bg-green-600 hover:bg-green-500 text-white font-semibold rounded-lg shadow-lg transition-all duration-200 hover:shadow-xl flex items-center justify-center gap-2"
            >
              <ArrowPathIcon className="h-5 w-5" />
              Reiniciar Entrevista
            </button>
          </div>
        )}

        {showConfirm && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50 p-4">
            <div className="bg-gray-800 p-6 rounded-xl shadow-xl text-center max-w-sm w-full border border-gray-700">
              <h3 className="text-white text-lg font-bold mb-3">¿Finalizar entrevista?</h3>
              <p className="text-gray-300 mb-4 text-sm">
                Esta acción no se puede deshacer. Asegúrate de haber completado todas las preguntas.
              </p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => setShowConfirm(false)}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded-lg text-white transition flex-1"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleConfirm}
                  disabled={loading}
                  className="px-4 py-2 bg-red-600 hover:bg-red-500 rounded-lg text-white transition flex-1 disabled:opacity-50"
                >
                  {loading ? "Finalizando..." : "Sí, finalizar"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
