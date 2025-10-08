import "dotenv/config";
import "reflect-metadata";
import express from "express";
import cors from "cors";
import multer from "multer";
import fs from "fs";
import { transcribeAudio } from "./helpers/TranscribeAudio";
import { generateContent } from "./helpers/GenerateContent";
import nodemailer from "nodemailer";
import { marked } from "marked";
import { AppDataSource } from "@/database/data-source";
import router from "@/routes";
import morgan from "morgan";
import { clerkMiddleware } from '@clerk/express';

const app = express();
const PORT = process.env.PORT || 3211;

AppDataSource.initialize()
    .then(() => {
        console.log("Data Source has been initialized!");
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error("Error during Data Source initialization:", err);
    });

app.use(cors());
app.use(express.json());
app.use(morgan("dev")); // Add morgan for logging

// Use Clerk's middleware
app.use(clerkMiddleware());

// New routes
app.use("/api/v1", router);

// migrar todas esas
// Old routes
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

app.post("/api/summary", async (req, res) => {
  try {
    const { interviewHistory } = req.body;

    if (!interviewHistory || interviewHistory.length === 0) {
      return res.status(400).json({ error: "No interview history provided" });
    }

    const conversation = interviewHistory
      .map(
        (turn: { user: string; ai: string }, i: number) =>
          `Respuesta del candidato ${i + 1}: ${turn.user}\nPregunta/Comentario del entrevistador: ${turn.ai}`
      )
      .join("\n\n");

    const summaryPrompt = `
Act as an AI interviewer. Your task is to write personalized and direct feedback for the candidate, based on the following summary of their interview. The feedback should be in Spanish and follow this format naturally:

📌 Resumen general: A brief and honest description of their performance.
✅ Fortalezas: List their main strengths.
⚠️ Debilidades: Point out areas for improvement, detailing technical aspects and soft skills.
🎯 Recomendaciones: Offer concrete and useful suggestions for next steps.

Address the candidate directly, as if you were talking to a person. Be concise and get to the point.

Entrevista:
${conversation}
    `;

    const summary = await generateContent(summaryPrompt);

    res.json({ success: true, summary });
  } catch (error) {
    console.error("Error generating feedback:", error);
    res.status(500).json({
      success: false,
      error: "Error al generar feedback",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD // Usa App Password de Gmail
  },
});

app.post("/api/send-email", async (req, res) => {
  try {
    const { candidateEmail, candidateName, interviewHistory, summary } = req.body;

    if (!candidateEmail) {
      return res.status(400).json({ error: "Email del candidato es requerido" });
    }

    const formattedSummary = summary
      ? marked(summary)
      : "<p>¡Excelente trabajo en la entrevista!</p>";

    const interviewDetails = interviewHistory
      .map(
        (turn: { user: string; ai: string }, index: number) => `
      <div style="margin: 20px 0; padding: 15px; background: #f8f9fa; border-radius: 8px;">
        <div style="background: #e3f2fd; padding: 10px; border-radius: 5px; margin-bottom: 10px;">
          <strong>💡 Candidato Respuesta ( ${index + 1} ):</strong><br>
          ${turn.user}
        </div>
        <div style="background: #f3e5f5; padding: 10px; border-radius: 5px;">
          <strong>📌 Agente Entrevistador:</strong><br>
          ${turn.ai}
        </div>
      </div>
    `
      )
      .join("");

    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea, #764ba2); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f8f9fa; padding: 25px; border-radius: 0 0 10px 10px; }
          .stats { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 20px 0; }
          .stat-card { background: white; padding: 15px; border-radius: 8px; text-align: center; border-left: 4px solid #667eea; }
          .footer { text-align: center; margin-top: 30px; padding: 20px; background: #e9ecef; border-radius: 8px; font-size: 14px; color: #6c757d; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>🏆 Resultados de tu Entrevista</h1>
          <p>Fecha: ${new Date().toLocaleDateString("es-ES")}</p>
        </div>
        
        <div class="content">
          <h2>¡Hola ${candidateName || "Candidato"}!</h2>
          <p>Aquí tienes los resultados completos de tu entrevista de práctica:</p>
          
          <div class="stats">
            <div class="stat-card">
              <strong>${interviewHistory.length}</strong><br>Preguntas Respondidas
            </div>
            <div class="stat-card">
              <strong>${
                interviewHistory.length > 10 ? "Avanzado" : "Intermedio"
              }</strong><br>Nivel Alcanzado
            </div>
          </div>
          
          <h3>🎯 Resumen Ejecutivo</h3>
          <div style="background: white; padding: 15px; border-radius: 8px; border-left: 4px solid #10b981;">
            ${formattedSummary}
          </div>
          
          ${
            interviewHistory.length > 0
              ? `
          <h3 style="margin-top: 30px;">📝 Detalle de tu Entrevista</h3>
          ${interviewDetails}
          `
              : ""
          }
        </div>
        
        <div class="footer">
          <p>🚀 <strong>Próximos pasos sugeridos:</strong></p>
          <p>1. Revisa tus respuestas y identifica áreas de mejora<br>
          2. Practica preguntas desafiantes<br>
          3. Programa tu próxima sesión de práctica</p>
          <p><em>Generado automáticamente por el Sistema de Entrevistas StarTraining </em></p>
        </div>
      </body>
      </html>
    `;

    const mailOptions = {
      from:
        process.env.EMAIL_FROM ||
        '"Sistema de Entrevistas" <agentestartraining@gmail.com>',
      to: candidateEmail,
      subject: `🎯 Resultados de tu Entrevista - ${new Date().toLocaleDateString(
        "es-ES"
      )}`,
      html: emailHtml,
    };

    await transporter.sendMail(mailOptions);

    console.log(`Email enviado exitosamente a: ${candidateEmail}`);
    res.json({ success: true, message: "Email enviado exitosamente" });
  } catch (error) {
    console.error(" Error enviando email:", error);
    res.status(500).json({
      success: false,
      error: "Error al enviar el email",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

