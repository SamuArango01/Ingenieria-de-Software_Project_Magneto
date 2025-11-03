import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, Calendar, TrendingUp, Target, Star } from "lucide-react";
import { Candidate } from "../types/candidate";

interface StatsCardsProps {
  candidates: Candidate[];
  isLoading: boolean;
}

export function StatsCards({ candidates, isLoading }: StatsCardsProps) {
  const totalInterviews = candidates.reduce((acc, candidate) => acc + candidate.interviews, 0);
  
  // Calcular métricas
  const averageScore = candidates.length > 0 
    ? Math.round(candidates.reduce((acc, candidate) => acc + candidate.averageScore, 0) / candidates.length)
    : 0;

  const highPerformers = candidates.filter(candidate => candidate.averageScore >= 85).length;

  const stats = [
    {
      title: "Total Candidatos",
      value: candidates.length,
      trend: "+12% este mes", // Ejemplo de tendencia
      icon: Users,
      iconColor: "text-blue-400",
      bgColor: "bg-blue-500/10",
      trendColor: "text-green-400",
    },
    {
      title: "Total Entrevistas",
      value: totalInterviews,
      trend: "+8% este mes", // Ejemplo de tendencia
      icon: Calendar,
      iconColor: "text-purple-400",
      bgColor: "bg-purple-500/10",
      trendColor: "text-blue-400",
    },
    {
      title: "Rendimiento",
      value: `${averageScore}%`,
      trend: `${highPerformers} alto desempeño`,
      icon: Star,
      iconColor: "text-orange-400",
      bgColor: "bg-orange-500/10",
      trendColor: "text-orange-400",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {stats.map((stat, index) => (
        <Card key={index} className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700 rounded-2xl hover:border-gray-600 transition-all duration-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium">{stat.title}</p>
                
                <div className="text-3xl font-bold text-white mt-2">
                  {isLoading ? (
                    <Skeleton className="h-8 w-16 bg-gray-700" />
                  ) : (
                    stat.value
                  )}
                </div>
                
                <p className={`${stat.trendColor} text-sm mt-1 flex items-center gap-1`}>
                  <TrendingUp className="w-4 h-4" />
                  {stat.trend}
                </p>
              </div>
              <div className={`p-3 ${stat.bgColor} rounded-xl`}>
                <stat.icon className={`w-6 h-6 ${stat.iconColor}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}