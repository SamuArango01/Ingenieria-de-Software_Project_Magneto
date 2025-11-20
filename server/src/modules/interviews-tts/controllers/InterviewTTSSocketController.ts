import { Socket, Namespace } from "socket.io";
import { InterviewTTSService } from "../services/InterviewTTSService";
import { DeepgramStreamService } from "../services/DeepgramStreamService";
import type { ITTSService } from "../interfaces/ITTSService";
import { TTSServiceFactory } from "../services/TTSServiceFactory";

export class InterviewTTSSocketController {
    private socket: Socket;
    private namespace: Namespace;
    private interviewService: InterviewTTSService;
    private deepgramService: DeepgramStreamService;
    private ttsService: ITTSService;
    private currentInterviewId: number | null = null;

    constructor(socket: Socket, namespace: Namespace, ttsService?: ITTSService) {
        this.socket = socket;
        this.namespace = namespace;
        this.interviewService = new InterviewTTSService();
        this.deepgramService = new DeepgramStreamService();
        // Use injected service or create from factory (supports DI and testing)
        this.ttsService = ttsService || TTSServiceFactory.createFromEnv();

        this.setupEventHandlers();
    }

    private setupEventHandlers(): void {
        this.socket.on("start_interview", this.handleStartInterview.bind(this));

        // Use streaming mode if enabled via environment variable
        const useStreaming = process.env.TTS_STREAMING_MODE === "true";
        if (useStreaming) {
            this.socket.on("audio_message", this.handleAudioMessageStream.bind(this));
            console.log(`[Socket.IO] Streaming mode ENABLED for user: ${this.socket.data.userId}`);
        } else {
            this.socket.on("audio_message", this.handleAudioMessage.bind(this));
            console.log(`[Socket.IO] Streaming mode DISABLED for user: ${this.socket.data.userId}`);
        }

        this.socket.on("end_interview", this.handleEndInterview.bind(this));
        this.socket.on("disconnect", this.handleDisconnect.bind(this));
    }

    /**
     * Handle start interview event
     */
    private async handleStartInterview(data: { interviewTypeId?: number }): Promise<void> {
        try {
            const userId = this.socket.data.userId;

            const result = await this.interviewService.startInterview({
                userId,
                interviewTypeId: data.interviewTypeId
            });

            if (result.isErr()) {
                this.socket.emit("error", { message: "Failed to start interview" });
                return;
            }

            const interview = result.value;
            this.currentInterviewId = interview.id;

            // Generate initial greeting
            const aiResponseResult = await this.interviewService.generateAIResponse(
                interview.id,
                "¡Hola! Estoy listo para comenzar la entrevista."
            );

            if (aiResponseResult.isErr()) {
                this.socket.emit("error", { message: "Failed to generate initial message" });
                return;
            }

            const aiResponse = aiResponseResult.value;

            // Save AI's initial message
            await this.interviewService.saveMessage({
                interviewId: interview.id,
                role: "ai",
                message: aiResponse.message
            });

            // Convert to speech
            const audioBuffer = await this.ttsService.textToSpeech(aiResponse.message);

            // Emit success with interview ID and initial audio
            this.socket.emit("interview_started", {
                interviewId: interview.id,
                message: aiResponse.message,
                audio: audioBuffer.toString('base64')
            });

        } catch (error) {
            console.error("Error in handleStartInterview:", error);
            this.socket.emit("error", { message: "An error occurred while starting the interview" });
        }
    }

