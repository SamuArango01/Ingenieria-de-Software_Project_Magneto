// src/app/(Dashboard)/entrevistador/components/ControlButtons/ControlButtons.tsx
import { ArrowPathIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

interface ControlButtonsProps {
  isRecording: boolean;
  isInterviewFinished: boolean;
  interviewHistoryLength: number;
  isGeneratingFeedback: boolean;
  summary: string;
  onFinishInterview: () => void;
  onGenerateCompleteFeedback: () => void;
  onRestartInterview: () => void;
  isEvaluatingLevel: boolean;
  canAdvanceToNextLevel: boolean;
  onAdvanceToNextLevel: () => void;

}

export function ControlButtons({
  isRecording,
  isInterviewFinished,
  interviewHistoryLength,
  isGeneratingFeedback,
  summary,
  onFinishInterview,
  onGenerateCompleteFeedback,
  onRestartInterview,
  isEvaluatingLevel,
  canAdvanceToNextLevel,
  onAdvanceToNextLevel
}: ControlButtonsProps) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    onFinishInterview();
    setLoading(false);
    setShowConfirm(false);
  };

  const hasFeedback = !!summary;

  return (
    <div className="mt-8 flex flex-col space-y-4">
    
      {isEvaluatingLevel && (
        <div className="flex flex-col gap-3">
          <div className="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-lg shadow-lg flex items-center justify-center gap-3">
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Evaluando tu desempeño automáticamente...
          </div>
          <div className="text-center text-sm text-purple-300">
            El sistema está analizando tus respuestas y comunicación
          </div>
        </div>
      )}


      {canAdvanceToNextLevel && (
        <div className="flex flex-col gap-3">
          <button
            onClick={onAdvanceToNextLevel}
            className="w-full px-6 py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-semibold rounded-lg shadow-lg transition-all duration-200 hover:shadow-xl flex items-center justify-center gap-3 animate-pulse"
          >
            🚀 ¡Avanzar al Siguiente Nivel!
          </button>
          <div className="text-center text-sm text-green-400 font-medium">
            ¡Felicidades! Tu desempeño te permite enfrentar preguntas más desafiantes
          </div>
        </div>
      )}

      {!isInterviewFinished && (
        <div className="flex justify-center">
          <button
            onClick={() => setShowConfirm(true)}
            disabled={isRecording || isEvaluatingLevel}
            className={`
              flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold shadow-md transition-all duration-300
              ${isRecording || isEvaluatingLevel
                ? "opacity-50 cursor-not-allowed bg-red-800/40 border border-red-700 text-red-200"
                : "bg-red-600 hover:bg-red-500 text-white hover:shadow-lg"
              }
            `}
          >
            🏁 Finalizar entrevista
          </button>
        </div>
      )}


      {isInterviewFinished && !hasFeedback && !canAdvanceToNextLevel && !isEvaluatingLevel && (
        <div className="flex flex-col gap-3">
          <button
            onClick={onGenerateCompleteFeedback}
            disabled={isGeneratingFeedback || interviewHistoryLength === 0}
            className="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-semibold rounded-lg shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-xl flex items-center justify-center gap-3"
          >
            {isGeneratingFeedback ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generando análisis completo...
              </>
            ) : (
              <>
                📊 Obtener Análisis Completo
              </>
            )}
          </button>

          <div className="text-center text-sm text-gray-400">
            Evaluación integrada de contenido y comunicación verbal
          </div>
        </div>
      )}

  
      {isInterviewFinished && hasFeedback && (
        <div className="flex justify-center">
          <button
            onClick={onRestartInterview}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg shadow-md transition-all duration-300 hover:shadow-lg"
          >
            <ArrowPathIcon className="w-5 h-5" />
            Reiniciar Entrevista
          </button>
        </div>
      )}

      {showConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50 p-4">
          <div className="bg-gray-800 p-6 rounded-xl shadow-xl text-center max-w-sm w-full border border-gray-700">
            <h3 className="text-white text-lg font-bold mb-3">¿Finalizar entrevista?</h3>
            <p className="text-gray-300 mb-4 text-sm">
              Una vez finalizada, el sistema evaluará automáticamente tu desempeño 
              y determinará si puedes avanzar al siguiente nivel.
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
  );
}