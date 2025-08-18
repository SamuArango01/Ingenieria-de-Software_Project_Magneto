import { createClient } from "@deepgram/sdk";
import fs from "fs";
const deepgram = createClient(process.env.DEEPGRAM_API_KEY || "");

export const transcribeAudio = async (
  audioFilePath: string
): Promise<string> => {
  try {
    if (!process.env.DEEPGRAM_API_KEY) {
      throw new Error("Deepgram API key not configured");
    }

    const audioBuffer = fs.readFileSync(audioFilePath);

    const { result, error } = await deepgram.listen.prerecorded.transcribeFile(
      audioBuffer,
      {
        model: "nova-2",
        language: "es",
        smart_format: true,
        punctuate: true,
        diarize: false,
        utterances: false,
      }
    );

    if (error) {
      throw new Error(`Deepgram error: ${error.message}`);
    }

    const transcript =
      result?.results?.channels?.[0]?.alternatives?.[0]?.transcript;

    if (!transcript) {
      throw new Error("No transcript found in Deepgram response");
    }

    return transcript;
  } catch (error) {
    console.error("Error in transcribeAudio:", error);
    throw error;
  }
};