    /**
     * Handle audio message from user
     */
    private async handleAudioMessage(data: { audio: string }): Promise<void> {
        try {
            if (!this.currentInterviewId) {
                this.socket.emit("error", { message: "No active interview" });
                return;
            }

            // Emit processing state
            this.socket.emit("processing", { status: "transcribing" });

            // Convert base64 to buffer
            const userAudioBuffer = Buffer.from(data.audio, 'base64');

            // Transcribe audio
            const transcript = await this.deepgramService.transcribeAudio(userAudioBuffer);

            if (!transcript || transcript.trim().length === 0) {
                this.socket.emit("error", { message: "Could not transcribe audio" });
                return;
            }

            // Save user message
            await this.interviewService.saveMessage({
                interviewId: this.currentInterviewId,
                role: "user",
                message: transcript
            });

            // Emit transcription
            this.socket.emit("transcription", { text: transcript });

            // Emit processing state
            this.socket.emit("processing", { status: "generating_response" });

            // Generate AI response
            const aiResponseResult = await this.interviewService.generateAIResponse(
                this.currentInterviewId,
                transcript
            );

            if (aiResponseResult.isErr()) {
                this.socket.emit("error", { message: "Failed to generate AI response" });
                return;
            }

            const aiResponse = aiResponseResult.value;

            // Save AI message
            await this.interviewService.saveMessage({
                interviewId: this.currentInterviewId,
                role: "ai",
                message: aiResponse.message
            });

            // Check if interview should end
            if (aiResponse.shouldEnd) {
                // End the interview
                await this.interviewService.endInterview(
                    this.currentInterviewId,
                    true,
                    aiResponse.reason
                );

                // Convert final message to speech
                const finalAudioBuffer = await this.ttsService.textToSpeech(aiResponse.message);

                // Emit final response
                this.socket.emit("ai_response", {
                    message: aiResponse.message,
                    audio: finalAudioBuffer.toString('base64'),
                    shouldEnd: true,
                    reason: aiResponse.reason
                });

                // Emit interview ended event
                this.socket.emit("interview_ended", {
                    interviewId: this.currentInterviewId,
                    reason: aiResponse.reason || "Interview completed"
                });

                this.currentInterviewId = null;
                return;
            }

            // Emit processing state
            this.socket.emit("processing", { status: "generating_audio" });

            // Convert to speech
            const aiAudioBuffer = await this.ttsService.textToSpeech(aiResponse.message);

            // Emit AI response with audio
            this.socket.emit("ai_response", {
                message: aiResponse.message,
                audio: aiAudioBuffer.toString('base64'),
                shouldEnd: false
            });

        } catch (error) {
            console.error("Error in handleAudioMessage:", error);
            this.socket.emit("error", { message: "An error occurred while processing your message" });
        }
    }

