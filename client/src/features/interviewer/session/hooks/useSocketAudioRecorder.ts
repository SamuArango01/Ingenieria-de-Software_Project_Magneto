// client/src/features/interviewer/session/hooks/useSocketAudioRecorder.ts
import { useState, useRef, useCallback, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import type { CandidateMetrics } from '../models/session.model';

interface ProcessingResult {
  text: string;
  aiResponse: string;
  candidateMetrics: CandidateMetrics;
  success: boolean;
  provider: string;
}

interface UseSocketAudioRecorderProps {
  interviewTypeId?: number;
  enabled?: boolean;
}

export function useSocketAudioRecorder({
  interviewTypeId,
  enabled = true
}: UseSocketAudioRecorderProps = {}) {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState<string>('');
  const [lastResult, setLastResult] = useState<ProcessingResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const socketRef = useRef<Socket | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Inicializa Socket.IO
  useEffect(() => {
    if (!enabled) return;

    const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') || 'http://localhost:3211';

    socketRef.current = io(`${SOCKET_URL}/interview`, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
    });

    const socket = socketRef.current;

    socket.on('connect', () => {
      console.log('✅ Socket.IO conectado');
      setError(null);
    });

    socket.on('disconnect', (reason) => {
      console.log('❌ Socket.IO desconectado:', reason);
    });

    socket.on('audio:chunk:ack', (data) => {
      console.log(`📦 Chunk ${data.chunkNumber} recibido`);
    });

    socket.on('processing:start', (data) => {
      console.log(`⚙️ ${data.message}`);
      setProcessingStep(data.message);
    });

    socket.on('transcription:complete', (data) => {
      console.log('📝 Transcripción completa');
    });

    socket.on('ai:response:complete', (data) => {
      console.log('🤖 Respuesta IA completa');
    });

    socket.on('processing:complete', (result: ProcessingResult) => {
      console.log('✅ Todo procesado:', result);
      setIsProcessing(false);
      setProcessingStep('');
      setLastResult(result);
      setError(null);
    });

    socket.on('error', (err) => {
      console.error('❌ Error Socket:', err);
      setIsProcessing(false);
      setProcessingStep('');
      setError(err.message || 'Error en el procesamiento');
      setLastResult(null);
    });

    socket.on('audio:cancelled', (data) => {
      console.log('🚫 Grabación cancelada');
      setIsProcessing(false);
      setProcessingStep('');
    });

    return () => {
      socket.disconnect();
    };
  }, [enabled]);

  // Inicia grabación
  const startRecording = useCallback(async () => {
    try {
      setError(null);
      audioChunksRef.current = [];

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100
        }
      });

      streamRef.current = stream;

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });

      mediaRecorderRef.current = mediaRecorder;

      // Acumula chunks localmente
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        console.log('🛑 Grabación detenida, enviando audio...');

        if (audioChunksRef.current.length === 0) {
          setError('No se grabó audio');
          return;
        }

        // Combina todos los chunks en un solo Blob
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });

        if (socketRef.current?.connected) {
          setIsProcessing(true);

          // Convierte a ArrayBuffer y envía en chunks
          const arrayBuffer = await audioBlob.arrayBuffer();
          const chunkSize = 64 * 1024; // 64KB por chunk
          const totalChunks = Math.ceil(arrayBuffer.byteLength / chunkSize);

          for (let i = 0; i < totalChunks; i++) {
            const start = i * chunkSize;
            const end = Math.min(start + chunkSize, arrayBuffer.byteLength);
            const chunk = arrayBuffer.slice(start, end);

            socketRef.current.emit('audio:chunk', {
              chunk,
              interviewId: Date.now().toString(), // Temporal ID único
              interviewTypeId
            });
          }

          // Señal de audio completo
          socketRef.current.emit('audio:end', {
            interviewId: Date.now().toString(),
            interviewTypeId
          });
        } else {
          setError('Socket desconectado');
        }

        // Limpia stream
        stream.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
        audioChunksRef.current = [];
      };

      // Graba en chunks de 1 segundo
      mediaRecorder.start(1000);
      setIsRecording(true);

      console.log('🎤 Grabación iniciada');

    } catch (error) {
      console.error('Error al iniciar grabación:', error);
      setError('No se pudo acceder al micrófono');
      setIsRecording(false);
    }
  }, [interviewTypeId]);

  // Detiene grabación
  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  }, []);

  // Reinicia el estado
  const reset = useCallback(() => {
    setLastResult(null);
    setError(null);
    setProcessingStep('');
    audioChunksRef.current = [];
  }, []);

  return {
    isRecording,
    isProcessing,
    processingStep,
    result: lastResult,
    error,
    startRecording,
    stopRecording,
    reset,
    isConnected: socketRef.current?.connected || false
  };
}
