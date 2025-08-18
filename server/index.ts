import express from "express";
import cors from "cors";
import multer from "multer";
import fs from "fs";
import { transcribeAudio } from "./helpers/TranscribeAudio";
import { generateContent, generateInterviewQuestions } from "./helpers/GenerateContent";

const app = express();
const PORT = process.env.PORT || 3211;

app.use(cors());
app.use(express.json());

const upload = multer({
  dest: "uploads/",
  limits: {
    fileSize: 25 * 1024 * 1024, // 25MB limit
  },
});

if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

app.get("/", (_, res) => {
  res.json({ message: "Funcionaaaa" });
});

app.post("/api/audio", upload.single("audio"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No audio file provided" });
    }

    // Step 1: Transcribe audio
    const transcriptedText = await transcribeAudio(req.file.path);

    // Step 2: Translate to English using Gemini
    const translatePrompt = `Translate the following Spanish text to English. Only return the translation, no additional text:
    
    "${transcriptedText}"`;
    
    const translatedText = await generateContent(translatePrompt);

    // Step 3: Generate AI response using Gemini
    const aiResponsePrompt = `You are an AI interviewer assistant. Based on this candidate's response:
    
    "${transcriptedText}"
    
    Provide a brief, professional follow-up question or comment in Spanish that would be appropriate in a job interview context. Keep it conversational and engaging.`;
    
    const aiResponse = await generateContent(aiResponsePrompt);

    // Clean up the uploaded file
    fs.unlinkSync(req.file.path);

    res.json({
      text: transcriptedText,
      translate: translatedText,
      aiResponse: aiResponse,
      success: true,
      provider: "deepgram + gemini",
    });

  } catch (error) {
    console.error("Error processing audio:", error);

    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({
      error: "Error processing audio",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
