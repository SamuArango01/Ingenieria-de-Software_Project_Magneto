// helpers/TranscribeAudio.ts
import { createClient } from "@deepgram/sdk";
import fs from "fs";

const deepgram = createClient(process.env.DEEPGRAM_API_KEY || "");

export interface CandidateAnalysis {
  text: string;
  candidateMetrics: any;
}

export const analyzeCandidateSpeech = async (
  audioFilePath: string
): Promise<CandidateAnalysis> => {
  try {
    console.log("🎯 Starting audio analysis for:", audioFilePath);
    
    if (!process.env.DEEPGRAM_API_KEY) {
      throw new Error("Deepgram API key not configured");
    }

    if (!fs.existsSync(audioFilePath)) {
      throw new Error(`Audio file not found: ${audioFilePath}`);
    }

    const audioBuffer = fs.readFileSync(audioFilePath);
    console.log("📁 Audio file size:", audioBuffer.length, "bytes");

    if (audioBuffer.length === 0) {
      throw new Error("Audio file is empty");
    }

    console.log("🔊 Sending audio to Deepgram...");
    const { result, error } = await deepgram.listen.prerecorded.transcribeFile(
      audioBuffer,
      {
        model: "nova-2",
        language: "es",
        smart_format: true,
        punctuate: true,
      }
    );

    if (error) {
      console.error("❌ Deepgram API error:", error);
      throw new Error(`Deepgram error: ${error.message}`);
    }

    const transcript =
      result?.results?.channels?.[0]?.alternatives?.[0]?.transcript;

    console.log("📝 Transcript found:", transcript);

    if (!transcript) {
      const words = result?.results?.channels?.[0]?.alternatives?.[0]?.words;
      
      if (words && words.length > 0) {
        const manualTranscript = words.map((word: any) => word.word).join(' ');
        console.log("🛠️ Building manual transcript from words");
        
        const candidateMetrics = analyzeCandidatePerformance(result);
        
        return {
          text: manualTranscript,
          candidateMetrics
        };
      }

      throw new Error("No transcript found");
    }

    const candidateMetrics = analyzeCandidatePerformance(result);
    
    console.log("🎯 Candidate Speech Analysis:", candidateMetrics);

    return {
      text: transcript,
      candidateMetrics
    };
  } catch (error) {
    console.error("❌ Error in analyzeCandidateSpeech:", error);
    
    return {
      text: "No se pudo transcribir el audio. Por favor, intenta nuevamente.",
      candidateMetrics: getDefaultCandidateMetrics()
    };
  }
};

// ✅ ANÁLISIS SIMPLIFICADO Y EFECTIVO
function analyzeCandidatePerformance(deepgramResult: any) {
  try {
    const channel = deepgramResult?.results?.channels?.[0];
    const alternative = channel?.alternatives?.[0];
    
    if (!alternative) {
      return getDefaultCandidateMetrics();
    }

    const words = alternative.words || [];
    const duration = deepgramResult.metadata?.duration || 1;
    const totalWords = words.length;

    // ✅ MÉTRICAS ESENCIALES DIRECTAS
    const wordsPerMinute = Math.round((totalWords / duration) * 60);
    
    // Conteo directo de muletillas
    const fillerWords = countFillerWords(words);
    const fillerRatio = totalWords > 0 ? fillerWords / totalWords : 0;
    
    // Análisis de confianza basado en palabras
    const confidenceScore = calculateSimpleConfidence(words);
    
    // Análisis de pausas simple
    const pauseAnalysis = analyzeSimplePauses(words);
    
    // ✅ EVALUACIONES DIRECTAS
    const speakingPace = evaluateSimplePace(wordsPerMinute);
    const confidenceLevel = evaluateSimpleConfidence(confidenceScore);
    const fluencyLevel = evaluateSimpleFluency(fillerRatio, pauseAnalysis.frequency);
    
    // ✅ ÁREAS CLAVE DE MEJORA (más específicas)
    const improvementAreas = identifyKeyImprovements({
      wpm: wordsPerMinute,
      fillerRatio,
      confidence: confidenceScore,
      pauseFrequency: pauseAnalysis.frequency
    });
    
    const strengths = identifyKeyStrengths({
      wpm: wordsPerMinute,
      fillerRatio,
      confidence: confidenceScore,
      pauseFrequency: pauseAnalysis.frequency
    });

    const metrics = {
      // Métricas básicas
      wordsPerMinute,
      totalWords,
      totalDuration: duration,
      
      // Calificaciones simples
      confidenceScore: Math.round(confidenceScore * 100),
      fluencyScore: Math.round((1 - Math.min(fillerRatio * 3, 0.7)) * 100),
      clarityScore: Math.round(confidenceScore * 100),
      
      // Hábitos de habla
      fillerWordsCount: fillerWords,
      fillerWordsRatio: Math.round(fillerRatio * 100),
      pauseFrequency: Math.round(pauseAnalysis.frequency * 100),
      
      // Evaluaciones
      speakingPace,
      confidenceLevel,
      fluencyLevel,
      
      // Recomendaciones
      improvementAreas,
      strengths
    };

    console.log("✅ Simplified candidate metrics:", metrics);
    return metrics;

  } catch (error) {
    console.error("❌ Error in analyzeCandidatePerformance:", error);
    return getDefaultCandidateMetrics();
  }
}

