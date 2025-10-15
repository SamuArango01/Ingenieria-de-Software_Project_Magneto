import { MessageSquare, Mic, MicOff, StopCircle, Clock, HelpCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';

interface InterviewSessionCardProps {
  currentQuestion: string;
  questionNumber: number;
  totalQuestions: number;
  totalElapsedTime: number; // en segundos
  questionTimeLeft: number; // en segundos
  isRecording: boolean;
  onStartRecording: () => void;
  onStopRecording: () => void;
  onEndInterview: () => void;
  isProcessing: boolean;
}

export function InterviewSessionCard({
  currentQuestion,
  questionNumber,
  totalQuestions,
  totalElapsedTime,
  questionTimeLeft,
  isRecording,
  onStartRecording,
  onStopRecording,
  onEndInterview,
  isProcessing,
}: InterviewSessionCardProps) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimeColor = (timeLeft: number) => {
    if (timeLeft <= 30) return 'text-red-400';
    if (timeLeft <= 60) return 'text-yellow-400';
    return 'text-green-400';
  };

  return (
    <Card className="w-full max-w-5xl mx-auto shadow-2xl bg-gray-900">
      <CardContent className="p-10 lg:p-12">
        <div className="flex flex-col lg:flex-row gap-8 items-start justify-between px-4 lg:px-6">
          {/* Left side - Question Card */}
          <div className="w-full lg:w-[580px] space-y-4">
            {/* Question Counter */}
            <div className="bg-gray-800 rounded-lg p-4 border-2 border-blue-500/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-blue-400" />
                  <span className="text-blue-400 font-semibold">Pregunta</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-3xl font-bold text-white">{questionNumber}</span>
                  <span className="text-gray-400 text-lg">/ {totalQuestions}</span>
                </div>
              </div>
            </div>

            {/* Question Display Card */}
            <Card className="border-2 border-gray-700 shadow-lg bg-gray-800">
              <CardHeader className="bg-gray-800 border-b border-gray-700">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-xl text-green-400">
                    <MessageSquare className="w-5 h-5" />
                    Pregunta del Entrevistador
                  </CardTitle>

                  {/* Total Elapsed Time */}
                  <div className="flex items-center gap-2 bg-gray-700/50 px-3 py-1.5 rounded-lg">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-mono text-gray-300">{formatTime(totalElapsedTime)}</span>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-6">
                <div className="bg-gray-700/30 rounded-lg p-5 border border-gray-600 min-h-[180px] flex items-center">
                  <p className="text-lg text-gray-200 leading-relaxed">
                    {currentQuestion || 'Cargando pregunta...'}
                  </p>
                </div>

                {/* Question Timer */}
                <div className="mt-4 bg-gray-700/50 rounded-lg p-4 border border-gray-600">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-400">Tiempo restante para esta pregunta</span>
                    <span className={`text-2xl font-mono font-bold ${getTimeColor(questionTimeLeft)}`}>
                      {formatTime(questionTimeLeft)}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-gray-600 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full transition-all duration-1000 ${
                        questionTimeLeft <= 30 ? 'bg-red-500' :
                        questionTimeLeft <= 60 ? 'bg-yellow-500' :
                        'bg-green-500'
                      }`}
                      style={{ width: `${(questionTimeLeft / 120) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* End Interview Button */}
            <Button
              onClick={onEndInterview}
              className="w-full px-6 py-4 rounded-xl bg-gradient-to-br from-red-600 via-red-700 to-red-800 hover:from-red-500 hover:via-red-600 hover:to-red-700 text-white shadow-xl hover:shadow-red-500/50 transition-all duration-300 border-2 border-red-500/30 hover:border-red-400/50 font-semibold flex items-center justify-center gap-2"
            >
              <StopCircle className="w-5 h-5" />
              Terminar Entrevista
            </Button>
          </div>

          {/* Right side - Microphone Button */}
          <div className="w-full lg:w-[320px] flex items-center justify-center">
            <Button
              onClick={isRecording ? onStopRecording : onStartRecording}
              disabled={isProcessing}
              className={`relative group w-64 h-64 rounded-full shadow-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed border-4 ${
                isRecording
                  ? 'bg-gradient-to-br from-red-500 via-red-600 to-red-700 border-red-400 animate-pulse shadow-red-500/50'
                  : 'bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 hover:from-blue-500 hover:via-blue-600 hover:to-blue-700 border-blue-500/30 hover:border-blue-400/50 hover:scale-105 shadow-blue-500/30'
              }`}
            >
              <div className="flex flex-col items-center justify-center gap-4">
                {isProcessing ? (
                  <>
                    <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span className="text-base font-bold text-white">Procesando...</span>
                  </>
                ) : isRecording ? (
                  <>
                    <div className="relative">
                      <MicOff className="w-24 h-24 text-white drop-shadow-lg" strokeWidth={2} />
                      <div className="absolute inset-0 bg-red-300/30 blur-2xl rounded-full"></div>
                    </div>
                    <div className="text-center space-y-1">
                      <div className="text-2xl font-bold text-white">Grabando</div>
                      <div className="text-sm text-red-100 font-medium">Toca para detener</div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="relative">
                      <Mic className="w-24 h-24 text-white group-hover:scale-110 transition-transform drop-shadow-lg" strokeWidth={2} />
                      <div className="absolute inset-0 bg-blue-400/20 blur-xl rounded-full group-hover:bg-blue-300/40 transition-all"></div>
                    </div>
                    <div className="text-center space-y-1">
                      <div className="text-2xl font-bold text-white">Responder</div>
                      <div className="text-sm text-blue-100 font-medium">Toca para hablar</div>
                    </div>
                  </>
                )}
              </div>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
