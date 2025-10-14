// src/app/(Dashboard)/entrevistador/components/AudioRecorder/AudioRecorder.tsx
import { MicrophoneIcon } from "@heroicons/react/24/solid";
import { useAudioRecording } from './useAudioRecording';
import { forwardRef, useImperativeHandle } from 'react';

interface AudioRecorderProps {
  isRecording: boolean;
  isProcessing: boolean;
  isInterviewFinished: boolean;
  onRecordingStart: () => void;
  onRecordingStop: () => void;
  onAudioProcessed: (result: any) => void;
  onError: (error: string) => void;
}

export interface AudioRecorderHandle {
  stopRecordingAndProcess: () => void;
  getLastAudioBlob: () => Blob | null;
}

export const AudioRecorder = forwardRef<AudioRecorderHandle, AudioRecorderProps>(
  ({
    isRecording,
    isProcessing,
    isInterviewFinished,
    onRecordingStart,
    onRecordingStop,
    onAudioProcessed,
    onError
  }, ref) => {
    
    const { 
      handleMicrophoneClick, 
      hasPermission, 
      stopRecordingAndProcess,
      getLastAudioBlob 
    } = useAudioRecording({
      isRecording,
      isProcessing,
      isInterviewFinished,
      onRecordingStart,
      onRecordingStop,
      onAudioProcessed,
      onError
    });

    // Exponer métodos al componente padre
    useImperativeHandle(ref, () => ({
      stopRecordingAndProcess,
      getLastAudioBlob
    }));

    return (
      <div className="flex flex-col items-center space-y-6">
        <button
          type="button"
          onClick={handleMicrophoneClick}
          disabled={isInterviewFinished || isProcessing}
          className={`
            relative p-8 rounded-full transition-all duration-300 transform
            ${
              isProcessing
                ? "bg-purple-500/80 cursor-not-allowed"
                : isRecording
                  ? "bg-red-500 hover:bg-red-400 animate-pulse"
                  : "bg-emerald-500 hover:bg-emerald-400 hover:scale-105"
            }
            ${(isInterviewFinished || isProcessing) ? "opacity-90 cursor-not-allowed" : ""}
            shadow-lg hover:shadow-xl backdrop-blur-sm
          `}
        >
          {isProcessing ? (
         
            <div className="h-16 w-16 flex items-center justify-center">
              <div className="relative">
                <div className="h-12 w-12 rounded-full border-2 border-white/20"></div>
                <div className="absolute top-0 left-0 h-12 w-12 rounded-full border-2 border-transparent border-t-white border-r-white animate-spin"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-1 w-1 bg-white/60 rounded-full"></div>
              </div>
            </div>
          ) : (
            
            <MicrophoneIcon className="h-16 w-16 text-white" />
          )}
          
          {isRecording && !isProcessing && (
            <div className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-40"></div>
          )}
        </button>

        <div className="text-center">
          <p className="text-xl font-semibold text-white mb-2">
            {isProcessing 
              ? 'Procesando...' 
              : isRecording 
                ? 'Grabando...' 
                : isInterviewFinished
                  ? 'Finalizada'
                  : 'Hablar'
            }
          </p>
          <p className="text-gray-300 text-sm">
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

        {hasPermission === false && (
          <div className="p-4 bg-yellow-900/30 border border-yellow-700 rounded-lg">
            <p className="text-yellow-200 text-sm">
              🎤 Necesitas permitir el acceso al micrófono para continuar
            </p>
          </div>
        )}
      </div>
    );
  }
);

AudioRecorder.displayName = 'AudioRecorder';