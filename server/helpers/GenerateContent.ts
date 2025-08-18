import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_API_KEY || "",
});

export const generateContent = async (prompt: string): Promise<string> => {
  try {
    if (!process.env.GOOGLE_API_KEY) {
      throw new Error("Google API key not configured");
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    if (!response.text) {
      throw new Error("No content generated from Google GenAI");
    }

    return response.text;
  } catch (error) {
    console.error("Error in generateContent:", error);
    throw error;
  }
};

export const generateInterviewQuestions = async (
  transcribedText: string
): Promise<string> => {
  const prompt = `
    Basándote en la siguiente respuesta del candidato en una entrevista:
    "${transcribedText}"
    
    Genera 2-3 preguntas de seguimiento relevantes y profesionales para profundizar en la experiencia y habilidades mencionadas. 
    Las preguntas deben ser específicas y ayudar al entrevistador a evaluar mejor al candidato.
    
    Formato: Lista numerada sin introducción adicional.
  `;

  return generateContent(prompt);
};

export const analyzeInterview = async (
  transcribedTexts: string[]
): Promise<string> => {
  const combinedText = transcribedTexts.join("\n\n");

  const prompt = `
    Analiza las siguientes respuestas de una entrevista laboral:
    
    ${combinedText}
    
    Proporciona un análisis breve que incluya:
    1. Puntos fuertes del candidato
    2. Áreas de mejora o preocupaciones
    3. Recomendación general (contratar/no contratar/segunda entrevista)
    
    Mantén el análisis conciso y profesional.
  `;

  return generateContent(prompt);
};
