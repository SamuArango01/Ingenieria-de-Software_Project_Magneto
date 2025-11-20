import { Readable } from "stream";

/**
 * Voice configuration for TTS synthesis
 * Provider-agnostic configuration that maps to specific provider settings
 */
export interface TTSVoiceConfig {
  /** Language code (e.g., "es", "es-US", "en-US") */
  languageCode: string;
  /** Optional voice identifier (provider-specific) */
  voiceId?: string;
  /** Voice gender preference */
  gender?: "MALE" | "FEMALE" | "NEUTRAL";
  /** Speaking rate (0.25 to 4.0, default 1.0) */
  speakingRate?: number;
  /** Voice pitch adjustment (-20.0 to 20.0, default 0.0) */
  pitch?: number;
}

/**
 * Audio output configuration for TTS synthesis
 */
export interface TTSAudioConfig {
  /** Audio encoding format */
  encoding: "MP3" | "WAV" | "OGG" | "LINEAR16";
  /** Audio sample rate in Hz (e.g., 24000, 48000) */
  sampleRate?: number;
}

/**
 * Text-to-Speech Service Interface
 *
 * Provides abstraction layer for TTS providers (Google, Deepgram, OpenAI, etc.)
 * Implements Dependency Inversion Principle for easy provider switching
 */
export interface ITTSService {
  /**
   * Convert text to speech and return audio as Buffer
   *
   * @param text - Text to synthesize
   * @param voiceConfig - Optional voice configuration
   * @param audioConfig - Optional audio output configuration
   * @returns Promise with audio data as Buffer
   */
  textToSpeech(
    text: string,
    voiceConfig?: TTSVoiceConfig,
    audioConfig?: TTSAudioConfig
  ): Promise<Buffer>;

  /**
   * Convert text to speech and return audio as readable stream
   *
   * @param text - Text to synthesize
   * @param voiceConfig - Optional voice configuration
   * @param audioConfig - Optional audio output configuration
   * @returns Promise with audio data as Readable stream
   */
  textToSpeechStream(
    text: string,
    voiceConfig?: TTSVoiceConfig,
    audioConfig?: TTSAudioConfig
  ): Promise<Readable>;

  /**
   * Convert text to speech and return audio as base64-encoded string
   *
   * @param text - Text to synthesize
   * @param voiceConfig - Optional voice configuration
   * @param audioConfig - Optional audio output configuration
   * @returns Promise with base64-encoded audio string
   */
  textToSpeechBase64(
    text: string,
    voiceConfig?: TTSVoiceConfig,
    audioConfig?: TTSAudioConfig
  ): Promise<string>;
}
