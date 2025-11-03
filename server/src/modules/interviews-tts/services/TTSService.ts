import textToSpeech from "@google-cloud/text-to-speech";
import { Readable } from "stream";

export class TTSService {
    private client: textToSpeech.TextToSpeechClient;

    constructor() {
        // Initialize Google Cloud TTS client
        // It will use GOOGLE_APPLICATION_CREDENTIALS env variable or default credentials
        this.client = new textToSpeech.TextToSpeechClient({
            apiKey: process.env.GOOGLE_API_KEY // Reuse same API key as Gemini if available
        });
    }

    /**
     * Convert text to speech and return audio buffer
     * @param text Text to convert to speech
     * @returns Audio buffer in MP3 format
     */
    public async textToSpeech(text: string): Promise<Buffer> {
        try {
            const request = {
                input: { text },
                voice: {
                    languageCode: "es-US", // Spanish (US)
                    name: "es-US-Neural2-A", // High-quality neural voice
                    ssmlGender: textToSpeech.protos.google.cloud.texttospeech.v1.SsmlVoiceGender.NEUTRAL
                },
                audioConfig: {
                    audioEncoding: textToSpeech.protos.google.cloud.texttospeech.v1.AudioEncoding.MP3,
                    speakingRate: 1.0, // Normal speed
                    pitch: 0.0 // Normal pitch
                }
            };

            const [response] = await this.client.synthesizeSpeech(request);

            if (!response.audioContent) {
                throw new Error("No audio content in TTS response");
            }

            // Convert Uint8Array to Buffer
            return Buffer.from(response.audioContent as Uint8Array);
        } catch (error) {
            console.error("TTS error:", error);
            throw new Error("Failed to convert text to speech");
        }
    }

    /**
     * Convert text to speech and return as a readable stream
     * Useful for streaming audio directly to client
     */
    public async textToSpeechStream(text: string): Promise<Readable> {
        const audioBuffer = await this.textToSpeech(text);
        return Readable.from(audioBuffer);
    }

    /**
     * Convert text to speech and return as base64 string
     * Useful for sending via WebSocket
     */
    public async textToSpeechBase64(text: string): Promise<string> {
        const audioBuffer = await this.textToSpeech(text);
        return audioBuffer.toString('base64');
    }
}
