import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle, Loader2, Award, TrendingUp } from 'lucide-react';

interface InterviewSummaryCardProps {
  candidateName: string;
  evaluation: {
    wouldPass: boolean;
    score: number;
    feedback: string;
  } | null;
  isLoading: boolean;
  onNewInterview: () => void;
}

export function InterviewSummaryCard({
  candidateName,
  evaluation,
  isLoading,
  onNewInterview,
}: InterviewSummaryCardProps) {
  return (
    <div className="max-w-5xl mx-auto">
      <Card className="bg-gray-800/30 border-gray-700/50 shadow-2xl">
        <CardHeader className="border-b border-gray-700/50 bg-gray-900/50 pb-6">
          <CardTitle className="text-3xl text-white text-center font-bold">
            Resumen de Entrevista
          </CardTitle>
          <p className="text-gray-400 text-center mt-2 text-lg">
            Candidato: <span className="text-white font-medium">{candidateName}</span>
          </p>
        </CardHeader>

        <CardContent className="p-8 space-y-8">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16 space-y-4">
              <Loader2 className="w-16 h-16 text-blue-600 animate-spin" />
              <p className="text-gray-400 text-lg">Evaluando entrevista...</p>
            </div>
          ) : evaluation ? (
            <>
              {/* Result Badge */}
              <div className="flex flex-col items-center justify-center py-10 space-y-6">
                <div className={`relative flex items-center justify-center w-32 h-32 rounded-full ${
                  evaluation.wouldPass
                    ? 'bg-green-600/20 border-4 border-green-600'
                    : 'bg-red-600/20 border-4 border-red-600'
                }`}>
                  {evaluation.wouldPass ? (
                    <CheckCircle2 className="w-16 h-16 text-green-600" strokeWidth={2.5} />
                  ) : (
                    <XCircle className="w-16 h-16 text-red-600" strokeWidth={2.5} />
                  )}
                </div>

                <h2 className={`text-5xl font-bold tracking-tight ${
                  evaluation.wouldPass ? 'text-green-600' : 'text-red-600'
                }`}>
                  {evaluation.wouldPass ? 'Aprobado' : 'No Aprobado'}
                </h2>
              </div>

              {/* Score */}
              <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 border border-gray-700/50 rounded-xl p-6 shadow-lg">
                <div className="flex items-center justify-center gap-4">
                  <Award className="w-8 h-8 text-blue-600" />
                  <div className="text-center">
                    <p className="text-gray-400 text-sm font-medium mb-1">Puntuación Final</p>
                    <p className="text-5xl font-bold text-white">
                      {evaluation.score}<span className="text-2xl text-gray-500">/100</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Feedback */}
              <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 border border-gray-700/50 rounded-xl p-8 shadow-lg">
                <div className="flex items-center gap-3 mb-6">
                  <TrendingUp className="w-6 h-6 text-blue-600" />
                  <h3 className="text-2xl font-bold text-white">Retroalimentación Detallada</h3>
                </div>
                <div className="text-gray-300 whitespace-pre-line leading-relaxed text-base">
                  {evaluation.feedback}
                </div>
              </div>

              {/* Action */}
              <div className="flex justify-center pt-6">
                <Button
                  onClick={onNewInterview}
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-6 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
                >
                  Nueva Entrevista
                </Button>
              </div>
            </>
          ) : (
            <div className="text-center py-16">
              <XCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
              <p className="text-gray-400 text-lg mb-6">No se pudo obtener la evaluación.</p>
              <Button
                onClick={onNewInterview}
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-6 text-lg font-semibold rounded-xl"
              >
                Nueva Entrevista
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
