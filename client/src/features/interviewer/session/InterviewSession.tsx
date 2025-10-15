'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { InterviewSessionCard } from './components/InterviewSessionCard';
import { useInterviewContext, TOTAL_QUESTIONS, TIME_PER_QUESTION } from '../contexts/InterviewContext';
import { useAudioRecorder } from './hooks/useAudioRecorder';
import { useQuestionTimer } from './hooks/useQuestionTimer';
import { useProcessAudio } from './hooks/useProcessAudio';

export function InterviewSession() {
  const router = useRouter();
  const { interviewId, initialMessage, elapsedTime, pauseTimer, resumeTimer, endInterview, addInterviewTurn } = useInterviewContext();

  const [currentQuestionNumber, setCurrentQuestionNumber] = useState(1);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [questionHistory, setQuestionHistory] = useState<string[]>([]);

  // Calcular tiempo total restante
  const TOTAL_TIME = TOTAL_QUESTIONS * TIME_PER_QUESTION; // 5 preguntas * 120 segundos = 600 segundos (10 minutos)
  const totalTimeRemaining = Math.max(0, TOTAL_TIME - elapsedTime);

  const { isRecording, audioBlob, startRecording, stopRecording, resetRecording } = useAudioRecorder();
  const { processAudio, isLoading: isProcessing } = useProcessAudio();

  const {
    timeLeft: questionTimeLeft,
    isActive: isTimerActive,
    start: startQuestionTimer,
    reset: resetQuestionTimer,
  } = useQuestionTimer({
    initialTime: TIME_PER_QUESTION,
    onTimeUp: () => {
      // Cuando se acaba el tiempo de la pregunta, detener grabación si está activa
      if (isRecording) {
        stopRecording();
      }
    },
  });

  // Redirigir si no hay entrevista activa
  useEffect(() => {
    if (!interviewId) {
      router.push('/entrevistador/init');
    }
  }, [interviewId, router]);

  // Iniciar el timer de la primera pregunta al cargar
  useEffect(() => {
    if (interviewId && initialMessage && currentQuestionNumber === 1 && !currentQuestion) {
      // Usar la pregunta inicial generada por el backend
      setCurrentQuestion(initialMessage);
      startQuestionTimer();
    }
  }, [interviewId, initialMessage, currentQuestionNumber, currentQuestion, startQuestionTimer]);

  // Procesar audio cuando se detiene la grabación
  useEffect(() => {
    if (audioBlob && !isRecording) {
      handleAudioProcessing();
    }
  }, [audioBlob, isRecording]);

  const handleAudioProcessing = async () => {
    if (!audioBlob || !interviewId) return;

    pauseTimer();

    try {
      const result = await processAudio(audioBlob);

      if (result?.success) {
        // Guardar la pregunta actual en el historial
        setQuestionHistory((prev) => [...prev, currentQuestion]);

        // Guardar en el contexto: respuesta del usuario + pregunta del AI + métricas
        addInterviewTurn(result.text, currentQuestion, result.candidateMetrics);

        // Verificar si hay más preguntas
        if (currentQuestionNumber < TOTAL_QUESTIONS) {
          // Avanzar a la siguiente pregunta
          setCurrentQuestionNumber((prev) => prev + 1);
          // La siguiente pregunta viene en aiResponse del backend
          setCurrentQuestion(result.aiResponse);
          resetQuestionTimer(TIME_PER_QUESTION);
          startQuestionTimer();
          resetRecording();
          resumeTimer();
        } else {
          // Entrevista completada
          handleEndInterview();
        }
      }
    } catch (error) {
      console.error('Error procesando audio:', error);
      resumeTimer();
    }
  };

  const handleStartRecording = async () => {
    await startRecording();
  };

  const handleStopRecording = () => {
    stopRecording();
  };

  const handleEndInterview = () => {
    endInterview();
    router.push('/entrevistador/summary');
  };

  if (!interviewId) {
    return null;
  }

  return (
    <div className="min-h-screen pt-4 pb-12 px-6 lg:px-8">
      <InterviewSessionCard
        currentQuestion={currentQuestion}
        questionNumber={currentQuestionNumber}
        totalQuestions={TOTAL_QUESTIONS}
        totalElapsedTime={totalTimeRemaining}
        questionTimeLeft={questionTimeLeft}
        isRecording={isRecording}
        onStartRecording={handleStartRecording}
        onStopRecording={handleStopRecording}
        onEndInterview={handleEndInterview}
        isProcessing={isProcessing}
      />
    </div>
  );
}
