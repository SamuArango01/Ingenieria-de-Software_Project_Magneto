
// La lista de candidatos ira en otra page

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface Candidate {
  id: string;
  name: string;
  avatar: string;
  workField: string;
  yearsExperience: number;
  interviews: number;
  averageScore: number;
}

interface Props {
  candidates: Candidate[];
}

export function CandidatesTable({ candidates }: Props) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-16">Foto</TableHead>
          <TableHead>Nombre</TableHead>
          <TableHead>Área</TableHead>
          <TableHead className="text-center">Exp.</TableHead>
          <TableHead className="text-center">Entrevistas</TableHead>
          <TableHead className="text-center">Score</TableHead>
          <TableHead className="text-right">Acción</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {candidates.map((c) => (
          <TableRow key={c.id} className="hover:bg-gray-800/50 transition-colors">
            <TableCell>
              <Avatar className="w-10 h-10">
                <AvatarImage src={c.avatar} />
                <AvatarFallback>{c.name[0]}</AvatarFallback>
              </Avatar>
            </TableCell>
            <TableCell className="font-medium text-white">{c.name}</TableCell>
            <TableCell className="text-gray-300">{c.workField}</TableCell>
            <TableCell className="text-center text-gray-300">{c.yearsExperience}</TableCell>
            <TableCell className="text-center text-gray-300">{c.interviews}</TableCell>
            <TableCell className="text-center">
              <Badge
                variant={c.averageScore >= 80 ? "default" : "secondary"}
                className="font-mono"
              >
                {c.averageScore}
              </Badge>
            </TableCell>
            <TableCell className="text-right">
              <Button asChild size="sm" variant="outline">
                <Link href={`/rrhh/candidatos/${c.id}`}>Ver Perfil</Link>
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}