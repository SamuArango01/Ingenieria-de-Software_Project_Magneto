# TTS Streaming Mode Documentation

## 📊 Overview

El sistema de entrevistas por voz soporta **dos modos de operación**:

1. **Modo No-Streaming (Por defecto)** - Respuesta completa de una vez
2. **Modo Streaming (Experimental)** - Respuesta incremental en tiempo real

## 🎯 Diferencias entre Modos

### Modo No-Streaming (Default)

```
Usuario habla → Transcripción → Gemini genera respuesta completa
→ Deepgram TTS genera audio completo → Usuario escucha
```

**Características:**
- ✅ Estable y probado
- ✅ Audio de alta calidad (sin interrupciones)
- ✅ Manejo de errores robusto
- ⚠️ Latencia mayor (~3-6 segundos)
- ⚠️ Usuario espera la respuesta completa

**Eventos WebSocket:**
- `processing` - Estado de procesamiento
- `transcription` - Transcripción del usuario
- `ai_response` - Respuesta completa de AI con audio

### Modo Streaming (Experimental)

```
Usuario habla → Transcripción → Gemini stream de chunks
→ Deepgram TTS por oraciones → Usuario empieza a escuchar antes
```

**Características:**
- ✅ Latencia percibida menor (~1-2 segundos)
- ✅ Usuario empieza a escuchar mientras AI aún genera
- ✅ Experiencia más natural/conversacional
- ⚠️ Experimental (puede tener bugs)
- ⚠️ Posibles interrupciones de audio entre chunks

**Eventos WebSocket:**
- `processing` - Estado de procesamiento
- `transcription` - Transcripción del usuario
- `ai_text_chunk` - Chunk de texto de AI (streaming)
- `ai_audio_chunk` - Chunk de audio correspondiente (streaming)
- `ai_response_complete` - Señal de que stream terminó

## 🔧 Configuración

### Variables de Entorno

Agregar a `server/.env`:

```bash
# TTS Streaming Mode
# Valores: "true" (activar streaming) | "false" o ausente (modo normal)
TTS_STREAMING_MODE=false
```

### Activar Streaming

```bash
# En server/.env
TTS_STREAMING_MODE=true
```

### Desactivar Streaming (Volver a modo normal)

```bash
# En server/.env
TTS_STREAMING_MODE=false

# O simplemente comentar/eliminar la variable:
# TTS_STREAMING_MODE=true
```

## 🧪 Testing

### Probar Modo No-Streaming

1. Asegúrate que `TTS_STREAMING_MODE=false` o no está definido
2. Reinicia el servidor: `bun run dev`
3. Verifica en consola:
   ```
   [Socket.IO] Streaming mode DISABLED for user: user_xxx
   ```
4. Inicia entrevista y habla
5. Observa que la respuesta llega completa de una vez

### Probar Modo Streaming

1. Configura `TTS_STREAMING_MODE=true`
2. Reinicia el servidor: `bun run dev`
3. Verifica en consola:
   ```
   [Socket.IO] Streaming mode ENABLED for user: user_xxx
   ```
4. Inicia entrevista y habla
5. Observa que la respuesta llega por chunks

## 📱 Cliente (Frontend)

El cliente actual **solo soporta modo no-streaming**. Para soportar streaming, necesitas:

### Cambios requeridos en el cliente

```typescript
// Escuchar eventos de streaming
socket.on("ai_text_chunk", (data) => {
  // Mostrar texto incrementalmente
  console.log("Text chunk:", data.text);
});

socket.on("ai_audio_chunk", (data) => {
  // Reproducir audio incrementalmente
  playAudioFromBase64(data.audio);
});

socket.on("ai_response_complete", (data) => {
  // Respuesta completa, verificar si debe terminar
  if (data.shouldEnd) {
    // Manejar fin de entrevista
  }
});
```

### Estado actual del cliente

El cliente en `client/src/features/interviewer-tts/session/` **solo escucha `ai_response`** (modo no-streaming).

**Por ahora, mantén `TTS_STREAMING_MODE=false` hasta actualizar el cliente.**

