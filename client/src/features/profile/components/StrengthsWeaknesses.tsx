import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, X } from "lucide-react";
import { CandidateProfile } from "../types/candidate";

interface StrengthsWeaknessesProps {
  readonly strengths: CandidateProfile['strengths'];
  readonly weaknesses: CandidateProfile['weaknesses'];
}

export function StrengthsWeaknesses({ strengths, weaknesses }: StrengthsWeaknessesProps) {
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