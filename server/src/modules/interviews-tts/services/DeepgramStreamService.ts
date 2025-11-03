import { createClient, LiveTranscriptionEvents } from "@deepgram/sdk";

export class DeepgramStreamService {
    private deepgram;

    constructor() {
        this.deepgram = createClient(process.env.DEEPGRAM_API_KEY || "");
    }

    /**
     * Transcribe audio buffer using Deepgram prerecorded API
     * @param audioBuffer Audio data as Buffer
     * @returns Transcribed text
     */
    public async transcribeAudio(audioBuffer: Buffer): Promise<string> {
        try {
            const response = await this.deepgram.listen.prerecorded.transcribeFile(
                audioBuffer,
                {
                    model: "nova-2",
                    language: "es",
                    smart_format: true,
                    punctuate: true
                }
            );

            const transcript = response.result.results.channels[0].alternatives[0].transcript;
            return transcript;
        } catch (error) {
            console.error("Deepgram transcription error:", error);
            throw new Error("Failed to transcribe audio");
        }
    }

    /**
     * Create a live transcription connection for streaming audio
     * This can be used for real-time transcription if needed in the future
     */
    public createLiveConnection() {
        const connection = this.deepgram.listen.live({
            model: "nova-2",
            language: "es",
            smart_format: true,
            punctuate: true,
            interim_results: false
        });

        return connection;
    }
}
