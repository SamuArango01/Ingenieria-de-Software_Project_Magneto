// app/rrhh/candidatos/[id]/components/ScoreHistoryChart.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface Props {
  history: { date: string; score: number }[];
}

export function ScoreHistoryChart({ history }: Props) {
  const data = history.map(h => ({
    date: new Date(h.date).toLocaleDateString("es-ES", { month: "short", day: "numeric" }),
    score: h.score,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Histórico de Scores</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="date" stroke="#9CA3AF" />
            <YAxis domain={[0, 100]} stroke="#9CA3AF" />
            <Tooltip
              contentStyle={{ backgroundColor: "#1F2937", border: "1px solid #374151" }}
              labelStyle={{ color: "#E5E7EB" }}
            />
            <Line type="monotone" dataKey="score" stroke="#10B981" strokeWidth={3} dot={{ fill: "#10B981" }} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}