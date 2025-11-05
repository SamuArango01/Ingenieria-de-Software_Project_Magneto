import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, Calendar, TrendingUp, Star, CheckCircle } from "lucide-react";
import { OverviewResponse } from "../types/overview";
import { useMemo } from "react";

interface StatsCardsProps {
  readonly overviewData: OverviewResponse | null;
  readonly isLoading: boolean;
}

export function StatsCards({ overviewData, isLoading }: StatsCardsProps) {
  const stats = useMemo(() => {
    
    // Si no hay datos de overview, retornar stats por defecto
    if (!overviewData) {
      return [
        {
          id: "total-candidates",
          title: "Total Candidatos",
          value: 0,
          trend: "+0% este mes",
          icon: Users,
          iconColor: "text-blue-400",
          bgColor: "bg-blue-500/10", 
          trendColor: "text-green-400",
        },
        {
          id: "total-interviews",
          title: "Total Entrevistas",
          value: 0,
          trend: "+0% este mes",
          icon: Calendar,
          iconColor: "text-purple-400",
          bgColor: "bg-purple-500/10",
          trendColor: "text-blue-400",
        },
        {
          id: "completion-rate",
          title: "Tasa de Finalización",
          value: "0%",
          trend: "0 completadas",
          icon: CheckCircle,
          iconColor: "text-green-400",
          bgColor: "bg-green-500/10",
          trendColor: "text-green-400",
        },
        {
          id: "avg-score",
          title: "Puntuación Promedio",
          value: "0.0",
          trend: "Puntuación global",
          icon: Star,
          iconColor: "text-orange-400",
          bgColor: "bg-orange-500/10",
          trendColor: "text-orange-400",
        },
      ];
    }


    const interviewsTrend = calculateInterviewsTrend(overviewData.interviewsByMonth);



    return [
      {
        id: "total-candidates",
        title: "Total Candidatos",
        value: overviewData.totalCandidates,
        trend: "+12% este mes", 
        icon: Users,
        iconColor: "text-blue-400",
        bgColor: "bg-blue-500/10",
        trendColor: "text-green-400",
      },
      {
        id: "total-interviews",
        title: "Total Entrevistas",
        value: overviewData.totalInterviews,
        trend: interviewsTrend,
        icon: Calendar,
        iconColor: "text-purple-400",
        bgColor: "bg-purple-500/10",
        trendColor: getTrendColor(interviewsTrend),
      },
      {
        id: "completion-rate",
        title: "Tasa de Finalización",
        value: `${overviewData.completionRate}%`,
        trend: `${overviewData.completedInterviews} completadas`,
        icon: CheckCircle,
        iconColor: "text-green-400",
        bgColor: "bg-green-500/10",
        trendColor: "text-green-400",
      },
      {
        id: "avg-score",
        title: "Puntuación Promedio",
        value: overviewData.avgGlobalScore?.toFixed(1) || "0.0",
        trend: "Puntuación global",
        icon: Star,
        iconColor: "text-orange-400",
        bgColor: "bg-orange-500/10",
        trendColor: "text-orange-400",
      },
    ];
  }, [overviewData]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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


function calculateInterviewsTrend(interviewsByMonth: { month: string; total: number }[]): string {
  if (!interviewsByMonth || interviewsByMonth.length < 2) {
    return "+0%";
  }

  const lastIndex = interviewsByMonth.length - 1;
  const previousIndex = interviewsByMonth.length - 2;

  const lastMonth = interviewsByMonth[lastIndex];
  const previousMonth = interviewsByMonth[previousIndex];

  if (lastMonth === undefined || previousMonth === undefined) {
    return "+0%";
  }

  return calculateTrend(previousMonth.total, lastMonth.total);
}


function calculateTrend(previous: number, current: number): string {
  if (previous === 0) return current > 0 ? "+100%" : "+0%";
  
  const change = ((current - previous) / previous) * 100;
  const sign = change >= 0 ? "+" : "";
  return `${sign}${Math.round(change)}%`;
}

function getTrendColor(trend: string): string {
  if (trend.startsWith('+')) return "text-green-400";
  if (trend.startsWith('-')) return "text-red-400";
  return "text-blue-400";
}