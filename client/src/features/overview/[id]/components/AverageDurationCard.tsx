// app/rrhh/candidatos/[id]/components/AverageDurationCard.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock } from "lucide-react";

interface Props {
  averageDuration: number; // segundos
}

export function AverageDurationCard({ averageDuration }: Props) {
  const minutes = Math.floor(averageDuration / 60);
  const seconds = (averageDuration % 60).toString().padStart(2, "0");

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-blue-400" />
          Duración Promedio
        </CardTitle>
      </CardHeader>
      <CardContent className="text-center">
        <p className="text-5xl font-bold text-blue-400">
          {minutes}:{seconds}
        </p>
        <p className="text-gray-400 mt-2">por entrevista</p>
      </CardContent>
    </Card>
  );
}