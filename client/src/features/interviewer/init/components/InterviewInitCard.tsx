import type { InterviewType } from '@/features/interview-types/models/interview-type.model';
import { Clock, User, Mic, PlayCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface InterviewInitCardProps {
  userName: string;
  interviewTypes: InterviewType[];
  selectedTypeId: number | null;
  onTypeSelect: (typeId: number | null) => void;
  onStartInterview: () => void;
  isLoadingTypes: boolean;
  isStarting: boolean;
}

export function InterviewInitCard({
  userName,
  interviewTypes,
  selectedTypeId,
  onTypeSelect,
  onStartInterview,
  isLoadingTypes,
  isStarting,
}: InterviewInitCardProps) {
  const selectedType = interviewTypes.find((t) => t.id === selectedTypeId);

  return (
    <Card className="w-full max-w-5xl mx-auto shadow-2xl bg-gray-900">
      <CardContent className="p-10 lg:p-12">
        <div className="flex flex-col lg:flex-row gap-8 items-center justify-between px-4 lg:px-6">
          {/* Left side - Configuration Card */}
          <Card className="w-full lg:w-[520px] border-2 border-gray-700 shadow-lg bg-gray-800">
            <CardHeader className="bg-gray-800 border-b border-gray-700">
              <CardTitle className="flex items-center gap-2 text-xl text-green-400">
                <User className="w-5 h-5" />
                Configuración de Entrevista
              </CardTitle>
              <CardDescription className="text-gray-400">Prepara tu sesión de práctica</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              {/* User Name Display */}
              <div className="bg-gray-700/50 rounded-lg p-4 border border-green-500/30">
                <Label className="text-green-400 text-sm font-semibold">Candidato</Label>
                <p className="text-lg font-bold text-white mt-1">{userName}</p>
              </div>

              {/* Interview Type Selector */}
              <div className="bg-gray-700/50 rounded-lg p-4 border border-blue-500/30 space-y-3">
                <Label htmlFor="interview-type" className="text-blue-400 text-sm font-semibold">Tipo de Entrevista</Label>
                {isLoadingTypes ? (
                  <div className="animate-pulse">
                    <div className="h-10 bg-gray-600 rounded-md mb-2"></div>
                    <div className="h-16 bg-gray-600 rounded-md"></div>
                  </div>
                ) : (
                  <>
                    <Select
                      value={selectedTypeId?.toString() ?? 'general'}
                      onValueChange={(value) => onTypeSelect(value === 'general' ? null : Number(value))}
                    >
                      <SelectTrigger id="interview-type" className="border-blue-500/30 focus:ring-blue-500 bg-gray-800 text-white w-full">
                        <SelectValue placeholder="Selecciona un tipo de entrevista" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700">
                        <SelectItem value="general" className="text-white hover:bg-gray-700">Entrevista General</SelectItem>
                        {interviewTypes.map((type) => (
                          <SelectItem key={type.id} value={type.id.toString()} className="text-white hover:bg-gray-700">
                            {type.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    {/* Description */}
                    {selectedType && (
                      <div className="bg-blue-900/30 border-l-4 border-blue-500 rounded-r-md p-3">
                        <p className="text-sm text-gray-300">{selectedType.description}</p>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Interview Guidelines */}
              <div className="space-y-3 bg-gray-700/50 rounded-lg p-4 border border-gray-600">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-green-400" />
                  <Label className="text-base font-semibold text-white">Información de la Entrevista</Label>
                </div>
                <div className="space-y-2.5 text-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-green-400"></div>
                    <p className="text-gray-300">
                      Duración total: <span className="font-bold text-green-400">15 minutos</span>
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-green-400"></div>
                    <p className="text-gray-300">
                      Tiempo por pregunta: <span className="font-bold text-green-400">2 minutos</span>
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-green-400"></div>
                    <div className="flex items-center gap-1.5 text-gray-300">
                      <Mic className="w-4 h-4 text-green-400" />
                      <p>Responde usando tu voz</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Right side - Info & Start Card */}
          <Card className="w-full lg:w-[340px] border-2 border-gray-700 shadow-lg bg-gray-800">
            <CardContent className="p-6 space-y-6">
              {/* General Info Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-gray-700">
                  <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                  <h3 className="text-lg font-bold text-blue-400">Información General</h3>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-3 bg-gray-700/30 rounded-lg p-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5"></div>
                    <p className="text-gray-300">
                      <span className="font-semibold text-white">5 preguntas</span> basadas en la entrevista de interés
                    </p>
                  </div>

                  <div className="flex items-start gap-3 bg-gray-700/30 rounded-lg p-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5"></div>
                    <p className="text-gray-300">
                      Evaluación en <span className="font-semibold text-white">tiempo real</span>
                    </p>
                  </div>

                  <div className="flex items-start gap-3 bg-gray-700/30 rounded-lg p-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5"></div>
                    <p className="text-gray-300">
                      Retroalimentación <span className="font-semibold text-white">personalizada</span>
                    </p>
                  </div>

                  <div className="flex items-start gap-3 bg-gray-700/30 rounded-lg p-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5"></div>
                    <p className="text-gray-300">
                      Análisis de <span className="font-semibold text-white">fluidez verbal</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Start Button */}
              <button
                onClick={onStartInterview}
                disabled={isStarting}
                className="w-full relative group px-6 py-6 rounded-xl bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 hover:from-blue-500 hover:via-blue-600 hover:to-blue-700 text-white shadow-xl hover:shadow-blue-500/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed border-2 border-blue-500/30 hover:border-blue-400/50 hover:scale-105"
              >
                <div className="flex flex-col items-center justify-center gap-3">
                  {isStarting ? (
                    <>
                      <div className="w-10 h-10 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span className="text-base font-bold">Iniciando...</span>
                    </>
                  ) : (
                    <>
                      <div className="relative">
                        <PlayCircle className="w-16 h-16 group-hover:scale-110 transition-transform drop-shadow-lg" strokeWidth={2} />
                        <div className="absolute inset-0 bg-blue-400/20 blur-xl rounded-full group-hover:bg-blue-300/40 transition-all"></div>
                      </div>
                      <div className="text-center space-y-1">
                        <div className="text-2xl font-bold tracking-tight">Iniciar Entrevista</div>
                        <div className="text-sm text-blue-200 font-medium">¡Estás listo para comenzar!</div>
                      </div>
                    </>
                  )}
                </div>
              </button>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
}
