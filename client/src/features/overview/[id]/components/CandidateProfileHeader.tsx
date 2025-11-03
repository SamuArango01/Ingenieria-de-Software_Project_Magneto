// app/rrhh/candidatos/[id]/components/CandidateProfileHeader.tsx
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

interface Props {
  candidate: {
    name: string;
    avatar: string;
    workField: string;
    yearsExperience: number;
    totalInterviews: number;
    averageScore: number;
  };
}

export function CandidateProfileHeader({ candidate }: Props) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center gap-6">
          <Avatar className="w-24 h-24">
            <AvatarImage src={candidate.avatar} />
            <AvatarFallback>{candidate.name[0]}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-white">{candidate.name}</h1>
            <p className="text-lg text-gray-400">{candidate.workField}</p>
            <div className="mt-3 flex gap-6 text-sm">
              <div>
                <span className="text-gray-400">Experiencia:</span>{" "}
                <span className="font-medium text-white">{candidate.yearsExperience} años</span>
              </div>
              <div>
                <span className="text-gray-400">Entrevistas:</span>{" "}
                <span className="font-medium text-white">{candidate.totalInterviews}</span>
              </div>
              <div>
                <span className="text-gray-400">Score Promedio:</span>{" "}
                <Badge variant={candidate.averageScore >= 80 ? "default" : "secondary"} className="ml-2">
                  {candidate.averageScore}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}