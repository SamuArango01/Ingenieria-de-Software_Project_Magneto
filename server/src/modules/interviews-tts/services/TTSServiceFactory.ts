import type { ITTSService } from "../interfaces/ITTSService";
import { DeepgramTTSService } from "./DeepgramTTSService";

/**
 * Available TTS providers
 * Future providers can be added here (OpenAI, ElevenLabs, Azure, etc.)
 */
export enum TTSProvider {
  DEEPGRAM = "deepgram",
  // Future providers:
  // OPENAI = "openai",
  // ELEVENLABS = "elevenlabs",
  // AZURE = "azure",
}

/**
 * Factory for creating TTS service instances
 *
 * Implements Factory pattern for easy provider switching via configuration
 * Supports dependency injection and testing with mock providers
 */
export class TTSServiceFactory {
  /**
   * Create a TTS service instance based on provider type
   *
   * @param provider - TTS provider to use (defaults to Deepgram)
   * @returns ITTSService implementation
   * @throws Error if provider is not supported
   */
  static create(provider: TTSProvider = TTSProvider.DEEPGRAM): ITTSService {
    switch (provider) {
      case TTSProvider.DEEPGRAM:
        return new DeepgramTTSService();

      // Future implementations:
      // case TTSProvider.OPENAI:
      //   return new OpenAITTSService();
      // case TTSProvider.ELEVENLABS:
      //   return new ElevenLabsTTSService();
      // case TTSProvider.AZURE:
      //   return new AzureTTSService();

      default:
        throw new Error(`Unsupported TTS provider: ${provider}`);
    }
  }

  /**
   * Create TTS service from environment variable configuration
   *
   * @returns ITTSService implementation based on TTS_PROVIDER env var
   */
  static createFromEnv(): ITTSService {
    const providerName = process.env.TTS_PROVIDER?.toLowerCase() || "deepgram";

    // Validate and convert to enum
    const validProviders = Object.values(TTSProvider);
    if (!validProviders.includes(providerName as TTSProvider)) {
      console.warn(
        `Invalid TTS_PROVIDER "${providerName}", falling back to Deepgram`
      );
      return this.create(TTSProvider.DEEPGRAM);
    }

    return this.create(providerName as TTSProvider);
  }
}
