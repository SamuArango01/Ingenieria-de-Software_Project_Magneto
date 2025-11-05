import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingUp } from "lucide-react";
import { CandidateProfile } from "../types/candidate";

interface ProgressChartProps {
  readonly interviewHistory: CandidateProfile['interviewHistory'];
}

export function ProgressChart({ interviewHistory }: ProgressChartProps) {
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
          <LineChart data={interviewHistory}>
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
              contentStyle={{ 
                backgroundColor: 'rgba(15, 23, 42, 0.95)',
                border: '1px solid rgba(59, 130, 246, 0.5)',
                borderRadius: '12px',
                color: '#FFFFFF',
                backdropFilter: 'blur(12px)',
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
                fontSize: '14px'
              }}
              labelStyle={{ 
                color: '#BFDBFE', 
                fontWeight: "600",
                marginBottom: '8px'
              }}
              itemStyle={{ color: '#60A5FA' }}
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