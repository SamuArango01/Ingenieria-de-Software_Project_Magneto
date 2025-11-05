import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, X } from "lucide-react";
import { CandidateProfile } from "../types/candidate";

interface StrengthsWeaknessesProps {
  readonly latestEvaluation: CandidateProfile['latestEvaluation'];
}

export function StrengthsWeaknesses({ latestEvaluation }: StrengthsWeaknessesProps) {
  const strengths = latestEvaluation?.strengths 
    ? latestEvaluation.strengths.split(',').map(s => s.trim()).filter(s => s.length > 0)
    : [];

  const weaknesses = latestEvaluation?.weaknesses 
    ? latestEvaluation.weaknesses.split(',').map(s => s.trim()).filter(s => s.length > 0)
    : [];

  // Si no hay datos, mostrar un mensaje
  if (strengths.length === 0 && weaknesses.length === 0) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-slate-800 border-slate-700 border">
          <CardHeader className="border-b border-slate-700 pb-4">
            <CardTitle className="flex items-center gap-3 text-lg font-semibold text-emerald-400">
              <div className="p-2 rounded-lg bg-emerald-500/20">
                <Check className="h-5 w-5" />
              </div>
              Fortalezas Principales
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <p className="text-slate-400 text-center py-4">
              No hay evaluaciones de fortalezas disponibles
            </p>
          </CardContent>
        </Card>
        <Card className="bg-slate-800 border-slate-700 border">
          <CardHeader className="border-b border-slate-700 pb-4">
            <CardTitle className="flex items-center gap-3 text-lg font-semibold text-amber-400">
              <div className="p-2 rounded-lg bg-amber-500/20">
                <X className="h-5 w-5" />
              </div>
              Áreas de Desarrollo
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <p className="text-slate-400 text-center py-4">
              No hay evaluaciones de áreas de desarrollo disponibles
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const renderList = (items: string[], type: 'strength' | 'weakness') => {
    const colors = {
      strength: {
        border: "border-emerald-500/20 hover:border-emerald-500/30",
        title: "text-emerald-400",
        iconBg: "bg-emerald-500/20",
        icon: "text-emerald-400",
        bar: "bg-emerald-400",
        bg: "bg-slate-800"
      },
      weakness: {
        border: "border-amber-500/20 hover:border-amber-500/30",
        title: "text-amber-400",
        iconBg: "bg-amber-500/20",
        icon: "text-amber-400",
        bar: "bg-amber-400",
        bg: "bg-slate-800"
      }
    };

    const colorSet = colors[type];
    const Icon = type === 'strength' ? Check : X;

    return (
      <Card className={`${colorSet.bg} border transition-all duration-300 ${colorSet.border}`}>
        <CardHeader className="border-b border-slate-700 pb-4">
          <CardTitle className={`flex items-center gap-3 text-lg font-semibold ${colorSet.title}`}>
            <div className={`p-2 rounded-lg ${colorSet.iconBg}`}>
              <Icon className="h-5 w-5" />
            </div>
            {type === 'strength' ? 'Fortalezas Principales' : 'Áreas de Desarrollo'}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {items.length === 0 ? (
            <p className="text-slate-400 text-center py-4">
              {type === 'strength' 
                ? 'No hay fortalezas evaluadas' 
                : 'No hay áreas de desarrollo identificadas'
              }
            </p>
          ) : (
            <ul className="space-y-3">
              {items.map((item, index) => (
                <li 
                  key={`${type}-${item}-${index}`} 
                  className="flex items-start gap-4 p-4 rounded-lg bg-slate-700/30 hover:bg-slate-700/50 transition-colors border border-slate-600/30"
                >
                  <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center mt-0.5 ${colorSet.iconBg}`}>
                    <Icon className={`h-3 w-3 ${colorSet.icon}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="font-medium text-slate-200 leading-relaxed">{item}</span>
                    <div className="w-full bg-slate-600 h-1.5 mt-3 rounded-full">
                      <div 
                        className={`h-1.5 rounded-full transition-all duration-700 ${colorSet.bar}`}
                        style={{ 
                          width: `${type === 'strength' 
                            ? Math.min(90, Math.floor(Math.random() * 30) + 70) // 70-90%
                            : Math.max(10, Math.floor(Math.random() * 30) + 10) // 10-40%
                          }%` 
                        }}
                      />
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {renderList(strengths, 'strength')}
      {renderList(weaknesses, 'weakness')}
    </div>
  );
}