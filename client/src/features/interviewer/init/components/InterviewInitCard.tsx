import type { InterviewType } from '@/features/interview-types/models/interview-type.model';
import { Clock, User, Mic, PlayCircle } from 'lucide-react';

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
    <div className="w-full max-w-5xl mx-auto bg-card rounded-lg shadow-lg border border-border p-8">
      <div className="grid grid-cols-1 lg:grid-cols-[2fr,1fr] gap-6">
        {/* Left side - Configuration */}
        <div className="space-y-6">
          {/* User Name Display */}
          <div className="bg-muted/50 rounded-lg p-4 border border-border">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-2">
              <User className="w-4 h-4 text-primary" />
              Candidato
            </div>
            <p className="text-lg font-semibold text-foreground">{userName}</p>
          </div>

          {/* Interview Type Selector */}
          <div className="bg-muted/50 rounded-lg p-4 border border-border">
            <label htmlFor="interview-type" className="block text-sm font-medium text-foreground mb-2">
              Tipo de Entrevista
            </label>
            {isLoadingTypes ? (
              <div className="animate-pulse">
                <div className="h-10 bg-muted rounded-md mb-2"></div>
                <div className="h-16 bg-muted rounded-md"></div>
              </div>
            ) : (
              <>
                <select
                  id="interview-type"
                  value={selectedTypeId ?? ''}
                  onChange={(e) => onTypeSelect(e.target.value ? Number(e.target.value) : null)}
                  className="w-full px-4 py-2.5 bg-background border border-input rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring mb-3"
                >
                  <option value="">Entrevista General</option>
                  {interviewTypes.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.name}
                    </option>
                  ))}
                </select>

                {/* Description */}
                {selectedType && (
                  <div className="bg-primary/10 border-l-4 border-primary rounded-r-md p-3">
                    <p className="text-sm text-foreground/80">{selectedType.description}</p>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Interview Guidelines */}
          <div className="bg-muted/50 rounded-lg p-4 border border-border space-y-3">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary" />
              Información de la Entrevista
            </h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5"></div>
                <p>Duración total: <span className="font-medium text-foreground">15 minutos</span></p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5"></div>
                <p>Tiempo por pregunta: <span className="font-medium text-foreground">2 minutos</span></p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5"></div>
                <p className="flex items-center gap-1">
                  <Mic className="w-3 h-3" />
                  Responde usando tu voz
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Start Button */}
        <div className="flex items-center justify-center">
          <button
            onClick={onStartInterview}
            disabled={isStarting}
            className="relative w-full h-full min-h-[200px] lg:min-h-full bg-gradient-to-br from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-lg group"
          >
            <div className="flex flex-col items-center justify-center gap-4 p-6">
              {isStarting ? (
                <>
                  <div className="w-12 h-12 border-4 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin"></div>
                  <span className="text-xl font-bold">Iniciando...</span>
                </>
              ) : (
                <>
                  <PlayCircle className="w-16 h-16 group-hover:scale-110 transition-transform" />
                  <span className="text-2xl font-bold">Iniciar</span>
                  <span className="text-xl font-bold">Entrevista</span>
                </>
              )}
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
