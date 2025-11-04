import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingUp } from "lucide-react";
import { CandidateProfile } from "../types/candidate";

interface ProgressChartProps {
  readonly interviewHistory: CandidateProfile['interviewHistory'];
}

export function ProgressChart({ interviewHistory }: ProgressChartProps) {
  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader className="border-b border-gray-700">
        <CardTitle className="text-white flex items-center gap-3">
          <div className="p-2 bg-purple-500/20 rounded-lg">
            <TrendingUp className="h-6 w-6 text-purple-400" />
          </div>
          <div>
            <div className="text-xl font-bold">Tu Evolución</div>
            <div className="text-sm text-gray-400 font-normal">Progreso de scores en entrevistas</div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={interviewHistory}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis 
              dataKey="date" 
              stroke="#9CA3AF"
              fontSize={12}
            />
            <YAxis 
              domain={[0, 100]} 
              stroke="#9CA3AF"
              fontSize={12}
            />
            <Tooltip
              contentStyle={{ 
                backgroundColor: "#1F2937", 
                border: "1px solid #374151",
                borderRadius: "8px",
                color: "#F9FAFB"
              }}
              labelStyle={{ color: "#D1D5DB", fontWeight: "bold" }}
            />
            <Line
              type="monotone"
              dataKey="score"
              stroke="#8B5CF6"
              strokeWidth={3}
              dot={{ fill: "#8B5CF6", strokeWidth: 2, r: 6 }}
              activeDot={{ r: 8, fill: "#EC4899" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}