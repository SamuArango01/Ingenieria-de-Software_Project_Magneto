# Voice-to-Voice Interview System Setup

Sistema de entrevistas por voz en tiempo real usando WebSockets, Deepgram (STT) y Google Cloud TTS.

## Requisitos Previos

1. **Deepgram API Key** (ya configurada en `.env`)
2. **Google Cloud API Key** (ya configurada para Gemini, se reutiliza para TTS)
3. **Clerk Account** (ya configurado)

## Variables de Entorno

### Server (`/server/.env`)

Asegúrate de tener estas variables configuradas:

```bash
# Ya configuradas
DEEPGRAM_API_KEY=your_deepgram_key
GOOGLE_API_KEY=your_google_api_key
CLERK_SECRET_KEY=your_clerk_secret
CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key

# Base de datos
DB_USER=user
DB_PASSWORD=password
DB_NAME=magneto
DB_HOST=localhost
DB_PORT=5432
```

### Client (`/client/.env.local`)

```bash
# Ya configuradas
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# URL del servidor (opcional, default: http://localhost:3211)
NEXT_PUBLIC_API_URL=http://localhost:3211
```

## Instalación

Las dependencias ya están instaladas:

**Server:**
- `socket.io@4.8.1`
- `@google-cloud/text-to-speech@6.4.0`

**Client:**
- `socket.io-client` (ya instalado)

## Ejecutar el Sistema

### 1. Iniciar Base de Datos

```bash
cd server
docker compose up -d
```

### 2. Iniciar Server

```bash
cd server
bun run dev
```

El servidor se iniciará en `http://localhost:3211` con soporte para WebSocket en el namespace `/interviews-tts`.

### 3. Iniciar Client

```bash
cd client
npm run dev
```

El cliente estará en `http://localhost:3000`.

## Uso del Sistema

### Flujo Completo

1. **Ir a Init**: Navega a `/entrevistador-tts/init`
2. **Comenzar**: Click en "Comenzar Entrevista"
3. **Session**:
   - Click en el micrófono para empezar a grabar
   - Click de nuevo para enviar el audio
   - La IA transcribe, procesa y responde con voz
   - Timer de 10 minutos en la esquina superior derecha
4. **Finalización**:
   - La IA decide automáticamente cuándo terminar (basado en temas cubiertos y calidad)
   - O usuario puede hacer click en "Finalizar Entrevista"
5. **Summary**: Redirección automática a página de resumen

## Arquitectura

### Backend

```
server/src/modules/interviews-tts/
├── entities/
│   ├── InterviewTTS.ts          # Sesión de entrevista
│   └── InterviewTTSMessage.ts   # Historial de mensajes
├── services/
│   ├── InterviewTTSService.ts   # Lógica de negocio
│   ├── DeepgramStreamService.ts # Transcripción STT
│   └── TTSService.ts            # Text-to-speech
├── controllers/
│   └── InterviewTTSSocketController.ts  # Manejo de eventos WebSocket
└── repositories/
    └── ...
```

### Frontend

```
client/src/features/interviewer-tts/
├── contexts/
│   └── InterviewTTSContext.tsx  # Estado global
├── session/
│   ├── hooks/
│   │   ├── useSocketConnection.ts
│   │   ├── useAudioRecorder.ts
│   │   └── useAudioPlayback.ts
│   └── components/
│       └── VoiceVisualizer.tsx
└── pages: init, session, summary
```

## Eventos WebSocket

### Client → Server

- `start_interview`: Iniciar sesión
- `audio_message`: Enviar audio grabado (base64)
- `end_interview`: Finalizar manualmente

### Server → Client

- `interview_started`: Confirmación + audio inicial de IA
- `processing`: Estado de procesamiento
- `transcription`: Texto transcrito del usuario
- `ai_response`: Respuesta de IA con audio
- `interview_ended`: Entrevista finalizada
- `error`: Errores

## Características

✅ Conversación voz-a-voz en tiempo real
✅ IA decide cuándo finalizar basada en temas cubiertos y calidad
✅ Límite de tiempo de 10 minutos
✅ Grabación toggle (click para iniciar/detener)
✅ Interfaz minimalista con componentes shadcn
✅ Autenticación con Clerk
✅ Persistencia completa en base de datos
✅ Coexiste con sistema de entrevistas HTTP existente

## Debugging

### Ver logs del servidor

```bash
cd server
bun run dev
```

Busca logs de:
- `[Socket.IO] User connected`
- `Interview started: {id}`
- Errores de Deepgram o TTS

### Ver logs del cliente

Abre DevTools del navegador y revisa:
- Console logs de conexión Socket.IO
- Network tab para WebSocket connections
- Errores de audio (permisos de micrófono)

## Troubleshooting

**Error: "No se pudo acceder al micrófono"**
- Verifica permisos del navegador
- Usa HTTPS o localhost

**Error: "Socket disconnected"**
- Verifica que el servidor esté corriendo
- Revisa CORS settings en `server/index.ts`
- Verifica token de Clerk

**Error: TTS no funciona**
- Verifica `GOOGLE_API_KEY` en `.env`
- Revisa logs del servidor para errores de Google Cloud TTS

**No se transcribe audio**
- Verifica `DEEPGRAM_API_KEY`
- Revisa formato de audio (debe ser webm)

## Próximas Mejoras

- [ ] Integrar evaluación automática al finalizar
- [ ] Mostrar historial de conversación en UI
- [ ] Agregar soporte para seleccionar tipo de entrevista
- [ ] Implementar página de summary con resultados detallados
- [ ] Agregar visualización de forma de onda en tiempo real
- [ ] Permitir configurar duración de entrevista
