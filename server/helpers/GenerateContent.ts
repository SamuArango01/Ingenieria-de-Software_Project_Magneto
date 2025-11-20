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

export interface ContentModerationResult {
  isInappropriate: boolean;
  reason?: string;
}

export const moderateContent = async (
  name: string,
  description?: string
): Promise<ContentModerationResult> => {
  const contentToValidate = `
Nombre: ${name}
Descripción: ${description || 'N/A'}
  `.trim();

  const prompt = `
Analiza el siguiente contenido para un tipo de entrevista y determina si contiene lenguaje inapropiado, ofensivo, grosero, discriminatorio, o cualquier contenido no profesional.

CONTENIDO A ANALIZAR:
${contentToValidate}

INSTRUCCIONES:
- Detecta groserías, insultos, lenguaje ofensivo, contenido sexual, discriminación, odio, violencia
- El contenido debe ser apropiado para un contexto profesional de entrevistas laborales
- Responde ÚNICAMENTE con un JSON válido en el siguiente formato (sin markdown, sin código, solo JSON puro):

{"isInappropriate": boolean, "reason": "explicación breve si es inapropiado, o null si está limpio"}

IMPORTANTE: Devuelve solo el JSON, sin ningún texto adicional, sin backticks, sin formato markdown.
`;

  try {
    const response = await generateContent(prompt);

    // Limpiar la respuesta por si viene con markdown
    let cleanedResponse = response.trim();

    // Remover bloques de código markdown si existen
    cleanedResponse = cleanedResponse.replace(/```json\n?/g, '').replace(/```\n?/g, '');

    const result: ContentModerationResult = JSON.parse(cleanedResponse);

    console.log('📋 Moderación de contenido:', {
      content: contentToValidate,
      result
    });

    return result;
  } catch (error) {
    console.error('Error en moderateContent:', error);
    // En caso de error, permitir el contenido por defecto (fail-open)
    // pero podrías cambiar esto a fail-closed si prefieres ser más restrictivo
    return { isInappropriate: false };
  }
};
