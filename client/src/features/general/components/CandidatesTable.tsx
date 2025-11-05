"use client";

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
import { Candidate } from "../types/candidates";
import { 
  Star, 
  TrendingUp, 
  Calendar,
  Briefcase,
  Award
} from "lucide-react";

interface Props {
  readonly candidates: Candidate[];
}

// Función para determinar las clases del badge basado en el score
const getScoreBadgeClasses = (score: number) => {
  if (score >= 90) {
    return "bg-gradient-to-r from-green-500/20 to-emerald-500/10 text-green-300 border-green-400/40 shadow-lg shadow-green-500/10";
  } else if (score >= 80) {
    return "bg-gradient-to-r from-green-500/20 to-lime-500/10 text-lime-300 border-lime-400/40 shadow-lg shadow-lime-500/10";
  } else if (score >= 70) {
    return "bg-gradient-to-r from-yellow-500/20 to-amber-500/10 text-yellow-300 border-yellow-400/40 shadow-lg shadow-yellow-500/10";
  } else if (score >= 60) {
    return "bg-gradient-to-r from-orange-500/20 to-amber-500/10 text-orange-300 border-orange-400/40 shadow-lg shadow-orange-500/10";
  } else {
    return "bg-gradient-to-r from-red-500/20 to-pink-500/10 text-red-300 border-red-400/40 shadow-lg shadow-red-500/10";
  }
};

// Función para determinar el color del indicador de status
const getStatusColor = (score: number) => {
  if (score >= 90) return "bg-green-400";
  if (score >= 80) return "bg-lime-400";
  if (score >= 70) return "bg-yellow-400";
  if (score >= 60) return "bg-orange-400";
  return "bg-red-400";
};

// Función para determinar el color del indicador de progreso
const getProgressBarGradient = (score: number) => {
  if (score >= 90) return "bg-gradient-to-r from-green-400 to-emerald-400";
  if (score >= 80) return "bg-gradient-to-r from-lime-400 to-green-400";
  if (score >= 70) return "bg-gradient-to-r from-yellow-400 to-amber-400";
  if (score >= 60) return "bg-gradient-to-r from-orange-400 to-amber-400";
  return "bg-gradient-to-r from-red-400 to-pink-400";
};

export function CandidatesTable({ candidates }: Props) {
  return (
    <div className="rounded-2xl border border-gray-700/50 bg-gray-800/30 backdrop-blur-sm overflow-hidden shadow-2xl">
      <Table>
        <TableHeader>
          <TableRow className="border-b border-gray-700/60 bg-gradient-to-r from-gray-800 to-gray-900/80">
            <TableHead className="w-20 py-5 text-gray-300 font-semibold text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                PERFIL
              </div>
            </TableHead>
            <TableHead className="py-5 text-gray-300 font-semibold text-sm">
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4" />
                ÁREA
              </div>
            </TableHead>
            <TableHead className="text-center py-5 text-gray-300 font-semibold text-sm">
              <div className="flex items-center justify-center gap-2">
                <Award className="w-4 h-4" />
                EXPERIENCIA
              </div>
            </TableHead>
            <TableHead className="text-center py-5 text-gray-300 font-semibold text-sm">
              <div className="flex items-center justify-center gap-2">
                <Calendar className="w-4 h-4" />
                ENTREVISTAS
              </div>
            </TableHead>
            <TableHead className="text-center py-5 text-gray-300 font-semibold text-sm">
              <div className="flex items-center justify-center gap-2">
                <TrendingUp className="w-4 h-4" />
                SCORE
              </div>
            </TableHead>
            <TableHead className="text-right py-5 text-gray-300 font-semibold text-sm">
              ACCIÓN
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {candidates.map((candidate) => (
            <TableRow 
              key={candidate.id} 
              className="border-b border-gray-700/30 hover:bg-gray-750/50 transition-all duration-300 group"
            >
              <TableCell>
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Avatar className="w-14 h-14 border-2 border-gray-600/50 group-hover:border-blue-400/70 transition-all duration-300 shadow-lg">
                      <AvatarImage 
                        src={candidate.avatar} 
                        className="group-hover:scale-110 transition-transform duration-300" 
                      />
                      <AvatarFallback className="bg-gradient-to-br from-blue-500/20 to-purple-600/20 text-white font-semibold backdrop-blur-sm">
                        {candidate.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-gray-800 ${getStatusColor(candidate.averageScore)}`} />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-semibold text-white group-hover:text-blue-300 transition-colors">
                      {candidate.name}
                    </span>
                  </div>
                </div>
              </TableCell>
              
              <TableCell>
                <Badge 
                  variant="outline" 
                  className="bg-blue-500/10 text-blue-300 border-blue-500/40 text-xs px-3 py-1.5 rounded-full font-medium backdrop-blur-sm hover:bg-blue-500/20 transition-colors"
                >
                  {candidate.workField}
                </Badge>
              </TableCell>
              
              <TableCell>
                <div className="flex flex-col items-center">
                  <div className="flex items-center gap-1.5">
                    <span className="text-white font-bold text-lg">{candidate.yearsExperience}</span>
                    <span className="text-xs text-gray-400">años</span>
                  </div>
                  <div className="flex mt-1">
                    {new Array(5).fill(0).map((_, i) => (
                      <Star 
                        key={`${candidate.id}-star-${i}`}
                        className={`w-3 h-3 ${
                          i < Math.min(candidate.yearsExperience / 2, 5) 
                            ? "text-yellow-400 fill-yellow-400" 
                            : "text-gray-600"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </TableCell>
              
              <TableCell>
                <div className="flex flex-col items-center">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                    <span className="text-white font-bold text-lg">{candidate.interviews}</span>
                  </div>
                  <span className="text-xs text-gray-400 mt-1">realizadas</span>
                </div>
              </TableCell>
              
              <TableCell>
                <div className="flex flex-col items-center gap-3">
                  <Badge
                    variant="default"
                    className={`font-mono font-bold text-sm px-4 py-2 min-w-20 rounded-full border backdrop-blur-sm transition-all duration-300 group-hover:scale-105 ${getScoreBadgeClasses(candidate.averageScore)}`}
                  >
                    {candidate.averageScore}%
                  </Badge>
                  <div className="w-full max-w-24 bg-gray-700/50 rounded-full h-2 backdrop-blur-sm">
                    <div 
                      className={`h-2 rounded-full transition-all duration-700 ease-out ${getProgressBarGradient(candidate.averageScore)} shadow-lg`}
                      style={{ width: `${candidate.averageScore}%` }}
                    />
                  </div>
                </div>
              </TableCell>
              
              <TableCell className="text-right">
                <Button 
                  asChild 
                  size="sm" 
                  variant="outline" 
                  className="border-blue-400/50 text-blue-300 bg-blue-500/5 hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-600 hover:text-white hover:border-transparent hover:scale-105 transition-all duration-300 font-medium rounded-lg px-4 py-2 backdrop-blur-sm shadow-lg"
                >
                  <Link href={`/rrhh/candidatos/${candidate.id}`}>
                    Ver Perfil
                  </Link>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}