import { createClient } from "@deepgram/sdk";
import { Readable } from "stream";
import {
  ITTSService,
  TTSVoiceConfig,
  TTSAudioConfig,
} from "../interfaces/ITTSService";

/**
 * Deepgram Text-to-Speech Service Implementation
 *
 * Uses Deepgram's Aura TTS API for high-quality, low-latency speech synthesis
 * Optimized for real-time interview scenarios with Spanish language support
 */
export class DeepgramTTSService implements ITTSService {
  private deepgram: ReturnType<typeof createClient>;

  constructor() {
    const apiKey = process.env.DEEPGRAM_API_KEY;
    if (!apiKey) {
      throw new Error("DEEPGRAM_API_KEY is not set in environment variables");
    }
    this.deepgram = createClient(apiKey);
  }

  /**
   * Map generic voice config to Deepgram-specific model
   * Default: aura-2-carina-es (Spanish Peninsular neutral/feminine voice)
   */
  private getDeepgramModel(voiceConfig?: TTSVoiceConfig): string {
    // Default to Spanish neutral voice (Aura-2)
    const defaultModel = "aura-2-carina-es";

    if (!voiceConfig) {
      return defaultModel;
    }

    // Map language codes to appropriate Deepgram Aura-2 models
    const { languageCode, gender } = voiceConfig;

    // Spanish models (Aura-2)
    if (languageCode?.startsWith("es")) {
      // Deepgram Aura-2 Spanish models:
      // Feminine voices:
      // - aura-2-carina-es (Peninsular, neutral/default)
      // - aura-2-celeste-es (Colombian, energetic)
      // - aura-2-diana-es (Peninsular, code-switching EN/ES)
      // - aura-2-selena-es (Latin American, code-switching EN/ES)
      // - aura-2-estrella-es (Mexican)
      //
      // Masculine voices:
      // - aura-2-nestor-es (Peninsular, calm)
      // - aura-2-alvaro-es (Peninsular)
      // - aura-2-aquila-es (Latin American, code-switching EN/ES)
      // - aura-2-sirio-es (Mexican)
      // - aura-2-javier-es (Mexican/Latin American, code-switching EN/ES)

      if (gender === "FEMALE") {
        return "aura-2-carina-es"; // Peninsular, neutral
      } else if (gender === "MALE") {
        return "aura-2-nestor-es"; // Peninsular, calm
      }
      return defaultModel; // neutral/feminine
    }

    // Fallback to English Aura-2 if language not Spanish
    if (gender === "FEMALE") {
      return "aura-2-thalia-en"; // American feminine
    } else if (gender === "MALE") {
      return "aura-2-apollo-en"; // American masculine
    }
    return "aura-2-helena-en"; // American feminine default
  }

  /**
   * Convert text to speech and return audio as Buffer
   */
  async textToSpeech(
    text: string,
    voiceConfig?: TTSVoiceConfig,
    audioConfig?: TTSAudioConfig
  ): Promise<Buffer> {
    try {
      const model = this.getDeepgramModel(voiceConfig);
      const encoding = audioConfig?.encoding?.toLowerCase() || "mp3";

      const response = await this.deepgram.speak.request(
        { text },
        {
          model,
          encoding: encoding as "mp3" | "wav" | "ogg" | "linear16",
          // Deepgram doesn't support pitch/rate in the same way
          // These would need custom post-processing if required
        }
      );

      // Get the audio stream and convert to buffer
      const stream = await response.getStream();
      if (!stream) {
        throw new Error("Failed to get audio stream from Deepgram");
      }

      // Convert stream to buffer
      const chunks: Buffer[] = [];
      for await (const chunk of stream) {
        chunks.push(chunk);
      }

      return Buffer.concat(chunks);
    } catch (error) {
      console.error("Error in DeepgramTTSService.textToSpeech:", error);
      throw new Error(
        `Failed to synthesize speech with Deepgram: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  /**
   * Convert text to speech and return audio as readable stream
   */
  async textToSpeechStream(
    text: string,
    voiceConfig?: TTSVoiceConfig,
    audioConfig?: TTSAudioConfig
  ): Promise<Readable> {
    try {
      const model = this.getDeepgramModel(voiceConfig);
      const encoding = audioConfig?.encoding?.toLowerCase() || "mp3";

      const response = await this.deepgram.speak.request(
        { text },
        {
          model,
          encoding: encoding as "mp3" | "wav" | "ogg" | "linear16",
        }
      );

      const stream = await response.getStream();
      if (!stream) {
        throw new Error("Failed to get audio stream from Deepgram");
      }

      return stream;
    } catch (error) {
      console.error("Error in DeepgramTTSService.textToSpeechStream:", error);
      throw new Error(
        `Failed to synthesize speech stream with Deepgram: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  /**
   * Convert text to speech and return audio as base64-encoded string
   */
  async textToSpeechBase64(
    text: string,
    voiceConfig?: TTSVoiceConfig,
    audioConfig?: TTSAudioConfig
  ): Promise<string> {
    try {
      const audioBuffer = await this.textToSpeech(
        text,
        voiceConfig,
        audioConfig
      );
      return audioBuffer.toString("base64");
    } catch (error) {
      console.error(
        "Error in DeepgramTTSService.textToSpeechBase64:",
        error
      );
      throw new Error(
        `Failed to synthesize speech to base64 with Deepgram: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }
}
