import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingUp } from "lucide-react";
import { CandidateProfile } from "../types/candidate";

interface ProgressChartProps {
  readonly scoreHistory: CandidateProfile['scoreHistory'];
}

export function ProgressChart({ scoreHistory }: ProgressChartProps) {
  const chartData = scoreHistory.map(item => ({
    date: item.date,
    score: item.score,
    interviewType: item.interviewType,
    duration: item.duration
  }));

  return (
    <Card className="bg-gradient-to-br from-gray-900 via-blue-900/20 to-gray-900 border-blue-500/20 rounded-3xl shadow-2xl backdrop-blur-sm">
      <CardHeader className="border-b border-blue-500/10 pb-5">
        <CardTitle className="text-white flex items-center gap-4">
          <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-2xl shadow-lg">
            <TrendingUp className="h-6 w-6 text-white" />
          </div>
          <div>
            <div className="text-2xl font-bold bg-gradient-to-r from-blue-200 to-cyan-200 bg-clip-text text-transparent">
              Progreso de Entrevistas
            </div>
            <div className="text-sm text-blue-300/80 font-normal mt-1">
              Evolución de tus puntuaciones
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={chartData}>
            <CartesianGrid 
              strokeDasharray="2 4" 
              stroke="#1E40AF"
              strokeOpacity={0.3}
              vertical={false}
            />
            <XAxis 
              dataKey="date" 
              stroke="#60A5FA"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              tick={{ fill: '#93C5FD' }}
            />
            <YAxis 
              domain={[0, 100]} 
              stroke="#60A5FA"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              tick={{ fill: '#93C5FD' }}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (!active || !payload?.[0]) return null;
                
                const data = payload[0].payload;
                return (
                  <div className="bg-slate-900/95 border border-blue-500/50 rounded-xl p-4 shadow-2xl backdrop-blur-sm">
                    <p className="text-blue-300 font-semibold mb-2">{label}</p>
                    <p className="text-white">
                      <span className="text-cyan-400">Puntuación: </span>
                      {data.score}%
                    </p>
                    <p className="text-white">
                      <span className="text-cyan-400">Tipo: </span>
                      {data.interviewType}
                    </p>
                    {data.duration && (
                      <p className="text-white">
                        <span className="text-cyan-400">Duración: </span>
                        {Math.floor(data.duration / 60)}m {data.duration % 60}s
                      </p>
                    )}
                  </div>
                );
              }}
            />
            <Line
              type="monotone"
              dataKey="score"
              stroke="#3B82F6"
              strokeWidth={3}
              dot={{ 
                fill: '#1E40AF', 
                stroke: '#FFFFFF',
                strokeWidth: 2, 
                r: 5,
                filter: 'drop-shadow(0 2px 4px rgba(37, 99, 235, 0.5))'
              }}
              activeDot={{ 
                r: 7, 
                fill: '#60A5FA',
                stroke: '#FFFFFF',
                strokeWidth: 2,
                filter: 'drop-shadow(0 4px 8px rgba(37, 99, 235, 0.7))'
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}