// Ejemplo de uso del hook useSocketAudioRecorder
'use client';

import { useState } from 'react';
import { useSocketAudioRecorder } from '../hooks/useSocketAudioRecorder';

export function SocketInterviewExample() {
  const [interviewId] = useState('interview-123');
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [transcript, setTranscript] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [metrics, setMetrics] = useState<any>(null);

  const {
    isRecording,
    isProcessing,
    processingStep,
    startRecording,
    stopRecording,
    cancelRecording,
    isConnected
  } = useSocketAudioRecorder({
    interviewId,
    interviewTypeId: 1, // Opcional

    // Cuando llega la transcripción
    onTranscriptReceived: (text, candidateMetrics) => {
      setTranscript(text);
      setMetrics(candidateMetrics);
    },

    // Cuando llegan chunks de respuesta IA (streaming)
    onAIResponseChunk: (chunk) => {
      setAiResponse((prev) => prev + chunk);
    },

    // Cuando la respuesta IA está completa
    onAIResponseComplete: (fullResponse) => {
      setCurrentQuestion(fullResponse);
      setAiResponse(''); // Limpia para próxima respuesta
    },

    // Cuando todo el procesamiento termina
    onProcessingComplete: (result) => {
      console.log('Resultado completo:', result);
      // Aquí puedes guardar en tu contexto, estado global, etc.
    },

    // Manejo de errores
    onError: (error) => {
      console.error('Error:', error.message);
      alert(error.message);
    }
  });

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Entrevista con Socket.IO</h1>

      {/* Estado de conexión */}
      <div className="mb-4">
        <span className={`inline-block px-3 py-1 rounded-full text-sm ${
          isConnected ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
        }`}>
          {isConnected ? '✅ Conectado' : '❌ Desconectado'}
        </span>
      </div>

      {/* Pregunta actual */}
      {currentQuestion && (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <h2 className="font-semibold text-blue-900 mb-2">Pregunta:</h2>
          <p className="text-blue-800">{currentQuestion}</p>
        </div>
      )}

      {/* Controles de grabación */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={startRecording}
          disabled={isRecording || isProcessing}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg disabled:bg-gray-400 disabled:cursor-not-allowed hover:bg-blue-700"
        >
          {isRecording ? '🎤 Grabando...' : '🎤 Iniciar Grabación'}
        </button>

        <button
          onClick={stopRecording}
          disabled={!isRecording}
          className="px-6 py-3 bg-red-600 text-white rounded-lg disabled:bg-gray-400 disabled:cursor-not-allowed hover:bg-red-700"
        >
          ⏹️ Detener
        </button>

        <button
          onClick={cancelRecording}
          disabled={!isRecording}
          className="px-6 py-3 bg-gray-600 text-white rounded-lg disabled:bg-gray-400 disabled:cursor-not-allowed hover:bg-gray-700"
        >
          ❌ Cancelar
        </button>
      </div>

      {/* Estado de procesamiento */}
      {isProcessing && (
        <div className="mb-6 p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-500">
          <p className="text-yellow-800 font-semibold">⚙️ {processingStep}</p>
        </div>
      )}

      {/* Transcripción */}
      {transcript && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h2 className="font-semibold text-gray-900 mb-2">Tu respuesta transcrita:</h2>
          <p className="text-gray-700">{transcript}</p>
        </div>
      )}

      {/* Respuesta IA en streaming */}
      {aiResponse && (
        <div className="mb-6 p-4 bg-green-50 rounded-lg">
          <h2 className="font-semibold text-green-900 mb-2">IA está respondiendo:</h2>
          <p className="text-green-800">{aiResponse}</p>
          <span className="inline-block w-2 h-5 bg-green-600 animate-pulse ml-1"></span>
        </div>
      )}

      {/* Métricas */}
      {metrics && (
        <div className="p-4 bg-purple-50 rounded-lg">
          <h2 className="font-semibold text-purple-900 mb-3">Métricas de voz:</h2>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-purple-700">Palabras por minuto:</span>
              <span className="ml-2 font-semibold">{metrics.wordsPerMinute}</span>
            </div>
            <div>
              <span className="text-purple-700">Fluidez:</span>
              <span className="ml-2 font-semibold">{metrics.fluencyScore.toFixed(1)}/100</span>
            </div>
            <div>
              <span className="text-purple-700">Claridad:</span>
              <span className="ml-2 font-semibold">{metrics.clarityScore.toFixed(1)}/100</span>
            </div>
            <div>
              <span className="text-purple-700">Confianza:</span>
              <span className="ml-2 font-semibold">{metrics.confidenceScore.toFixed(1)}/100</span>
            </div>
            <div className="col-span-2">
              <span className="text-purple-700">Muletillas:</span>
              <span className="ml-2 font-semibold">{metrics.fillerWordsCount}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
