import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, TrendingUp, Award } from "lucide-react";
import { CandidateProfile } from "../types/candidate";

interface StatsCardsProps {
  readonly profile: CandidateProfile;
  readonly performance: {
    readonly level: string;
    readonly color: string;
  };
  readonly formatDuration: (seconds: number) => string;
}

export function StatsCards({ profile, performance, formatDuration }: StatsCardsProps) {
  const stats = [
    {
      title: "Rendimiento General",
      value: `${profile.averageScore}%`,
      description: performance.level,
      icon: TrendingUp,
      bgColor: "bg-slate-800",
      borderColor: "border-slate-700",
      iconBg: "bg-emerald-500/20",
      iconColor: "text-emerald-400",
      valueColor: "text-emerald-400"
    },
    {
      title: "Tiempo Promedio",
      value: formatDuration(profile.averageDuration),
      description: "Por sesión de entrevista",
      icon: Clock,
      bgColor: "bg-slate-800",
      borderColor: "border-slate-700",
      iconBg: "bg-blue-500/20",
      iconColor: "text-blue-400",
      valueColor: "text-blue-400"
    },
    {
      title: "Sesiones Realizadas",
      value: profile.totalInterviews.toString(),
      description: "Entrevistas completadas",
      icon: Award,
      bgColor: "bg-slate-800",
      borderColor: "border-slate-700",
      iconBg: "bg-amber-500/20",
      iconColor: "text-amber-400",
      valueColor: "text-amber-400"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {stats.map((stat) => (
        <Card 
          key={stat.title}
          className={`${stat.bgColor} ${stat.borderColor} border transition-all duration-300 hover:shadow-lg hover:border-slate-600 group`}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-sm font-semibold text-slate-300">
              {stat.title}
            </CardTitle>
            <div className={`p-2 ${stat.iconBg} rounded-lg group-hover:scale-110 transition-transform`}>
              <stat.icon className={`h-4 w-4 ${stat.iconColor}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold mb-1 ${stat.valueColor}`}>
              {stat.value}
            </div>
            <p className="text-xs text-slate-400 font-medium">
              {stat.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}