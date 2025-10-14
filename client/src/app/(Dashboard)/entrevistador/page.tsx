// src/app/(Dashboard)/entrevistador/page.tsx
"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useInterview } from './hooks/useInterview';
import { useInterviewAPI } from './hooks/useInterviewAPI';
import { InterviewTypeSelector } from './components/InterviewTypeSelector/InterviewTypeSelector';
import { AudioRecorder, AudioRecorderHandle } from './components/AudioRecorder/AudioRecorder';
import { InterviewHistory } from './components/InterviewHistory/InterviewHistory';
import { SummarySection } from './components/SummarySection/SummarySection';
import { ControlButtons } from './components/ControlButtons/ControlButtons';

export default function EntrevistadorPage() {
  const { 
    state, 
    updateState, 
    restartInterview,
    restartSameLevel, 
    startInterview, 
    startTimer, 
    stopTimer, 
    updateTimeLeft, 
    resetTimer,
    goToNextQuestion,
    isLastQuestion,
    startTotalTimer,
    stopTotalTimer,
    updateTotalTimeLeft,
    advanceToNextLevel,
    evaluateLevelAdvancement, 
    finishInterviewForEvaluation,
    getCurrentDifficultyConfig,
    getNextLevel,
    clearFeedback 
  } = useInterview();
  
  const { 
    startStarInterview, 
    sendAudio, 
    generateAndSaveEvaluation, // Usamos la nueva función
    sendEmail, 
    evaluateLevelAdvancement: evaluateLevelAPI,
    userEmail, 
    userName 
  } = useInterviewAPI();

  const {
    isRecording,
    error,
    transcribedText,
    aiResponse,
    isProcessing,
    isGeneratingFeedback,
    summary,
    interviewHistory,
    isInterviewFinished,
    isSendingEmail,
    selectedInterviewTypeId,
    candidateMetricsHistory,
    isInterviewStarted,
    initialQuestion,
    timeLeft,
    isTimerRunning,
    currentQuestionNumber,
    totalQuestions,
    totalTimeLeft,
    isTotalTimerRunning,
    currentDifficulty,
    canAdvanceToNextLevel,
    overallScore,
    isEvaluatingLevel,
  } = state;

  const [isStartingInterview, setIsStartingInterview] = useState(false);
  const [interviewId, setInterviewId] = useState<number | null>(null); // 1. Añadimos estado para el ID
  const audioRecorderRef = useRef<AudioRecorderHandle>(null);


  useEffect(() => {
    console.log(" Estado actualizado:", {
      currentQuestionNumber,
      totalQuestions,
      interviewHistoryLength: interviewHistory.length,
      isLastQuestion: isLastQuestion(),
      isInterviewFinished,
      isInterviewStarted,
      isEvaluatingLevel,
      currentDifficulty,
      overallScore,
      canAdvanceToNextLevel
    });
  }, [currentQuestionNumber, totalQuestions, interviewHistory.length, isLastQuestion, isInterviewFinished, isInterviewStarted, isEvaluatingLevel, currentDifficulty, overallScore, canAdvanceToNextLevel]);


  useEffect(() => {
    if (isInterviewFinished && isEvaluatingLevel && interviewHistory.length > 0) {
      handleFinalEvaluation();
    }
  }, [isInterviewFinished, isEvaluatingLevel, interviewHistory.length]);


  const handleRecordingStop = useCallback(() => {
    stopTimer();
    updateState({ isRecording: false });
  }, [stopTimer, updateState]);


  const handleTimeEnd = useCallback(async () => {
    console.log("⏰ Tiempo agotado para la pregunta - procesando automáticamente");
    
    if (isRecording && audioRecorderRef.current) {
      console.log("🔄 Deteniendo grabación automáticamente...");
      
      // Usar el método expuesto por el AudioRecorder para detener y procesar
      audioRecorderRef.current.stopRecordingAndProcess();
      
      updateState({ 
        error: "⏰ Tiempo agotado - procesando tu respuesta automáticamente...",
        isProcessing: true 
      });
    } else if (isRecording) {
      // Fallback si no hay referencia
      handleRecordingStop();
      updateState({ error: "⏰ Tiempo agotado. Toca el micrófono para enviar tu respuesta." });
    } else {
      updateState({ error: "⏰ Tiempo agotado para esta pregunta" });
    }
  }, [isRecording, updateState, handleRecordingStop]);


  const handleTotalTimeEnd = useCallback(() => {
    stopTimer();
    stopTotalTimer();
    finishInterviewForEvaluation();
  }, [stopTimer, stopTotalTimer, finishInterviewForEvaluation]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (isTimerRunning && timeLeft > 0) {
      timer = setInterval(() => {
        updateTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (timeLeft <= 0 && isTimerRunning) {
      handleTimeEnd();
      stopTimer();
    }

    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [isTimerRunning, timeLeft, updateTimeLeft, handleTimeEnd, stopTimer]);


  useEffect(() => {
    let totalTimer: NodeJS.Timeout;
    
    if (isTotalTimerRunning && totalTimeLeft > 0) {
      totalTimer = setInterval(() => {
        updateTotalTimeLeft(totalTimeLeft - 1);
      }, 1000);
    } else if (totalTimeLeft <= 0 && isTotalTimerRunning) {
      handleTotalTimeEnd();
    }

    return () => {
      if (totalTimer) {
        clearInterval(totalTimer);
      }
    };
  }, [isTotalTimerRunning, totalTimeLeft, updateTotalTimeLeft, handleTotalTimeEnd]);

  const handleStartInterview = async () => {
    if (!selectedInterviewTypeId) {
      updateState({ error: "Por favor, selecciona un tipo de entrevista" });
      return;
    }

    setIsStartingInterview(true);
    updateState({ error: "" });

    try {
      console.log("🚀 Iniciando entrevista con:", {
        selectedInterviewTypeId,
        currentDifficulty,
        userName
      });

      const result = await startStarInterview(selectedInterviewTypeId, currentDifficulty);
      
      if (result.success && result.data) {
        setInterviewId(result.data.interviewId); // 2. Guardamos el ID de la entrevista
        startInterview(result.data.initialMessage);
        
        const difficultyConfig = getCurrentDifficultyConfig();
        resetTimer(difficultyConfig.timePerQuestion);
        startTotalTimer();
        
        console.log("👤 Entrevista para:", userName, "Nivel:", currentDifficulty);
        console.log("📊 Configuración:", {
          totalQuestions: difficultyConfig.totalQuestions,
          timePerQuestion: difficultyConfig.timePerQuestion,
          totalTime: difficultyConfig.totalTime
        });
      } else {
        throw new Error(result.error || "Error al iniciar la entrevista");
      }
    } catch (err) {
      console.error(" Error al iniciar entrevista:", err);
      updateState({ 
        error: err instanceof Error ? err.message : "Error al conectar con el servidor" 
      });
    } finally {
      setIsStartingInterview(false);
    }
  };

  const handleRecordingStart = useCallback(() => {
    if (!isInterviewStarted) {
      updateState({ error: "Primero debes iniciar la entrevista" });
      return;
    }

    if (isInterviewFinished) {
      updateState({ error: "La entrevista ya ha finalizado" });
      return;
    }

    const isActuallyLastQuestion = isLastQuestion() && interviewHistory.length >= totalQuestions - 1;
    
    if (isActuallyLastQuestion) {
      updateState({ error: "Esta es la última pregunta de la entrevista" });
      return;
    }
    
    if (!isTimerRunning) {
      startTimer();
    }
    
    updateState({ isRecording: true, error: "" });
  }, [isInterviewStarted, isInterviewFinished, isLastQuestion, interviewHistory.length, totalQuestions, isTimerRunning, startTimer, updateState]);

  const handleAudioProcessed = async (audioBlob: Blob) => {
    console.log("🎵 Procesando audio, pregunta actual:", currentQuestionNumber);
    
    if (!isInterviewStarted || isInterviewFinished) {
      updateState({ error: "La entrevista no está activa" });
      return;
    }

    updateState({ isProcessing: true, error: "" });

    try {
      const result = await sendAudio(audioBlob, selectedInterviewTypeId, currentDifficulty);

      if (result.success && result.aiResponse) {
        const newCandidateMetrics = result.candidateMetrics ? 
          [...candidateMetricsHistory, result.candidateMetrics] : 
          candidateMetricsHistory;

        const newInterviewHistory = [
          ...interviewHistory,
          { 
            user: result.text || "(Audio procesado)", 
            ai: result.aiResponse 
          },
        ];


        updateState({
          transcribedText: result.text || "",
          aiResponse: result.aiResponse,
          interviewHistory: newInterviewHistory,
          candidateMetricsHistory: newCandidateMetrics,
          isProcessing: false,
          error: ""
        });

        setTimeout(() => {
          const shouldAdvance = !isLastQuestion();
          const hasCompletedAllQuestions = interviewHistory.length + 1 >= totalQuestions;
          
          console.log("⏱️ Decidiendo avance:", {
            shouldAdvance,
            hasCompletedAllQuestions,
            currentQuestion: currentQuestionNumber,
            totalQuestions: totalQuestions,
            interviewHistoryLength: interviewHistory.length,
            isLastQuestion: isLastQuestion()
          });

          if (shouldAdvance && !hasCompletedAllQuestions) {
            goToNextQuestion();
            
            const difficultyConfig = getCurrentDifficultyConfig();
            resetTimer(difficultyConfig.timePerQuestion);
          } else {
            finishInterviewForEvaluation();
          }
        }, 1000);

      } else {
        throw new Error(result.error || "No se pudo generar respuesta del asistente");
      }

    } catch (err: any) {
      console.error(" Error en handleAudioProcessed:", err);
      updateState({ 
        error: err.message || "Error al procesar audio",
        isProcessing: false
      });
    }
  };


  const handleFinalEvaluation = async () => {
    if (interviewHistory.length === 0 || !interviewId) return; // 3. Añadimos guarda por si no hay ID

    clearFeedback();
    
    updateState({ 
      isGeneratingFeedback: true, 
      error: "📊 Evaluando tu desempeño completo..." 
    });
    
    try {
      console.log("🎯 Iniciando evaluación final del nivel:", currentDifficulty);

      // Primero, generamos y guardamos la evaluación
      const evaluationResult = await generateAndSaveEvaluation(interviewHistory, interviewId);

      if (evaluationResult.success && evaluationResult.data) {
        updateState({ 
          summary: evaluationResult.summary
        });

        // Luego, usamos los datos de la evaluación guardada para el resto de la lógica
        const finalScore = evaluationResult.data.rating;
        // Asumimos que la lógica de avance se puede determinar con la puntuación
        const difficultyConfig = getCurrentDifficultyConfig();
        const canAdvance = finalScore ? finalScore >= (difficultyConfig.requiredScore / 10) * 10 : false; // Ajustar escala si es necesario

        updateState({
          canAdvanceToNextLevel: canAdvance,
          overallScore: finalScore,
          isGeneratingFeedback: false,
          isEvaluatingLevel: false, 
          error: canAdvance ? 
            `🎉 ¡Excelente! Puntuación: ${finalScore}/10 - Puedes avanzar` :
            `📊 Puntuación: ${finalScore}/10 - Sigue practicando en este nivel.`
        });
      } else {
        throw new Error(evaluationResult.error || "Error en la evaluación final");
      }
    } catch (err) {
      console.error("❌ Error en evaluación final:", err);
      updateState({ 
        error: err instanceof Error ? err.message : "Error evaluando desempeño",
        isGeneratingFeedback: false,
        isEvaluatingLevel: false 
      });
    }
  };

 
  const handleAdvanceToNextLevel = () => {
    console.log("🚀 Avanzando al siguiente nivel...");
    advanceToNextLevel();
  };

  const handleGenerateCompleteFeedback = async () => {
    if (interviewHistory.length === 0 || !interviewId) {
      updateState({ error: "No hay entrevista activa para generar feedback" });
      return;
    }

    clearFeedback();
    
    updateState({ 
      isGeneratingFeedback: true,
      error: "" 
    });
    
    try {
      console.log("📊 Generando análisis completo...");
      const result = await generateAndSaveEvaluation(interviewHistory, interviewId);

      if (result.success) {
        updateState({ 
          summary: result.summary,
          error: "✅ Análisis completo generado y guardado exitosamente"
        });
      } else {
        throw new Error(result.error || "Error generando el análisis");
      }
    } catch (err) {
      console.error(" Error generando feedback:", err);
      updateState({ 
        error: err instanceof Error ? err.message : "Error al conectar con el servidor" 
      });
    } finally {
      updateState({ isGeneratingFeedback: false });
    }
  };

  const handleFinishInterview = () => {
    console.log("🏁 Finalizando entrevista manualmente");
    finishInterviewForEvaluation();
  };

  const handleSendEmail = async () => {
    if (!summary) {
      updateState({ error: "Primero genera el análisis antes de enviar el email" });
      return;
    }

    if (!userEmail) {
      updateState({ error: "No se pudo obtener tu email" });
      return;
    }

    updateState({ isSendingEmail: true, error: "" });
    
    try {
      const result = await sendEmail(userEmail, userName, interviewHistory, summary, currentDifficulty);

      if (result.success) {
        alert(`✅ Correo enviado exitosamente a ${userEmail}`);
      } else {
        throw new Error(result.error || "Error al enviar el correo");
      }
    } catch (err) {
      updateState({ 
        error: err instanceof Error ? err.message : 'Error de conexión al enviar el correo' 
      });
    } finally {
      updateState({ isSendingEmail: false });
    }
  };

  const handleInterviewTypeChange = (value: string) => {
    updateState({ selectedInterviewTypeId: value });
  };

  const handleError = (errorMsg: string) => {
    updateState({ error: errorMsg });
  };

  // Función para formatear el tiempo total
  const formatTotalTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Obtener configuración actual
  const currentDifficultyConfig = getCurrentDifficultyConfig();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-black p-4 sm:p-8">
      <div className="mx-auto max-w-6xl">
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 sm:p-8 shadow-2xl">

          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-white">Entrevista Inteligente</h1>
              <p className="text-sm text-gray-400 mt-1">
                {userName ? `Personalizada para ${userName}` : 'Bienvenido/a'} 
                {isInterviewStarted && ` - Nivel: ${currentDifficulty.toUpperCase()}`}
                {isInterviewStarted && ` - Pregunta ${currentQuestionNumber} de ${totalQuestions}`}
                {overallScore && ` - Puntuación: ${overallScore}/100`}
              </p>
            </div>
            
            {isInterviewStarted && (
              <div className="text-right">
                <div className={`text-2xl sm:text-3xl font-bold ${totalTimeLeft <= 300 ? 'text-red-400 animate-pulse' : 'text-white'}`}>
                  {formatTotalTime(totalTimeLeft)}
                </div>
                <div className="text-xs text-gray-400 mt-1">Tiempo total</div>
              </div>
            )}
          </div>

          {/* Contenido principal */}
          <div className="space-y-8">
            {!isInterviewStarted ? (
      
              <div className="grid md:grid-cols-2 gap-6">
                <div className="p-6 bg-gray-900/20 border border-gray-700 rounded-lg">
                  <h3 className="text-white font-semibold mb-4">Configuración de la entrevista</h3>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm text-gray-300 mb-2">Tipo de entrevista</label>
                      <InterviewTypeSelector 
                        selectedInterviewTypeId={selectedInterviewTypeId} 
                        onInterviewTypeChange={handleInterviewTypeChange} 
                      />
                    </div>
                    
                    
                    <div className="p-4 bg-blue-500/20 border border-blue-500 rounded-lg">
                      <h4 className="text-blue-300 font-semibold mb-2">🎯 Sistema de Niveles Progresivo</h4>
                      <div className="space-y-2 text-sm text-blue-200">
                        <div className="flex items-center gap-2">
                          <span>🚀</span>
                          <span><strong>Comienzas en Junior</strong> - Avance automático por desempeño</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span>📊</span>
                          <span>Evaluación integral: <strong>60% contenido + 40% comunicación</strong></span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span>🎯</span>
                          <span>Puntajes requeridos: <strong>Junior → 70% | Mid → 75% | Senior → 80%</strong></span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2 text-sm text-gray-400">
                      <div className="flex items-center gap-2">
                        <span>📝</span>
                        <span>{currentDifficultyConfig.totalQuestions} preguntas por nivel</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span>⏱️</span>
                        <span>Tiempo por pregunta: {currentDifficultyConfig.timePerQuestion / 60}min</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span>🕐</span>
                        <span>Tiempo total: {formatTotalTime(currentDifficultyConfig.totalTime)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span>👤</span>
                        <span>Entrevistado: <strong className="text-white">{userName || 'Candidato/a'}</strong></span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-gray-900/20 border border-gray-700 rounded-lg flex flex-col">
                  <div className="flex-1">
                    <h3 className="text-white font-semibold mb-2">Estado del sistema</h3>
                    <p className="text-sm text-gray-400 mb-4">
                      Todo listo para comenzar la entrevista STAR
                    </p>
                    
                    <div className="bg-green-500/20 border border-green-500 rounded-lg p-4 mb-4">
                      <h4 className="text-green-300 font-semibold mb-2">✅ Sistema Automático Activado</h4>
                      <p className="text-sm text-green-200">
                        Tu progreso se evaluará automáticamente al finalizar cada nivel.
                        No necesitas seleccionar dificultad - el sistema se adapta a tu desempeño.
                      </p>
                    </div>

                  </div>
                  
                  <div className="space-y-3">
                    <button 
                      onClick={handleStartInterview} 
                      disabled={isStartingInterview || !selectedInterviewTypeId}
                      className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white font-bold py-3 px-4 rounded-lg transition-all duration-200 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isStartingInterview ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Iniciando...
                        </>
                      ) : (
                        `🎤 Comenzar Entrevista ${currentDifficulty.toUpperCase()}`
                      )}
                    </button>
                    
                    {error && (
                      <div className="p-3 bg-red-500/20 border border-red-500 rounded-lg text-red-300 text-sm">
                        {error}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-8">
                {isEvaluatingLevel && isGeneratingFeedback && (
                  <div className="p-4 bg-purple-500/20 border border-purple-500 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="animate-spin">⏳</div>
                      <div>
                        <h4 className="font-bold text-purple-300">Evaluando tu desempeño...</h4>
                        <p className="text-purple-200 text-sm">
                          Analizando tus respuestas y habilidades de comunicación. Esto puede tomar unos momentos.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                {canAdvanceToNextLevel && !isEvaluatingLevel && (
                  <div className="p-4 bg-gradient-to-r from-green-500 to-emerald-600 border border-green-400 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">🎉</span>
                        <div>
                          <h4 className="font-bold text-white">¡Puedes avanzar al siguiente nivel!</h4>
                          <p className="text-green-100 text-sm">
                            Puntuación: <strong>{overallScore}/100</strong> - {getNextLevel() ? `Próximo nivel: ${getNextLevel()?.toUpperCase()}` : '¡Nivel máximo alcanzado!'}
                          </p>
                        </div>
                      </div>
                      {getNextLevel() && (
                        <button
                          onClick={handleAdvanceToNextLevel}
                          className="bg-white text-green-600 font-semibold py-2 px-4 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          Avanzar Automáticamente
                        </button>
                      )}
                    </div>
                  </div>
                )}
                {isInterviewFinished && !canAdvanceToNextLevel && !isEvaluatingLevel && (
                  <div className="p-4 bg-orange-500/20 border border-orange-500 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">🔄</span>
                        <div>
                          <h4 className="font-bold text-orange-300">Practica más en este nivel</h4>
                          <p className="text-orange-200 text-sm">
                            Puntuación: <strong>{overallScore}/100</strong> - Puedes reiniciar la entrevista en el mismo nivel para mejorar tu desempeño.
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={restartSameLevel}
                        className="bg-orange-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-orange-600 transition-colors"
                      >
                        Reiniciar en {currentDifficulty.toUpperCase()}
                      </button>
                    </div>
                  </div>
                )}

                <div className="grid lg:grid-cols-3 gap-8">
             
                  <div className="lg:col-span-2 space-y-6">
                    <div className="bg-gray-800/40 border border-gray-700 rounded-xl p-6">
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                          <div className="bg-purple-600 text-white text-sm font-semibold px-3 py-1 rounded-full">
                            Pregunta {currentQuestionNumber} de {totalQuestions}
                          </div>
                          <div className="bg-blue-600 text-white text-sm font-semibold px-3 py-1 rounded-full">
                            Nivel: {currentDifficulty.toUpperCase()}
                          </div>
                          {isLastQuestion() && interviewHistory.length >= totalQuestions - 1 && !isInterviewFinished && (
                            <div className="bg-orange-600 text-white text-sm font-semibold px-3 py-1 rounded-full">
                              🎯 ÚLTIMA PREGUNTA
                            </div>
                          )}
                        </div>
                        
                        <div className="text-right">
                          <div className={`text-2xl font-bold ${timeLeft <= 10 ? 'text-red-400' : 'text-white'}`}>
                            {timeLeft}s
                          </div>
                          <div className="text-xs text-gray-400">
                            {isTimerRunning ? '⏰ En progreso' : '⏸️ Pausado'}
                          </div>
                        </div>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2 mb-6">
                        <div 
                          className="bg-green-500 h-2 rounded-full transition-all duration-500" 
                          style={{ width: `${(currentQuestionNumber / totalQuestions) * 100}%` }} 
                        />
                      </div>
                      <div className="mb-6">
                        <h3 className="text-white font-semibold mb-4">Pregunta Actual</h3>
                        <InterviewHistory
                          transcribedText={transcribedText}
                          aiResponse={aiResponse}
                          interviewHistory={interviewHistory}
                          initialQuestion={initialQuestion}
                        />
                      </div>
                      {!isInterviewFinished && (
                        <div className="flex flex-col items-center space-y-6 mb-6">
                          <AudioRecorder
                            ref={audioRecorderRef}
                            isRecording={isRecording}
                            isProcessing={isProcessing}
                            isInterviewFinished={isInterviewFinished}
                            onRecordingStart={handleRecordingStart}
                            onRecordingStop={handleRecordingStop}
                            onAudioProcessed={handleAudioProcessed}
                            onError={handleError}
                          />
                          
                          <div className="text-center">
                            {isRecording ? (
                              <div className="flex items-center justify-center gap-3 text-green-400">
                                <span className="animate-pulse">🎙️ Grabando...</span>
                                <div className="flex space-x-1 items-end">
                                  <div className="h-3 w-1 bg-green-400 animate-bounce" />
                                  <div className="h-5 w-1 bg-green-300 animate-bounce delay-100" />
                                  <div className="h-4 w-1 bg-green-400 animate-bounce delay-200" />
                                </div>
                              </div>
                            ) : isProcessing ? (
                              <div className="text-yellow-400 text-sm">
                                🔄 Procesando tu respuesta... (Puede tomar hasta 2 minutos)
                              </div>
                            ) : (
                              <div className="text-gray-400 text-sm">
                                🎤 Toca el micrófono para grabar tu respuesta
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                      <div>
                        <h3 className="text-white font-semibold mb-4">Resumen y análisis</h3>
                        <SummarySection
                          summary={summary}
                          isSendingEmail={isSendingEmail}
                          onSendEmail={handleSendEmail}
                          onRestartInterview={restartSameLevel} 
                          interviewHistoryLength={interviewHistory.length}
                          candidateMetricsHistory={candidateMetricsHistory}
                          currentLevel={currentDifficulty}
                          isEvaluatingLevel={isEvaluatingLevel}
                          canAdvanceToNextLevel={canAdvanceToNextLevel}
                          overallScore={overallScore}
                        />
                      </div>
                    </div>
                  </div>

             
                  <div className="space-y-6">
                    <div className="bg-gray-800/40 border border-gray-700 rounded-xl p-6">
                      <h3 className="text-white font-semibold mb-4">Controles</h3>
                      <div className="space-y-4">
                        <InterviewTypeSelector
                          selectedInterviewTypeId={selectedInterviewTypeId}
                          onInterviewTypeChange={handleInterviewTypeChange}
                        />
                        
                        <ControlButtons
                          isRecording={isRecording}
                          isInterviewFinished={isInterviewFinished}
                          interviewHistoryLength={interviewHistory.length}
                          isGeneratingFeedback={isGeneratingFeedback}
                          summary={summary}
                          onFinishInterview={handleFinishInterview}
                          onGenerateCompleteFeedback={handleGenerateCompleteFeedback}
                          onRestartInterview={restartSameLevel} 
                          onAdvanceToNextLevel={handleAdvanceToNextLevel}
                          canAdvanceToNextLevel={canAdvanceToNextLevel}
                          isEvaluatingLevel={isEvaluatingLevel}
                        />
                      </div>
                    </div>

                    {error && (
                      <div className="p-4 bg-red-500/20 border border-red-500 rounded-lg">
                        <p className="text-red-300 text-sm">{error}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}