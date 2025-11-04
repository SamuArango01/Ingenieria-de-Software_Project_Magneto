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
      title: "Score Promedio",
      value: `${profile.averageScore}%`,
      description: performance.level,
      icon: TrendingUp,
      iconColor: "text-green-400",
      borderColor: "hover:border-purple-500/50",
      valueColor: "text-green-400"
    },
    {
      title: "Duración Promedio",
      value: formatDuration(profile.averageDuration),
      description: "Por entrevista",
      icon: Clock,
      iconColor: "text-blue-400",
      borderColor: "hover:border-blue-500/50",
      valueColor: "text-blue-400"
    },
    {
      title: "Entrevistas",
      value: profile.totalInterviews.toString(),
      description: "Completadas",
      icon: Award,
      iconColor: "text-yellow-400",
      borderColor: "hover:border-yellow-500/50",
      valueColor: "text-yellow-400"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {stats.map((stat) => (
        <Card 
          key={stat.title}
          className={`bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700 transition-all duration-300 ${stat.borderColor}`}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-sm font-medium text-gray-400">
              {stat.title}
            </CardTitle>
            <stat.icon className={`h-5 w-5 ${stat.iconColor}`} />
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold mb-2 ${stat.valueColor}`}>
              {stat.value}
            </div>
            <p className="text-xs text-gray-400">
              {stat.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}