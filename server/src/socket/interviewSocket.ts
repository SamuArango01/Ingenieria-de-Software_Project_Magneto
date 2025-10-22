// server/src/socket/interviewSocket.ts
import { Server, Socket } from 'socket.io';
import { Server as HTTPServer } from 'http';
import { analyzeCandidateSpeech } from '../../helpers/TranscribeAudio';
import { generateContent } from '../../helpers/GenerateContent';
import { AppDataSource } from '@/database/data-source';
import { InterviewType } from '@/modules/interview-types/entities/InterviewType';
import fs from 'fs';

interface AudioChunkData {
  chunk: ArrayBuffer;
  interviewId: string;
  interviewTypeId?: number;
}

interface AudioEndData {
  interviewId: string;
  interviewTypeId?: number;
}

export function setupInterviewSocket(httpServer: HTTPServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL || 'http://localhost:3000',
      methods: ['GET', 'POST'],
      credentials: true
    },
    maxHttpBufferSize: 25e6, // 25MB
    pingTimeout: 60000,
    pingInterval: 25000
  });

  // Namespace para entrevistas
  const interviewNamespace = io.of('/interview');

  interviewNamespace.on('connection', (socket: Socket) => {
    console.log(`✅ Client connected: ${socket.id}`);

    let audioChunks: Buffer[] = [];

    // Recibe chunks de audio
    socket.on('audio:chunk', async (data: AudioChunkData) => {
      try {
        const chunk = Buffer.from(data.chunk);
        audioChunks.push(chunk);

        socket.emit('audio:chunk:ack', {
          chunkNumber: audioChunks.length,
          totalSize: audioChunks.reduce((sum, c) => sum + c.length, 0)
        });
      } catch (error) {
        console.error('❌ Error processing audio chunk:', error);
        socket.emit('error', {
          message: 'Error al procesar chunk de audio',
          type: 'audio_chunk_error'
        });
      }
    });

    // Procesa audio completo
    socket.on('audio:end', async (data: AudioEndData) => {
      try {
        if (audioChunks.length === 0) {
          socket.emit('error', {
            message: 'No se recibieron chunks de audio',
            type: 'no_audio_data'
          });
          return;
        }

        const completeAudioBuffer = Buffer.concat(audioChunks);

        socket.emit('processing:start', {
          step: 'transcription',
          message: 'Transcribiendo audio...'
        });

        // PARALELIZACIÓN: Transcripción + Contexto
        const [transcriptionResult, interviewContext] = await Promise.all([
          analyzeCandidateSpeechFromBuffer(completeAudioBuffer),
          data.interviewTypeId
            ? AppDataSource.getRepository(InterviewType).findOne({
                where: { id: data.interviewTypeId }
              })
            : Promise.resolve(null)
        ]);

        // Envía transcripción inmediatamente
        socket.emit('transcription:complete', {
          text: transcriptionResult.text,
          metrics: transcriptionResult.candidateMetrics
        });

        socket.emit('processing:start', {
          step: 'ai_generation',
          message: 'Generando respuesta...'
        });

        // Construye prompt
        const aiPrompt = buildAIPrompt(
          transcriptionResult.text,
          interviewContext
        );

        // Genera respuesta con Gemini (helper ya existente)
        const fullAIResponse = await generateContent(aiPrompt);

        // Envía la respuesta completa (sin streaming simulado)
        socket.emit('ai:response:complete', {
          text: fullAIResponse
        });

        socket.emit('processing:complete', {
          transcript: transcriptionResult.text,
          aiResponse: fullAIResponse,
          candidateMetrics: transcriptionResult.candidateMetrics,
          success: true
        });

        audioChunks = [];

      } catch (error: any) {
        console.error('❌ Error processing audio:', error);
        socket.emit('error', {
          message: error.message || 'Error al procesar audio',
          type: 'processing_error'
        });
        audioChunks = [];
      }
    });

    socket.on('audio:cancel', () => {
      audioChunks = [];
      socket.emit('audio:cancelled', { message: 'Grabación cancelada' });
    });

    socket.on('disconnect', (reason) => {
      console.log(`❌ Client disconnected: ${socket.id}, reason: ${reason}`);
      audioChunks = [];
    });
  });

  return io;
}

// Helper: Analiza audio desde Buffer
async function analyzeCandidateSpeechFromBuffer(audioBuffer: Buffer) {
  // Usa la carpeta uploads que ya existe en el servidor
  const tempPath = `uploads/temp_${Date.now()}.webm`;

  try {
    // Escribe el buffer como archivo temporal
    fs.writeFileSync(tempPath, audioBuffer);

    // Usa el helper existente que ya maneja Deepgram
    const result = await analyzeCandidateSpeech(tempPath);

    // Limpia el archivo temporal
    fs.unlinkSync(tempPath);

    return result;
  } catch (error) {
    // Asegura limpieza incluso si hay error
    if (fs.existsSync(tempPath)) {
      fs.unlinkSync(tempPath);
    }
    throw error;
  }
}

// Helper: Construye prompt
function buildAIPrompt(
  candidateResponse: string,
  interviewType: InterviewType | null
): string {
  const typeContext = interviewType
    ? `Tipo de entrevista: ${interviewType.description}`
    : '';

  return `Eres un asistente de entrevistas de IA.
${typeContext}

Basándote en esta respuesta del candidato: "${candidateResponse}"

Proporciona una breve pregunta de seguimiento profesional o comentario en español.
Sé conciso (máximo 2-3 oraciones).`;
}

