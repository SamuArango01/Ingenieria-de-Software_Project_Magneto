// src/modules/interviews/services/InterviewService.ts
import { ok, err, Result } from 'neverthrow';
import type { IInterviewService } from '@/modules/interviews/interfaces/IInterviewService';
import { analyzeCandidateSpeech } from '../../../../helpers/TranscribeAudio';
import { generateContent } from '../../../../helpers/GenerateContent';
import { InterviewTypeService } from '@/modules/interview-types/services/InterviewTypeService';
import nodemailer from 'nodemailer';
import { marked } from 'marked';
import { IInterviewRepository } from '../interfaces/IInterviewRepository';
import { InterviewRepository } from '../repositories/InterviewRepository';

type ValidationError = { type: 'ValidationError'; message: string };
type EmailError = { type: 'EmailError'; message: string };

interface DifficultyConfig {
  name: string;
  description: string;
  timePerQuestion: number;
  totalQuestions: number;
  requiredScore: number;
}

export class InterviewService implements IInterviewService {
    private interviewTypeService: InterviewTypeService;
    private interviewRepository: IInterviewRepository; // Repositorio de entrevistas
    private transporter;

    private readonly DIFFICULTY_LEVELS: { [key: string]: DifficultyConfig } = {
      junior: {
        name: 'Junior',
        description: 'Nivel básico - Preguntas fundamentales sobre conceptos básicos y experiencias iniciales',
        timePerQuestion: 120,
        totalQuestions: 5,
        requiredScore: 70
      },
      mid: {
        name: 'Mid-Level',
        description: 'Nivel intermedio - Preguntas técnicas y de resolución de problemas',
        timePerQuestion: 180,
        totalQuestions: 5,
        requiredScore: 75
      },
      senior: {
        name: 'Senior',
        description: 'Nivel avanzado - Preguntas complejas, de liderazgo y estrategia',
        timePerQuestion: 240,
        totalQuestions: 7,
        requiredScore: 80
      }
    };

    constructor() {
        this.interviewTypeService = new InterviewTypeService();
        this.interviewRepository = new InterviewRepository(); // Instanciar el repositorio
        this.transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD
            },
        });
    }

