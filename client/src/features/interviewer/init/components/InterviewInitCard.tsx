import type { InterviewType } from '@/features/interview-types/models/interview-type.model';
import { Clock, User, Mic, PlayCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';

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
    <Card className="w-full max-w-5xl mx-auto shadow-2xl bg-gradient-to-br from-card to-muted/30">
      <CardContent className="p-8">
        <div className="flex flex-col lg:flex-row gap-8 items-center">
          {/* Left side - Configuration Card */}
          <Card className="w-full lg:w-[500px] border-2 border-primary/20 shadow-lg bg-card">
            <CardHeader className="bg-primary/5 border-b border-primary/10">
              <CardTitle className="flex items-center gap-2 text-xl text-primary">
                <User className="w-5 h-5" />
                Configuración de Entrevista
              </CardTitle>
              <CardDescription className="text-muted-foreground">Prepara tu sesión de práctica</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              {/* User Name Display */}
              <div className="bg-primary/5 rounded-lg p-4 border border-primary/20">
                <Label className="text-primary text-sm font-semibold">Candidato</Label>
                <p className="text-lg font-bold text-foreground mt-1">{userName}</p>
              </div>

              {/* Interview Type Selector */}
              <div className="bg-primary/5 rounded-lg p-4 border border-primary/20 space-y-3">
                <Label htmlFor="interview-type" className="text-primary text-sm font-semibold">Tipo de Entrevista</Label>
                {isLoadingTypes ? (
                  <div className="animate-pulse">
                    <div className="h-10 bg-muted rounded-md mb-2"></div>
                    <div className="h-16 bg-muted rounded-md"></div>
                  </div>
                ) : (
                  <>
                    <Select
                      value={selectedTypeId?.toString() ?? 'general'}
                      onValueChange={(value) => onTypeSelect(value === 'general' ? null : Number(value))}
                    >
                      <SelectTrigger id="interview-type" className="border-primary/30 focus:ring-primary bg-background">
                        <SelectValue placeholder="Selecciona un tipo de entrevista" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">Entrevista General</SelectItem>
                        {interviewTypes.map((type) => (
                          <SelectItem key={type.id} value={type.id.toString()}>
                            {type.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    {/* Description */}
                    {selectedType && (
                      <div className="bg-primary/10 border-l-4 border-primary rounded-r-md p-3">
                        <p className="text-sm text-foreground">{selectedType.description}</p>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Interview Guidelines */}
              <div className="space-y-3 bg-primary/5 rounded-lg p-4 border border-primary/20">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary" />
                  <Label className="text-base font-semibold text-foreground">Información de la Entrevista</Label>
                </div>
                <div className="space-y-2.5 text-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                    <p className="text-muted-foreground">
                      Duración total: <span className="font-bold text-primary">15 minutos</span>
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                    <p className="text-muted-foreground">
                      Tiempo por pregunta: <span className="font-bold text-primary">2 minutos</span>
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Mic className="w-4 h-4 text-primary" />
                      <p>Responde usando tu voz</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Right side - Start Button (Round) */}
          <div className="flex items-center justify-center lg:min-h-full">
            <button
              onClick={onStartInterview}
              disabled={isStarting}
              className="relative w-56 h-56 lg:w-64 lg:h-64 rounded-full bg-gradient-to-br from-primary via-primary/90 to-primary/70 hover:from-primary hover:via-primary/95 hover:to-primary/80 text-primary-foreground shadow-2xl hover:shadow-primary/40 hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 group ring-4 ring-primary/20"
            >
              <div className="flex flex-col items-center justify-center gap-4">
                {isStarting ? (
                  <>
                    <div className="w-16 h-16 border-4 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin"></div>
                    <span className="text-xl font-bold">Iniciando...</span>
                  </>
                ) : (
                  <>
                    <PlayCircle className="w-24 h-24 group-hover:scale-110 transition-transform drop-shadow-lg" strokeWidth={1.5} />
                    <div className="text-center">
                      <div className="text-3xl font-bold tracking-tight">Iniciar</div>
                      <div className="text-xl font-semibold">Entrevista</div>
                    </div>
                  </>
                )}
              </div>
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