    /**
     * Handle audio message from user with STREAMING support
     * Streams AI text chunks in real-time and synthesizes audio incrementally
     */
    private async handleAudioMessageStream(data: { audio: string }): Promise<void> {
        try {
            if (!this.currentInterviewId) {
                this.socket.emit("error", { message: "No active interview" });
                return;
            }

            // Emit processing state
            this.socket.emit("processing", { status: "transcribing" });

            // Convert base64 to buffer
            const userAudioBuffer = Buffer.from(data.audio, 'base64');

            // Transcribe audio
            const transcript = await this.deepgramService.transcribeAudio(userAudioBuffer);

            if (!transcript || transcript.trim().length === 0) {
                this.socket.emit("error", { message: "Could not transcribe audio" });
                return;
            }

            // Save user message
            await this.interviewService.saveMessage({
                interviewId: this.currentInterviewId,
                role: "user",
                message: transcript
            });

            // Emit transcription
            this.socket.emit("transcription", { text: transcript });

            // Emit processing state
            this.socket.emit("processing", { status: "generating_response" });

            // Stream AI response with incremental TTS
            let fullMessage = "";
            let sentenceBuffer = "";
            const sentenceEndings = /[.!?]\s/;

            try {
                for await (const { chunk, fullText } of this.interviewService.generateAIResponseStream(
                    this.currentInterviewId,
                    transcript
                )) {
                    // Accumulate chunks
                    sentenceBuffer += chunk;

                    // Check if we have a complete sentence
                    if (sentenceEndings.test(sentenceBuffer)) {
                        const sentences = sentenceBuffer.split(sentenceEndings);

                        // Process all complete sentences
                        for (let i = 0; i < sentences.length - 1; i++) {
                            const sentence = sentences[i].trim();
                            if (sentence.length > 0) {
                                // Emit text chunk to client immediately
                                this.socket.emit("ai_text_chunk", { text: sentence });

                                // Generate audio for this sentence in parallel
                                try {
                                    const audioBuffer = await this.ttsService.textToSpeech(sentence);
                                    this.socket.emit("ai_audio_chunk", {
                                        audio: audioBuffer.toString('base64')
                                    });
                                } catch (ttsError) {
                                    console.error("Error generating audio chunk:", ttsError);
                                    // Continue streaming even if one chunk fails
                                }
                            }
                        }

                        // Keep the last incomplete sentence in buffer
                        sentenceBuffer = sentences[sentences.length - 1];
                    }

                    fullMessage = fullText;
                }

                // Process any remaining text in buffer
                if (sentenceBuffer.trim().length > 0) {
                    this.socket.emit("ai_text_chunk", { text: sentenceBuffer });
                    try {
                        const audioBuffer = await this.ttsService.textToSpeech(sentenceBuffer);
                        this.socket.emit("ai_audio_chunk", {
                            audio: audioBuffer.toString('base64')
                        });
                    } catch (ttsError) {
                        console.error("Error generating final audio chunk:", ttsError);
                    }
                }

            } catch (streamError) {
                console.error("Error in AI streaming:", streamError);
                this.socket.emit("error", { message: "Failed to generate AI response" });
                return;
            }

            // Parse the full response to get metadata (shouldEnd, reason, etc.)
            let aiResponse;
            try {
                // The generator returns the parsed AIResponseData
                const generator = this.interviewService.generateAIResponseStream(
                    this.currentInterviewId,
                    transcript
                );

                // Consume the generator to get the return value
                let result = await generator.next();
                while (!result.done) {
                    result = await generator.next();
                }
                aiResponse = result.value;
            } catch (error) {
                console.error("Error parsing AI response:", error);
                aiResponse = {
                    message: fullMessage,
                    shouldEnd: false
                };
            }

            // Save AI message
            await this.interviewService.saveMessage({
                interviewId: this.currentInterviewId,
                role: "ai",
                message: aiResponse.message
            });

            // Check if interview should end
            if (aiResponse.shouldEnd) {
                // End the interview
                await this.interviewService.endInterview(
                    this.currentInterviewId,
                    true,
                    aiResponse.reason
                );

                // Emit stream complete with metadata
                this.socket.emit("ai_response_complete", {
                    shouldEnd: true,
                    reason: aiResponse.reason
                });

                // Emit interview ended event
                this.socket.emit("interview_ended", {
                    interviewId: this.currentInterviewId,
                    reason: aiResponse.reason || "Interview completed"
                });

                this.currentInterviewId = null;
                return;
            }

            // Emit stream complete
            this.socket.emit("ai_response_complete", {
                shouldEnd: false
            });

        } catch (error) {
            console.error("Error in handleAudioMessageStream:", error);
            this.socket.emit("error", { message: "An error occurred while processing your message" });
        }
    }

    /**
     * Handle end interview event (manual end by user)
     */
    private async handleEndInterview(): Promise<void> {
        try {
            if (!this.currentInterviewId) {
                this.socket.emit("error", { message: "No active interview" });
                return;
            }

            await this.interviewService.endInterview(
                this.currentInterviewId,
                false,
                "Ended by user"
            );

            this.socket.emit("interview_ended", {
                interviewId: this.currentInterviewId,
                reason: "Ended by user"
            });

            this.currentInterviewId = null;
        } catch (error) {
            console.error("Error in handleEndInterview:", error);
            this.socket.emit("error", { message: "An error occurred while ending the interview" });
        }
    }

    /**
     * Handle disconnect event
     */
    private handleDisconnect(): void {
        console.log(`User disconnected: ${this.socket.data.userId}`);

        // If there's an active interview, mark it as interrupted
        if (this.currentInterviewId) {
            this.interviewService.endInterview(
                this.currentInterviewId,
                false,
                "Connection lost"
            ).catch(err => {
                console.error("Error ending interview on disconnect:", err);
            });
        }
    }
}