async startStarInterview(
    candidateName: string,
    userId: string,
    interviewTypeId?: number,
    difficultyLevel: string = 'junior'
): Promise<Result<{ 
    initialMessage: string; 
    interviewId: number; // Devolvemos el ID
    success: boolean 
}, ValidationError>> {
    try {
        if (!candidateName?.trim()) {
            return err({ 
                type: 'ValidationError', 
                message: 'El nombre del candidato es requerido' 
            });
        }

        // 1. Crear y guardar la entidad Interview
        const newInterview = this.interviewRepository.create({
            userId,
            candidateName,
            status: 'started',
            difficultyLevel,
            interviewTypeId
        });
        const savedInterview = await this.interviewRepository.save(newInterview);

        const levelConfig = this.DIFFICULTY_LEVELS[difficultyLevel] || this.DIFFICULTY_LEVELS.junior;
        
        let prompt = `Eres un entrevistador profesional para una entrevista de nivel ${levelConfig.name}. 
        
Contexto: ${levelConfig.description}

Saluda al candidato ${candidateName} y haz UNA pregunta inicial apropiada para este nivel. 
La pregunta debe ser específica para el nivel ${levelConfig.name}.

IMPORTANTE: 
- El saludo y la pregunta deben estar en un solo mensaje fluido y natural
- Mantén un tono conversacional continuo
- No uses estructuras separadas como "Saludo:" y "Pregunta:"

EN ESPAÑOL. Máximo 120 palabras.`;

        if (interviewTypeId) {
            const effectiveUserId = userId || 'system';
            const interviewTypeResult = await this.interviewTypeService.getInterviewTypeById(effectiveUserId, interviewTypeId);

            if (interviewTypeResult.isOk() && interviewTypeResult.value?.description) {
                prompt = `Eres un entrevistador profesional para un puesto de nivel ${levelConfig.name}. 
                
Contexto: ${levelConfig.description}

Saluda al candidato ${candidateName} y haz UNA pregunta inicial ESPECÍFICA para este tipo de entrevista, para el tipo de entrevista ${interviewTypeResult.value.description} y nivel de dificultad de las preguntas ${levelConfig.name}. 
La pregunta debe reflejar la complejidad apropiada para el nivel.

IMPORTANTE: 
- El saludo y la pregunta deben estar en un solo mensaje fluido y natural
- Mantén un tono conversacional continuo
- No uses estructuras separadas como "Saludo:" y "Pregunta:"

EN ESPAÑOL. Máximo 120 palabras.`;
            }
        }

        const aiResponse = await generateContent(prompt);
        const initialMessage = aiResponse.trim();

        return ok({
            initialMessage,
            interviewId: savedInterview.id, // Incluimos el ID en la respuesta
            success: true
        });

    } catch (error) {
        console.error('Error starting interview:', error);
        return err({ 
            type: 'ValidationError', 
            message: error instanceof Error ? error.message : 'Error al iniciar la entrevista' 
        });
    }
}

    async processAudio(
        userId: string, 
        audioPath: string, 
        interviewTypeId?: number,
        difficultyLevel: string = 'junior'
    ): Promise<Result<any, ValidationError>> {
        try {
            const analysisResult = await analyzeCandidateSpeech(audioPath);
            const transcriptedText = analysisResult.text;
            const candidateMetrics = analysisResult.candidateMetrics;

          
            const levelConfig = this.DIFFICULTY_LEVELS[difficultyLevel] || this.DIFFICULTY_LEVELS.junior;

            let aiResponsePrompt = `You are an AI interviewer assistant.Based on this candidate's response:
"${transcriptedText}"

Provide a brief, professional follow-up question or comment in Spanish that would be appropriate for a ${levelConfig.name} level interview. 
Keep it conversational, engaging, and appropriate for the difficulty level. Pay close attention to Interview type context`;

            if (interviewTypeId) {
                const interviewTypeResult = await this.interviewTypeService.getInterviewTypeById(userId, interviewTypeId);
                if (interviewTypeResult.isOk() && interviewTypeResult.value.description) {
                    aiResponsePrompt = `You are an AI interviewer assistant for a ${levelConfig.name} level position. 

Interview type context: ${interviewTypeResult.value.description}

Based on this candidate's response:
"${transcriptedText}"

Provide a brief, professional follow-up question or comment in Spanish that would be appropriate for this interview type and ${levelConfig.name} level interview. 
Keep it conversational, engaging, and appropriate for the difficulty level.`;
                }
            }

            const translatePrompt = `Translate the following Spanish text to English. Only return the translation, no additional text:
"${transcriptedText}"`;
            const translatedText = await generateContent(translatePrompt);

            const aiResponse = await generateContent(aiResponsePrompt);
            console.log("🤖 Respuesta IA:", aiResponse);

            return ok({
                text: transcriptedText,
                translate: translatedText,
                aiResponse: aiResponse,
                candidateMetrics: candidateMetrics,
                success: true,
                provider: "deepgram + gemini",
            });

        } catch (error) {
            return err({ 
                type: 'ValidationError', 
                message: error instanceof Error ? error.message : 'Error processing audio' 
            });
        }
    }

   
    async evaluateLevel(
        interviewHistory: Array<{ user: string; ai: string }>,
        candidateMetricsHistory: any[],
        currentLevel: string
    ): Promise<Result<{ 
        canAdvance: boolean; 
        recommendedLevel: string;
        score: number;
        feedback: string;
    }, ValidationError>> {
        try {
            if (!interviewHistory || interviewHistory.length === 0) {
                return err({ type: 'ValidationError', message: "No interview history provided" });
            }

            console.log("🔍 Evaluando nivel completo:", {
                currentLevel,
                interviewHistoryLength: interviewHistory.length,
                candidateMetricsHistoryLength: candidateMetricsHistory?.length || 0
            });

            //Calidad del contenido (60%)
            const contentScore = await this.evaluateContentQuality(interviewHistory, currentLevel);
            
            // Habilidades vocales (40%)
            const vocalScore = this.calculateVocalScore(candidateMetricsHistory);
            
            // Puntuación global combinada
            const overallScore = Math.round((contentScore * 0.6) + (vocalScore * 0.4));
            
            console.log("📊 Puntuaciones de evaluación:", {
                contentScore,
                vocalScore,
                overallScore,
                currentLevel
            });

            const levelConfig = this.DIFFICULTY_LEVELS[currentLevel];
            const canAdvance = levelConfig ? overallScore >= levelConfig.requiredScore : false;
       
            const levels = ['junior', 'mid', 'senior'];
            const currentIndex = levels.indexOf(currentLevel);
            const recommendedLevel = canAdvance && currentIndex < levels.length - 1 
                ? levels[currentIndex + 1] 
                : currentLevel;

            const feedback = await this.generateComprehensiveFeedback(
                interviewHistory,
                candidateMetricsHistory,
                currentLevel,
                overallScore,
                canAdvance,
                recommendedLevel,
                contentScore,
                vocalScore
            );

            console.log("🎯 Resultado evaluación final:", {
                canAdvance,
                recommendedLevel,
                overallScore,
                contentScore,
                vocalScore,
                currentLevel
            });

            return ok({
                canAdvance,
                recommendedLevel,
                score: overallScore,
                feedback
            });

        } catch (error) {
            console.error('❌ Error evaluating level:', error);
            return err({ 
                type: 'ValidationError', 
                message: error instanceof Error ? error.message : 'Error evaluating level' 
            });
        }
    }


    private async evaluateContentQuality(interviewHistory: any[], currentLevel: string): Promise<number> {
        try {
            const conversation = interviewHistory
                .map((turn, i) => `Pregunta ${i + 1}: ${turn.ai}\nRespuesta: ${turn.user}`)
                .join("\n\n");

            const evaluationPrompt = `
Evalúa la calidad de las respuestas del candidato en una entrevista de nivel ${currentLevel}.

CONVERSACIÓN COMPLETA:
${conversation}

Proporciona una puntuación del 0-100 considerando CRITERIOS ESPECÍFICOS:

1. PERTINENCIA (25%): ¿Las respuestas son relevantes a las preguntas?
2. PROFUNDIDAD (25%): ¿Desarrolla ideas complejas o se queda en superficial?
3. CLARIDAD (20%): ¿Se expresa de manera comprensible y organizada?
4. EJEMPLOS (15%): ¿Incluye ejemplos concretos o experiencias relevantes?
5. COHERENCIA (15%): ¿Mantiene consistencia en sus argumentos?

Nivel esperado: ${currentLevel}
Devuelve SOLO el número de la puntuación, nada más.
            `;

            const scoreText = await generateContent(evaluationPrompt);
            const score = parseInt(scoreText.trim()) || 70; // Default si falla
            const finalScore = Math.min(100, Math.max(0, score));
            
            console.log("📝 Evaluación de contenido:", {
                rawScore: scoreText,
                finalScore,
                currentLevel
            });

            return finalScore;
        } catch (error) {
            console.error("❌ Error evaluando contenido:", error);
            return 70; // Puntuación por defecto en caso de error
        }
    }

    // Calcular puntuación vocal promediada
    private calculateVocalScore(candidateMetricsHistory: any[]): number {
        if (!candidateMetricsHistory || candidateMetricsHistory.length === 0) {
            console.log("📊 No hay métricas vocales para evaluar, usando default");
            return 70;
        }

        try {
            // Calcular promedio de todas las métricas vocales
            const averageMetrics = this.calculateAverageCandidateMetrics(candidateMetricsHistory);
            const vocalScore = this.calculateOverallScore(averageMetrics);
            
            console.log("🎤 Evaluación vocal:", {
                metricsCount: candidateMetricsHistory.length,
                averageMetrics: {
                    fluency: averageMetrics.fluencyScore,
                    clarity: averageMetrics.clarityScore,
                    confidence: averageMetrics.confidenceScore,
                    wpm: averageMetrics.wordsPerMinute
                },
                vocalScore
            });

            return vocalScore;
        } catch (error) {
            console.error("❌ Error calculando puntuación vocal:", error);
            return 70;
        }
    }

    //  Generar feedback integral y personalizado
    private async generateComprehensiveFeedback(
        interviewHistory: any[],
        candidateMetricsHistory: any[],
        currentLevel: string,
        overallScore: number,
        canAdvance: boolean,
        recommendedLevel: string,
        contentScore: number,
        vocalScore: number
    ): Promise<string> {
        try {
            const conversation = interviewHistory
                .map((turn, i) => `Pregunta ${i + 1}: ${turn.ai}\nRespuesta: ${turn.user}`)
                .join("\n\n");

            const averageMetrics = candidateMetricsHistory && candidateMetricsHistory.length > 0 
                ? this.calculateAverageCandidateMetrics(candidateMetricsHistory)
                : null;

            const feedbackPrompt = `
Eres un evaluador profesional de entrevistas. Genera un feedback CONSTRUCTIVO para un candidato.

RESULTADOS DE EVALUACIÓN:
- Puntuación total: ${overallScore}/100
- Puntuación contenido: ${contentScore}/100
- Puntuación comunicación: ${vocalScore}/100
- Nivel actual: ${currentLevel}
- ¿Puede avanzar?: ${canAdvance ? 'SÍ' : 'NO'}
- Nivel recomendado: ${recommendedLevel}

${averageMetrics ? `
DESEMPEÑO VOCAL:
• Velocidad: ${averageMetrics.wordsPerMinute} ppm
• Fluidez: ${(averageMetrics.fluencyScore * 100).toFixed(0)}%
• Claridad: ${(averageMetrics.clarityScore * 100).toFixed(0)}%
• Confianza: ${(averageMetrics.confidenceScore * 100).toFixed(0)}%
• Muletillas: ${(averageMetrics.fillerWordsRatio * 100).toFixed(0)}%
` : ''}

CONVERSACIÓN EVALUADA:
${conversation}

INSTRUCCIONES PARA EL FEEDBACK:
1. Comienza con un reconocimiento del esfuerzo
2. Explica BREVEMENTE la decisión de avance/no avance
3. Destaca 2-3 fortalezas principales
4. Mámixo 20 palabras
4. Señala 2-3 áreas de mejora específicas
5. Da recomendaciones concretas para el siguiente nivel
6. Termina con un mensaje motivador

Máximo 50 palabras. Lenguaje natural y constructivo.
            `;

            const feedback = await generateContent(feedbackPrompt);
            return feedback;
        } catch (error) {
            console.error("❌ Error generando feedback:", error);
            return canAdvance ? 
                `¡Felicidades! Has obtenido ${overallScore}/100 puntos y puedes avanzar al nivel ${recommendedLevel}. Continúa desarrollando tus habilidades de comunicación y profundizando en tus respuestas.` :
                `Has obtenido ${overallScore}/100 puntos. Para avanzar al siguiente nivel necesitas mejorar tanto el contenido de tus respuestas como tu comunicación verbal. Sigue practicando!`;
        }
    }

    // Calcular puntuación general (para métricas vocales)