## 🏗️ Arquitectura del Streaming

### Flujo de Datos (Modo Streaming)

```
1. Usuario habla
   ↓
2. Deepgram STT transcribe (~300ms)
   ↓
3. Gemini stream inicia
   ↓
4. Por cada chunk de Gemini:
   ├─ Acumula hasta tener oración completa
   ├─ Envía texto al cliente (ai_text_chunk)
   └─ Genera audio con Deepgram TTS (~200ms por oración)
      └─ Envía audio al cliente (ai_audio_chunk)
   ↓
5. Gemini termina stream
   ↓
6. Parsea JSON completo (shouldEnd, reason, etc.)
   ↓
7. Envía ai_response_complete
```

### Ventajas del Streaming por Oraciones

En lugar de enviar cada palabra, el sistema:

1. **Acumula chunks** hasta encontrar `.` `!` `?`
2. **Sintetiza oraciones completas** (mejor calidad de audio)
3. **Reduce llamadas a Deepgram TTS** (más eficiente)
4. **Audio más natural** (pausas naturales entre oraciones)

## 🔍 Debugging

### Logs del Servidor

```bash
# Ver modo activo
[Socket.IO] Streaming mode ENABLED/DISABLED for user: xxx

# Ver chunks en streaming (solo si TTS_STREAMING_MODE=true)
# (Agregar console.log en handleAudioMessageStream si necesario)
```

### Errores Comunes

#### Error: "ai_text_chunk is not a function"
**Causa:** Cliente no escucha eventos de streaming
**Solución:** Actualizar cliente o mantener `TTS_STREAMING_MODE=false`

#### Audio entrecortado
**Causa:** Chunks muy pequeños, múltiples llamadas TTS
**Solución:** Sistema ya usa buffer de oraciones completas

#### Respuesta no termina
**Causa:** Cliente no maneja `ai_response_complete`
**Solución:** Actualizar cliente para escuchar evento de completado

## 📊 Performance Comparison

| Métrica | No-Streaming | Streaming |
|---------|--------------|-----------|
| Latencia percibida | 3-6s | 1-2s ⚡ |
| Latencia real | 3-6s | 3-6s (igual) |
| Calidad de audio | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| Experiencia UX | Espera | Inmediata ⚡ |
| Estabilidad | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ (experimental) |
| Complejidad cliente | Baja | Alta |

## 🚀 Recomendaciones

### Para Producción (Ahora)
```bash
TTS_STREAMING_MODE=false
```
- ✅ Estable y probado
- ✅ Cliente ya implementado
- ✅ Sin cambios necesarios

### Para Experimentar (Futuro)
```bash
TTS_STREAMING_MODE=true
```
- ⚠️ Requiere actualizar cliente
- ⚠️ Testing extensivo requerido
- ✅ Mejor experiencia de usuario

## 🔄 Rollback

Si streaming causa problemas, simplemente:

1. Cambiar `TTS_STREAMING_MODE=false`
2. Reiniciar servidor
3. Todo vuelve a modo normal

**No se requieren cambios de código, solo variable de entorno.**

## 📝 Notas Técnicas

### Implementación Streaming

- **Gemini Streaming:** `generateContentStream()` usa `models.generateContentStream()`
- **Buffer de Oraciones:** Regex `/[.!?]\s/` detecta fin de oración
- **TTS Incremental:** Cada oración completa se sintetiza inmediatamente
- **Metadata:** JSON se parsea al final del stream completo

### Coexistencia de Modos

Ambos métodos coexisten en el código:
- `handleAudioMessage()` - Modo no-streaming
- `handleAudioMessageStream()` - Modo streaming

La selección se hace en `setupEventHandlers()` basándose en `TTS_STREAMING_MODE`.

### Backward Compatibility

✅ 100% compatible hacia atrás
- Cliente existente funciona sin cambios
- Solo usar streaming si cliente lo soporta
- Default siempre es modo no-streaming

---

**Última actualización:** 2025-11-04
**Versión:** 1.0.0
**Estado:** Streaming es experimental, no-streaming es estable
