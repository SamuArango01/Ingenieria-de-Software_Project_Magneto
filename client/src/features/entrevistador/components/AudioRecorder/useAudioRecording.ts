// src/app/(Dashboard)/entrevistador/components/AudioRecorder/useAudioRecording.ts
import { useRef, useState, useCallback } from 'react';

interface UseAudioRecordingProps {
  isRecording: boolean;
  isProcessing: boolean;
  isInterviewFinished: boolean;
  onRecordingStart: () => void;
  onRecordingStop: () => void;
  onAudioProcessed: (audioBlob: Blob) => void;
  onError: (error: string) => void;
}

export const useAudioRecording = ({
  isRecording,
  isProcessing,
  isInterviewFinished,
  onRecordingStart,
  onRecordingStop,
  onAudioProcessed,
  onError
}: UseAudioRecordingProps) => {
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const lastAudioBlobRef = useRef<Blob | null>(null);

  const requestMicrophonePermission = async (): Promise<MediaStream | null> => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 16000,
        } 
      });
      setHasPermission(true);
      streamRef.current = stream;
      return stream;
    } catch (err) {
      console.error('Error al acceder al micrófono:', err);
      setHasPermission(false);
      onError("Permiso de micrófono denegado. Por favor, permite el acceso al micrófono.");
      return null;
    }
  };

  const cleanup = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => {
        track.stop();
      });
      streamRef.current = null;
    }
    mediaRecorderRef.current = null;
    chunksRef.current = [];
  }, []);

  const startRecording = async () => {
    console.log("🎤 Intentando iniciar grabación...");
    
    if (isInterviewFinished) {
      onError("La entrevista ya fue finalizada.");
      return;
    }

    if (isProcessing) {
      onError("Ya se está procesando una grabación.");
      return;
    }

    // Limpiar cualquier grabación anterior
    cleanup();

    const stream = await requestMicrophonePermission();
    if (!stream) return;

    try {
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        if (chunksRef.current.length > 0) {
          const audioBlob = new Blob(chunksRef.current, { 
            type: 'audio/webm;codecs=opus' 
          });
          
          // Guardar el último blob para referencia
          lastAudioBlobRef.current = audioBlob;
          
          // Llamar al callback con el blob de audio
          onAudioProcessed(audioBlob);
        } else {
          console.warn('⚠️ No se capturó audio');
          onError("No se capturó audio. Por favor, intenta nuevamente.");
        }
        
        // Limpiar recursos
        cleanup();
      };

      mediaRecorder.onerror = (event) => {
        onError("Error durante la grabación de audio");
        cleanup();
      };

      // Iniciar grabación
      mediaRecorder.start();
      
      // Notificar al componente padre
      onRecordingStart();
      
    } catch (err) {
      onError("Error al iniciar la grabación");
      cleanup();
    }
  };

  const stopRecording = useCallback(() => {
    
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
      onRecordingStop();
    } else {
      console.warn('⚠️ No hay grabación activa para detener');
    }
  }, [onRecordingStop]);

  
  const stopRecordingAndProcess = useCallback(() => {
 
    
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
      onRecordingStop();
    } else {
      console.warn('⚠️ No hay grabación activa para detener automáticamente');
    }
  }, [onRecordingStop]);


  const getLastAudioBlob = useCallback(() => {
    return lastAudioBlobRef.current;
  }, []);

  const handleMicrophoneClick = useCallback(() => {

    if (isProcessing) {
      console.log('⏳ No se puede grabar, ya se está procesando');
      return;
    }

    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  }, [isRecording, isProcessing, stopRecording]);

  return {
    handleMicrophoneClick,
    hasPermission,
    stopRecording,
    stopRecordingAndProcess,
    getLastAudioBlob
  };
};