private calculateOverallScore(candidateMetrics: any): number {
    if (!candidateMetrics) return 0;

    const weights = {
        fluencyScore: 0.25,
        clarityScore: 0.25,
        confidenceScore: 0.20,
        fillerWordsRatio: 0.15,
        wordsPerMinute: 0.15
    };

    let totalScore = 0;
    let totalWeight = 0;

    // Puntuación de fluidez 
    if (candidateMetrics.fluencyScore !== undefined) {
        const fluencyPercent = candidateMetrics.fluencyScore * 100;
        totalScore += fluencyPercent * weights.fluencyScore;
        totalWeight += weights.fluencyScore;
    }

    // Puntuación de claridad 
    if (candidateMetrics.clarityScore !== undefined) {
        const clarityPercent = candidateMetrics.clarityScore * 100;
        totalScore += clarityPercent * weights.clarityScore;
        totalWeight += weights.clarityScore;
    }

    // Puntuación de confianza
    if (candidateMetrics.confidenceScore !== undefined) {
        const confidencePercent = candidateMetrics.confidenceScore * 100;
        totalScore += confidencePercent * weights.confidenceScore;
        totalWeight += weights.confidenceScore;
    }

    //  Puntuación de muletillas 
    if (candidateMetrics.fillerWordsRatio !== undefined) {
        const fillerPercent = Math.max(0, 100 - (candidateMetrics.fillerWordsRatio * 100));
        totalScore += fillerPercent * weights.fillerWordsRatio;
        totalWeight += weights.fillerWordsRatio;
    }

    //Puntuación de velocidad (óptimo entre 130-180 palabras/minuto)
    if (candidateMetrics.wordsPerMinute !== undefined) {
        const wpm = candidateMetrics.wordsPerMinute;
        let wpmScore = 0;
        
        if (wpm >= 130 && wpm <= 180) {
            wpmScore = 100; // Rango óptimo
        } else if (wpm >= 110 && wpm < 130) {
            wpmScore = 70 + ((wpm - 110) / 20) * 30; // Escala progresiva
        } else if (wpm > 180 && wpm <= 200) {
            wpmScore = 70 + ((200 - wpm) / 20) * 30; // Escala progresiva
        } else {
            wpmScore = Math.max(0, 100 - Math.abs(wpm - 155) * 2); // Penalización por desviación
        }
        
        totalScore += wpmScore * weights.wordsPerMinute;
        totalWeight += weights.wordsPerMinute;
    }


    const finalScore = totalWeight > 0 ? Math.round(totalScore / totalWeight) : 0;
    
    console.log(`📊 Cálculo FINAL de puntuación vocal:`, {
        totalScore,
        totalWeight,
        finalScore,
        metrics: {
            fluency: `${candidateMetrics.fluencyScore} (${(candidateMetrics.fluencyScore * 100).toFixed(0)}%)`,
            clarity: `${candidateMetrics.clarityScore} (${(candidateMetrics.clarityScore * 100).toFixed(0)}%)`,
            confidence: `${candidateMetrics.confidenceScore} (${(candidateMetrics.confidenceScore * 100).toFixed(0)}%)`,
            wpm: candidateMetrics.wordsPerMinute,
            fillerRatio: `${candidateMetrics.fillerWordsRatio} (${(candidateMetrics.fillerWordsRatio * 100).toFixed(0)}%)`
        }
    });

    return Math.min(100, Math.max(0, finalScore));
}

    private getMostFrequentItems(items: string[]): string[] {
        const frequency: { [key: string]: number } = {};
        
        items.forEach(item => {
            frequency[item] = (frequency[item] || 0) + 1;
        });

        return Object.entries(frequency)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 3)
            .map(([item]) => item);
    }

    calculateAverageCandidateMetrics(candidateMetrics: any[]): any {
        if (!candidateMetrics || candidateMetrics.length === 0) {
            return null;
        }

        const sum = candidateMetrics.reduce((acc, metrics) => {
            return {
                wordsPerMinute: acc.wordsPerMinute + (metrics.wordsPerMinute || 0),
                fluencyScore: acc.fluencyScore + (metrics.fluencyScore || 0),
                clarityScore: acc.clarityScore + (metrics.clarityScore || 0),
                confidenceScore: acc.confidenceScore + (metrics.confidenceScore || 0),
                fillerWordsRatio: acc.fillerWordsRatio + (metrics.fillerWordsRatio || 0),
                strengths: [...acc.strengths, ...(metrics.strengths || [])],
                improvementAreas: [...acc.improvementAreas, ...(metrics.improvementAreas || [])]
            };
        }, {
            wordsPerMinute: 0,
            fluencyScore: 0,
            clarityScore: 0,
            confidenceScore: 0,
            fillerWordsRatio: 0,
            strengths: [] as string[],
            improvementAreas: [] as string[]
        });

        const count = candidateMetrics.length;
        return {
            wordsPerMinute: Math.round(sum.wordsPerMinute / count),
            fluencyScore: sum.fluencyScore / count,
            clarityScore: sum.clarityScore / count,
            confidenceScore: sum.confidenceScore / count,
            fillerWordsRatio: sum.fillerWordsRatio / count,
            strengths: this.getMostFrequentItems(sum.strengths),
            improvementAreas: this.getMostFrequentItems(sum.improvementAreas)
        };
    }

    private buildUnifiedMetricsContext(averageMetrics: any): string {
    const fluencyPercent = (averageMetrics.fluencyScore * 100).toFixed(0);
    const clarityPercent = (averageMetrics.clarityScore * 100).toFixed(0);
    const confidencePercent = (averageMetrics.confidenceScore * 100).toFixed(0);
    const fillerPercent = (averageMetrics.fillerWordsRatio * 100).toFixed(0);

    return `
DESEMPEÑO VOCAL DEL CANDIDATO:
• Velocidad: ${averageMetrics.wordsPerMinute} ppm (${this.getSimplePaceDescription(averageMetrics.wordsPerMinute)})
• Fluidez: ${fluencyPercent}% - ${this.getSimpleFluencyDescription(averageMetrics.fluencyScore)}
• Claridad: ${clarityPercent}% - ${this.getSimpleClarityDescription(averageMetrics.clarityScore)}
• Confianza: ${confidencePercent}% - ${this.getSimpleConfidenceDescription(averageMetrics.confidenceScore)}
• Muletillas: ${fillerPercent}% de uso

FORTALEZAS VOCALES: ${averageMetrics.strengths.slice(0, 2).map((s: string) => this.getSimpleStrength(s)).join(', ')}

ÁREAS A MEJORAR: ${averageMetrics.improvementAreas.slice(0, 2).map((a: string) => this.getSimpleArea(a)).join(', ')}
    `;
}

    private getSimplePaceDescription(wpm: number): string {
        if (wpm < 120) return "ritmo muy pausado";
        if (wpm > 180) return "velocidad elevada";
        return "ritmo adecuado";
    }

    private getSimpleFluencyDescription(score: number): string {
        if (score < 0.6) return "fluidez a mejorar";
        if (score < 0.8) return "buena fluidez";
        return "excelente fluidez";
    }

    private getSimpleClarityDescription(score: number): string {
        if (score < 0.6) return "claridad a trabajar";
        if (score < 0.8) return "mensaje claro";
        return "comunicación muy clara";
    }

    private getSimpleConfidenceDescription(score: number): string {
        if (score < 0.6) return "confianza a fortalecer";
        if (score < 0.8) return "seguridad adecuada";
        return "muy seguro";
    }

    private getSimpleStrength(strength: string): string {
        const strengths: { [key: string]: string } = {
            'ritmo_adecuado': 'ritmo conversacional',
            'fluidez_excelente': 'fluidez natural',
            'claridad_sobresaliente': 'claridad vocal',
            'confianza_notable': 'seguridad al hablar',
            'minimo_uso_muletillas': 'lenguaje limpio',
            'desempeno_solido': 'comunicación sólida'
        };
        return strengths[strength] || strength.replace(/_/g, ' ');
    }

    private getSimpleArea(area: string): string {
        const areas: { [key: string]: string } = {
            'aumentar_velocidad_habla': 'velocidad del habla',
            'reducir_velocidad_habla': 'control del ritmo',
            'mejorar_fluidez': 'fluidez verbal',
            'mejorar_claridad': 'claridad articulatoria',
            'aumentar_confianza_vocal': 'proyección vocal',
            'reducir_muletillas': 'reducción de muletillas',
            'controlar_pausas': 'gestión de pausas'
        };
        return areas[area] || area.replace(/_/g, ' ');
    }