// ✅ MÉTRICAS POR DEFECTO SIMPLIFICADAS
function getDefaultCandidateMetrics() {
  return {
    wordsPerMinute: 140,
    totalWords: 0,
    totalDuration: 1,
    confidenceScore: 70,
    fluencyScore: 70,
    clarityScore: 70,
    fillerWordsCount: 0,
    fillerWordsRatio: 0,
    pauseFrequency: 10,
    speakingPace: "ideal",
    confidenceLevel: "moderado",
    fluencyLevel: "aceptable",
    improvementAreas: ["evaluacion_inicial"],
    strengths: ["desempeno_base"]
  };
}

// ✅ CONTEO DIRECTO DE MULETILLAS
function countFillerWords(words: any[]): number {
  const spanishFillers = [
    'eh', 'ah', 'um', 'este', 'o sea', 'pues', 'bueno', 'entonces', 
    'como', 'vale', 'okay', 'mmm', 'ajá', 'digamos', 'es que'
  ];
  
  return words.filter((word: any) => 
    spanishFillers.includes(word.word?.toLowerCase().trim())
  ).length;
}

// ✅ CONFIANZA BASADA EN PALABRAS CLARAS
function calculateSimpleConfidence(words: any[]): number {
  if (words.length === 0) return 0.7;
  
  const highConfidenceWords = words.filter(word => (word.confidence || 0) > 0.8).length;
  return highConfidenceWords / words.length;
}

// ✅ ANÁLISIS SIMPLE DE PAUSAS
function analyzeSimplePauses(words: any[]) {
  if (words.length < 2) {
    return { frequency: 0.1, averageDuration: 0.2 };
  }
  
  let longPauses = 0;
  for (let i = 1; i < words.length; i++) {
    const pauseDuration = words[i].start - words[i-1].end;
    if (pauseDuration > 0.5) {
      longPauses++;
    }
  }
  
  return { 
    frequency: longPauses / words.length,
    averageDuration: 0.3 // Valor por defecto simplificado
  };
}

// ✅ EVALUACIONES DIRECTAS Y CLARAS
function evaluateSimplePace(wpm: number): string {
  if (wpm < 120) return "muy_lento";
  if (wpm < 140) return "lento";
  if (wpm <= 160) return "ideal";
  if (wpm <= 180) return "rapido";
  return "muy_rapido";
}

function evaluateSimpleConfidence(confidenceScore: number): string {
  if (confidenceScore >= 0.8) return "excelente";
  if (confidenceScore >= 0.7) return "alto";
  if (confidenceScore >= 0.5) return "moderado";
  return "necesita_mejorar";
}

function evaluateSimpleFluency(fillerRatio: number, pauseFrequency: number): string {
  const fluencyScore = (1 - fillerRatio) * (1 - pauseFrequency);
  
  if (fluencyScore >= 0.85) return "muy_fluido";
  if (fluencyScore >= 0.70) return "fluido";
  if (fluencyScore >= 0.55) return "aceptable";
  return "poco_fluido";
}

// ✅ IDENTIFICACIÓN DIRECTA DE PROBLEMAS Y FORTALEZAS
function identifyKeyImprovements(metrics: any): string[] {
  const areas: string[] = [];
  
  if (metrics.wpm < 130) areas.push("hablar_mas_rapido");
  if (metrics.wpm > 170) areas.push("reducir_velocidad");
  if (metrics.fillerRatio > 0.1) areas.push("reducir_muletillas");
  if (metrics.confidence < 0.6) areas.push("mejorar_confianza");
  if (metrics.pauseFrequency > 0.15) areas.push("reducir_pausas_largas");
  
  return areas.length > 0 ? areas : ["mantener_buen_ritmo"];
}

function identifyKeyStrengths(metrics: any): string[] {
  const strengths: string[] = [];
  
  if (metrics.wpm >= 140 && metrics.wpm <= 160) strengths.push("ritmo_ideal");
  if (metrics.fillerRatio <= 0.05) strengths.push("pocas_muletillas");
  if (metrics.confidence >= 0.75) strengths.push("buena_confianza");
  if (metrics.pauseFrequency <= 0.08) strengths.push("pausas_adecuadas");
  
  return strengths.length > 0 ? strengths : ["comunicacion_efectiva"];
}