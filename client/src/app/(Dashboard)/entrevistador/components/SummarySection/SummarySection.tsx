// src/app/(Dashboard)/entrevistador/components/SummarySection/SummarySection.tsx
import ReactMarkdown from 'react-markdown';
import { ArrowPathIcon, EnvelopeIcon, DocumentChartBarIcon, ChartBarIcon, SpeakerWaveIcon, ClockIcon } from "@heroicons/react/24/solid";

interface SummarySectionProps {
  summary: string;
  isSendingEmail: boolean;
  onSendEmail: () => void;
  onRestartInterview: () => void;
  interviewHistoryLength: number;
  candidateMetricsHistory?: any[];
  // ✅ PROPS ACTUALIZADAS - Ya no necesitamos evaluación manual
  currentLevel: string;
  isEvaluatingLevel: boolean;
  canAdvanceToNextLevel: boolean;
  // ❌ ELIMINADO: onEvaluateLevel ya no se necesita
  overallScore?: number; // ✅ AÑADIDO: Para mostrar puntuación
}

export function SummarySection({
  summary,
  isSendingEmail,
  onSendEmail,
  onRestartInterview,
  interviewHistoryLength,
  candidateMetricsHistory = [],
  // ✅ PROPS ACTUALIZADAS
  currentLevel,
  isEvaluatingLevel,
  canAdvanceToNextLevel,
  overallScore
}: SummarySectionProps) {
  if (!summary) {
    return (
      <div className="bg-gray-800/40 border border-gray-700 rounded-lg p-6 text-center">
        <div className="text-gray-400 mb-3">
          <span className="text-2xl">📊</span>
        </div>
        <h3 className="text-white font-semibold mb-2">Resumen y Análisis</h3>
        <p className="text-gray-400 text-sm">
          {interviewHistoryLength === 0 
            ? "Completa la entrevista para generar el análisis"
            : "Haz clic en 'Obtener Análisis Completo' para ver tu evaluación detallada"
          }
        </p>
        
    
        <div className="mt-4 space-y-2">
          <div className="p-3 bg-blue-500/20 border border-blue-500 rounded-lg">
            <p className="text-blue-300 text-sm">
              <strong>Nivel actual:</strong> {currentLevel.toUpperCase()}
            </p>
          </div>
          
     
          {isEvaluatingLevel && (
            <div className="p-3 bg-purple-500/20 border border-purple-500 rounded-lg">
              <div className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4 text-purple-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span className="text-purple-300 text-sm">Evaluando tu desempeño automáticamente...</span>
              </div>
            </div>
          )}
          
          {overallScore && (
            <div className="p-3 bg-green-500/20 border border-green-500 rounded-lg">
              <p className="text-green-300 text-sm">
                <strong>Puntuación:</strong> {overallScore}/100 puntos
              </p>
            </div>
          )}
          

          {canAdvanceToNextLevel && (
            <div className="p-3 bg-gradient-to-r from-green-500/20 to-emerald-600/20 border border-green-400 rounded-lg">
              <p className="text-green-300 text-sm font-medium">
                🎉 ¡Puedes avanzar al siguiente nivel!
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }


  const calculateAverageMetrics = () => {
    if (candidateMetricsHistory.length === 0) return null;

    const averages = candidateMetricsHistory.reduce((acc, metrics) => {
      return {
        wordsPerMinute: acc.wordsPerMinute + (metrics.wordsPerMinute || 0),
        fluencyScore: acc.fluencyScore + (metrics.fluencyScore || 0),
        clarityScore: acc.clarityScore + (metrics.clarityScore || 0),
        confidenceScore: acc.confidenceScore + (metrics.confidenceScore || 0),
        fillerWords: acc.fillerWords + (metrics.fillerWordsRatio || 0)
      };
    }, {
      wordsPerMinute: 0,
      fluencyScore: 0,
      clarityScore: 0,
      confidenceScore: 0,
      fillerWords: 0
    });

    const count = candidateMetricsHistory.length;
    
    return {
      wordsPerMinute: Math.round(averages.wordsPerMinute / count),
      fluencyScore: Number((averages.fluencyScore / count).toFixed(1)),
      clarityScore: Number((averages.clarityScore / count).toFixed(1)),
      confidenceScore: Number((averages.confidenceScore / count).toFixed(1)),
      fillerWords: Number((averages.fillerWords / count).toFixed(1))
    };
  };


  const getCommunicationTips = () => {
    if (!averageMetrics) return [];

    const tips = [];

    if (averageMetrics.wordsPerMinute < 130) {
      tips.push("💡 Practica aumentar tu ritmo de habla para sonar más dinámico");
    } else if (averageMetrics.wordsPerMinute > 180) {
      tips.push("💡 Intenta reducir ligeramente tu velocidad para mejorar la claridad");
    }

    if (averageMetrics.fluencyScore < 70) {
      tips.push("💡 Trabaja en conectar ideas de forma más fluida");
    }

    if (averageMetrics.confidenceScore < 65) {
      tips.push("💡 Practica proyectar más seguridad en tu tono de voz");
    }

    if (averageMetrics.fillerWords > 15) {
      tips.push("💡 Reduce el uso de muletillas como 'eh', 'este'...");
    }

    return tips.length > 0 ? tips : ["💡 Tu comunicación verbal es sólida, sigue practicando!"];
  };

  const averageMetrics = calculateAverageMetrics();
  const communicationTips = getCommunicationTips();

  return (
    <div className="mt-8 space-y-6 animate-fade-in">

      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 bg-gray-700 text-white px-4 py-2 rounded-lg text-sm font-semibold border border-gray-600">
          <DocumentChartBarIcon className="h-4 w-4" />
          Análisis de Entrevista Completado
        </div>
      
        <div className="mt-2 flex flex-wrap gap-2 justify-center">
          <div className="inline-flex items-center gap-2 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-medium">
            <span>🎯</span>
            Nivel: {currentLevel.toUpperCase()}
          </div>
          {overallScore && (
            <div className="inline-flex items-center gap-2 bg-purple-600 text-white px-3 py-1 rounded-full text-xs font-medium">
              <span>📊</span>
              Puntuación: {overallScore}/100
            </div>
          )}
          {canAdvanceToNextLevel && (
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-3 py-1 rounded-full text-xs font-medium animate-pulse">
              <span>🚀</span>
              ¡Listo para el siguiente nivel!
            </div>
          )}
        </div>
      </div>

      <div className="bg-gray-800 border border-gray-700 rounded-xl shadow-lg overflow-hidden">

        <div className="bg-gray-750 px-6 py-4 border-b border-gray-600">
          <h3 className="text-white font-bold text-lg flex items-center gap-3">
            <div className="bg-gray-700 p-2 rounded-lg">
              📊
            </div>
            <span>Evaluación Integral de la Entrevista</span>
          </h3>
          <p className="text-gray-300 text-sm mt-1">
            {interviewHistoryLength} preguntas respondidas • Nivel {currentLevel.toUpperCase()} • Análisis de contenido y comunicación
            {overallScore && ` • Puntuación: ${overallScore}/100`}
          </p>
        </div>

        <div className="p-6">
          <div className="text-white text-base leading-relaxed bg-gray-750 rounded-lg p-6 border border-gray-600">
            <ReactMarkdown
              components={{
                h1: ({children}) => <h1 className="text-xl font-bold text-purple-200 mb-4 mt-6 first:mt-0 border-b border-gray-600 pb-2">{children}</h1>,
                h2: ({children}) => <h2 className="text-lg font-semibold text-blue-200 mb-3 mt-5 first:mt-0">{children}</h2>,
                h3: ({children}) => <h3 className="font-semibold text-green-200 mb-2 mt-4 first:mt-0">{children}</h3>,
                strong: ({children}) => <strong className="font-bold text-white bg-gray-700 px-1 rounded">{children}</strong>,
                em: ({children}) => <em className="italic text-gray-200">{children}</em>,
                p: ({children}) => <p className="mb-4 last:mb-0 text-gray-100 leading-7">{children}</p>,
                ul: ({children}) => <ul className="list-disc list-inside mb-4 space-y-2 text-gray-100">{children}</ul>,
                ol: ({children}) => <ol className="list-decimal list-inside mb-4 space-y-2 text-gray-100">{children}</ol>,
                li: ({children}) => <li className="ml-2 pl-1">{children}</li>,
                blockquote: ({children}) => <blockquote className="border-l-4 border-yellow-500 pl-4 py-2 my-4 bg-gray-700 text-gray-100 italic">{children}</blockquote>,
                hr: () => <hr className="my-6 border-gray-600" />
              }}
            >
              {summary}
            </ReactMarkdown>
          </div>

      
          {averageMetrics && (
            <div className="mt-6 bg-gray-750 border border-gray-600 rounded-lg p-4">
              <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                <ChartBarIcon className="h-4 w-4 text-blue-400" />
                Métricas de Comunicación Verbal
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                <div className="text-center p-3 bg-gray-700 rounded-lg">
                  <ClockIcon className="h-6 w-6 text-blue-400 mx-auto mb-1" />
                  <div className="text-white font-bold text-lg">{averageMetrics.wordsPerMinute}</div>
                  <div className="text-gray-300 text-xs">palabras/min</div>
                </div>
                <div className="text-center p-3 bg-gray-700 rounded-lg">
                  <SpeakerWaveIcon className="h-6 w-6 text-green-400 mx-auto mb-1" />
                  <div className="text-white font-bold text-lg">{averageMetrics.fluencyScore}%</div>
                  <div className="text-gray-300 text-xs">fluidez</div>
                </div>
                <div className="text-center p-3 bg-gray-700 rounded-lg">
                  <div className="h-6 w-6 text-purple-400 mx-auto mb-1">🎯</div>
                  <div className="text-white font-bold text-lg">{averageMetrics.clarityScore}%</div>
                  <div className="text-gray-300 text-xs">claridad</div>
                </div>
                <div className="text-center p-3 bg-gray-700 rounded-lg">
                  <div className="h-6 w-6 text-yellow-400 mx-auto mb-1">💪</div>
                  <div className="text-white font-bold text-lg">{averageMetrics.confidenceScore}%</div>
                  <div className="text-gray-300 text-xs">confianza</div>
                </div>
                <div className="text-center p-3 bg-gray-700 rounded-lg">
                  <div className="h-6 w-6 text-red-400 mx-auto mb-1">🚫</div>
                  <div className="text-white font-bold text-lg">{averageMetrics.fillerWords}%</div>
                  <div className="text-gray-300 text-xs">muletillas</div>
                </div>
              </div>
            </div>
          )}

        
          <div className="mt-4 bg-gray-750 border border-gray-600 rounded-lg p-4">
            <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
              <div className="h-4 w-4 text-green-400">💡</div>
              Consejos para Mejorar
            </h4>
            <div className="space-y-2">
              {communicationTips.map((tip, index) => (
                <div key={index} className="flex items-start gap-3 text-sm text-gray-200">
                  <span className="flex-shrink-0 mt-0.5">•</span>
                  <span>{tip}</span>
                </div>
              ))}
              <div className="flex items-start gap-3 text-sm text-gray-200">
                <span className="flex-shrink-0 mt-0.5">•</span>
                <span>💡 Graba y revisa tus respuestas para identificar patrones</span>
              </div>
              <div className="flex items-start gap-3 text-sm text-gray-200">
                <span className="flex-shrink-0 mt-0.5">•</span>
                <span>💡 Practica con el formato STAR (Situación, Tarea, Acción, Resultado)</span>
              </div>
           
              {currentLevel === 'junior' && (
                <div className="flex items-start gap-3 text-sm text-blue-200">
                  <span className="flex-shrink-0 mt-0.5">•</span>
                  <span>🌟 <strong>Nivel Junior:</strong> Enfócate en estructurar bien tus respuestas básicas</span>
                </div>
              )}
              {currentLevel === 'mid' && (
                <div className="flex items-start gap-3 text-sm text-blue-200">
                  <span className="flex-shrink-0 mt-0.5">•</span>
                  <span>🌟 <strong>Nivel Mid:</strong> Profundiza en detalles técnicos y casos específicos</span>
                </div>
              )}
              {currentLevel === 'senior' && (
                <div className="flex items-start gap-3 text-sm text-blue-200">
                  <span className="flex-shrink-0 mt-0.5">•</span>
                  <span>🌟 <strong>Nivel Senior:</strong> Enfatiza liderazgo, estrategia y visión a largo plazo</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

   
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={onSendEmail}
          disabled={isSendingEmail}
          className="flex-1 px-6 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-xl flex items-center justify-center gap-3 group"
        >
          {isSendingEmail ? (
            <>
              <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
              Enviando análisis...
            </>
          ) : (
            <>
              <EnvelopeIcon className="h-5 w-5" />
              <div className="text-left">
                <div>Enviar por Email</div>
                <div className="text-indigo-100 text-xs font-normal">
                  Incluye métricas y consejos personalizados
                </div>
              </div>
            </>
          )}
        </button>
      </div>


      <div className="text-center pt-4 border-t border-gray-700">
        <p className="text-gray-400 text-sm mb-2">
          🎯 <strong>Progreso:</strong> Has completado {interviewHistoryLength} preguntas de práctica • Nivel {currentLevel.toUpperCase()}
          {overallScore && ` • Puntuación: ${overallScore}/100`}
        </p>
        <p className="text-gray-400 text-xs">
          {canAdvanceToNextLevel 
            ? "¡Excelente! Estás listo para desafíos más complejos en el siguiente nivel"
            : "Recomendación: Realiza 2-3 entrevistas más para consolidar tus habilidades"
          }
        </p>
      </div>
    </div>
  );
}