calculateAverageCandidateMetrics(candidateMetrics: any[]): any {
    if (!candidateMetrics || candidateMetrics.length === 0) {
        return null;
    }

    const sum = candidateMetrics.reduce((acc, metrics, index) => {

        return {
            wordsPerMinute: acc.wordsPerMinute + (metrics.wordsPerMinute || 0),
            fluencyScore: acc.fluencyScore + (metrics.fluencyScore || 0),
            clarityScore: acc.clarityScore + (metrics.clarityScore || 0),
            confidenceScore: acc.confidenceScore + (metrics.confidenceScore || 0),
            fillerWordsRatio: acc.fillerWordsRatio + (metrics.fillerWordsRatio || 0),
            strengths: [...acc.strengths, ...(metrics.strengths || [])],
            improvementAreas: [...acc.improvementAreas, ...(metrics.improvementAreas || [])]
        };
    }, {
        wordsPerMinute: 0,
        fluencyScore: 0,
        clarityScore: 0,
        confidenceScore: 0,
        fillerWordsRatio: 0,
        strengths: [] as string[],
        improvementAreas: [] as string[]
    });

    const count = candidateMetrics.length;
    const averages = {
        wordsPerMinute: Math.round(sum.wordsPerMinute / count),
        fluencyScore: sum.fluencyScore / count,
        clarityScore: sum.clarityScore / count,
        confidenceScore: sum.confidenceScore / count,
        fillerWordsRatio: sum.fillerWordsRatio / count,
        strengths: this.getMostFrequentItems(sum.strengths),
        improvementAreas: this.getMostFrequentItems(sum.improvementAreas)
    };

    return averages;
}

    hasValidCandidateMetrics(metrics: any): boolean {
        return metrics && 
               typeof metrics === 'object' && 
               metrics.wordsPerMinute !== undefined &&
               metrics.fluencyScore !== undefined &&
               metrics.clarityScore !== undefined;
    }

 
    private getMostFrequentItems(items: string[]): string[] {
        const frequency: { [key: string]: number } = {};
        
        items.forEach(item => {
            frequency[item] = (frequency[item] || 0) + 1;
        });

        return Object.entries(frequency)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 3)
            .map(([item]) => item);
    }

    async sendInterviewEmail(
        candidateEmail: string,
        candidateName: string,
        interviewHistory: Array<{ user: string; ai: string }>,
        summary?: string,
        difficultyLevel: string = 'junior'
    ): Promise<Result<{ success: boolean; message: string }, EmailError | ValidationError>> {
        try {
            if (!candidateEmail) {
                return err({ type: 'ValidationError', message: "Email del candidato es requerido" });
            }

            const levelConfig = this.DIFFICULTY_LEVELS[difficultyLevel] || this.DIFFICULTY_LEVELS.junior;

            const formattedSummary = summary
                ? marked(summary)
                : `<p>¡Excelente trabajo en la entrevista de nivel ${levelConfig.name}!</p>`;

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
                    .stats { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 15px; margin: 20px 0; }
                    .stat-card { background: white; padding: 15px; border-radius: 8px; text-align: center; border-left: 4px solid #667eea; }
                    .footer { text-align: center; margin-top: 30px; padding: 20px; background: #e9ecef; border-radius: 8px; font-size: 14px; color: #6c757d; }
                    .level-badge { background: #007bff; color: white; padding: 5px 10px; border-radius: 15px; font-size: 12px; display: inline-block; margin-left: 10px; }
                    </style>
                </head>
                <body>
                    <div class="header">
                    <h1>🏆 Resultados de tu Entrevista <span class="level-badge">Nivel ${levelConfig.name}</span></h1>
                    <p>Fecha: ${new Date().toLocaleDateString("es-ES")}</p>
                    </div>
                    
                    <div class="content">
                    <h2>¡Hola ${candidateName || "Candidato"}!</h2>
                    <p>Aquí tienes los resultados completos de tu entrevista de práctica de nivel <strong>${levelConfig.name}</strong>:</p>
                    
                    <div class="stats">
                        <div class="stat-card">
                        <strong>${interviewHistory.length}</strong><br>Preguntas Respondidas
                        </div>
                        <div class="stat-card">
                        <strong>${levelConfig.name}</strong><br>Nivel Evaluado
                        </div>
                        <div class="stat-card">
                        <strong>${levelConfig.totalQuestions}</strong><br>Preguntas Totales
                        </div>
                    </div>
                    
                    <h3>🎯 Resumen Ejecutivo</h3>
                    <div style="background: white; padding: 15px; border-radius: 8px; border-left: 4px solid #10b981;">
                        ${formattedSummary}
                    </div>
                    
                    ${interviewHistory.length > 0 ? `
                    <h3 style="margin-top: 30px;">📝 Detalle de tu Entrevista</h3>
                    ${interviewDetails}
                    ` : ""}
                    </div>
                    
                    <div class="footer">
                    <p>🚀 <strong>Próximos pasos sugeridos:</strong></p>
                    <p>1. Revisa tus respuestas y el feedback recibido<br>
                    2. Practica preguntas específicas para el nivel ${levelConfig.name}<br>
                    3. Programa tu próxima sesión para seguir mejorando</p>
                    <p><em>Generado automáticamente por el Sistema de Entrevistas StarTraining</em></p>
                    </div>
                </body>
                </html>
            `;

            const mailOptions = {
                from: process.env.EMAIL_FROM || '"Sistema de Entrevistas" <agentestartraining@gmail.com>',
                to: candidateEmail,
                subject: `🎯 Resultados Entrevista Nivel ${levelConfig.name} - ${new Date().toLocaleDateString("es-ES")}`,
                html: emailHtml,
            };

            await this.transporter.sendMail(mailOptions);

            return ok({ 
                success: true, 
                message: "Email enviado exitosamente" 
            });

        } catch (error) {
            return err({ 
                type: 'EmailError', 
                message: error instanceof Error ? error.message : 'Error sending email' 
            });
        }
    }
}