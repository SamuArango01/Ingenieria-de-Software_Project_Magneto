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
        border: "border-green-500/30 hover:border-green-500/50",
        title: "text-green-400",
        iconBg: "bg-green-500/20",
        icon: "text-green-400",
        bar: "bg-green-400"
      },
      weakness: {
        border: "border-orange-500/30 hover:border-orange-500/50",
        title: "text-orange-400",
        iconBg: "bg-orange-500/20",
        icon: "text-orange-400",
        bar: "bg-orange-400"
      }
    };

    const colorSet = colors[type];
    const Icon = type === 'strength' ? Check : X;

    return (
      <Card className={`bg-gray-800 transition-all duration-300 ${colorSet.border}`}>
        <CardHeader className="border-b border-gray-700">
          <CardTitle className={`flex items-center gap-3 ${colorSet.title}`}>
            <div className={`p-2 rounded-lg ${colorSet.iconBg}`}>
              <Icon className="h-5 w-5" />
            </div>
            {type === 'strength' ? 'Tus Fortalezas' : 'Áreas a Mejorar'}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <ul className="space-y-4">
            {items.map((item) => (
              <li key={`${type}-${item}`} className="flex items-start gap-4 p-3 rounded-lg bg-gray-700/50 hover:bg-gray-700/70 transition-colors">
                <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center mt-0.5 ${colorSet.iconBg}`}>
                  <Icon className={`h-3 w-3 ${colorSet.icon}`} />
                </div>
                <div className="flex-1">
                  <span className="font-medium text-white">{item}</span>
                  <div className="w-full bg-gray-600 h-1 mt-2 rounded-full">
                    <div 
                      className={`h-1 rounded-full transition-all duration-500 ${colorSet.bar}`}
                      style={{ 
                        width: `${type === 'strength' 
                          ? Math.floor(Math.random() * 40) + 60 
                          : Math.floor(Math.random() * 40) + 20
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