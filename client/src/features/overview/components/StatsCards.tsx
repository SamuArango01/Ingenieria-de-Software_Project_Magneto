import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, Calendar, TrendingUp } from "lucide-react";
import { Candidate } from "../types/candidate";
import { StatItem } from "../types/charts";
import { useMemo } from "react";

interface StatsCardsProps {
  readonly candidates: Candidate[];
  readonly isLoading: boolean;
}

export function StatsCards({ candidates, isLoading }: StatsCardsProps) {
  const stats = useMemo((): StatItem[] => {
    const completedInterviews = candidates.reduce((acc, candidate) => acc + candidate.interviews, 0);

    return [
      {
        id: "total-candidates",
        title: "Total Candidatos",
        value: candidates.length,
        trend: "Activos en el sistema",
        icon: Users,
        iconColor: "text-blue-400",
        bgColor: "bg-blue-500/10",
        trendColor: "text-blue-400",
      },
      {
        id: "total-interviews",
        title: "Entrevistas Completadas",
        value: completedInterviews,
        trend: "Total realizadas",
        icon: Calendar,
        iconColor: "text-green-400",
        bgColor: "bg-green-500/10",
        trendColor: "text-green-400",
      },
    ];
  }, [candidates]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {stats.map((stat) => (
        <Card key={stat.id} className="bg-gray-800 border border-gray-700">
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