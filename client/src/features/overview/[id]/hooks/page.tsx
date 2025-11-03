"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getCandidates } from "../../services/candidate.service";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Search } from "lucide-react";

export default function CandidatesList() {
  const [search, setSearch] = useState("");
  const { data: candidates, isLoading } = useQuery({
    queryKey: ["candidates"],
    queryFn: getCandidates,
  });

  const filtered = candidates?.filter((c) => {
    if (!c) return false;
    const name = c.name?.toLowerCase() || "";
    const workField = c.workField?.toLowerCase() || "";
    const searchTerm = search.toLowerCase();
    return name.includes(searchTerm) || workField.includes(searchTerm);
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-950 to-black p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-extrabold text-white tracking-tight mb-3">
            Candidatos
          </h1>
          <p className="text-gray-400 mb-6">
            Explora el talento disponible, filtra por nombre o campo laboral.
          </p>

          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <Input
              placeholder="Buscar por nombre o área..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 bg-gray-800 border border-gray-700 text-white rounded-xl focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-24 bg-gray-800 rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered?.map((candidate) => (
              <a
                key={candidate.id}
                href={`/rrhh/candidatos/${candidate.id}`}
                className="group relative block overflow-hidden rounded-2xl border border-gray-800 bg-gray-900/70 p-5 transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-600/10 hover:bg-gray-800"
              >
                <div className="flex items-center gap-4">
                  <Avatar className="h-14 w-14 ring-2 ring-emerald-500/40">
                    <AvatarImage src={candidate.avatar} />
                    <AvatarFallback>
                      {candidate.name?.[0] || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white group-hover:text-emerald-400 transition-colors">
                      {candidate.name || "Nombre no disponible"}
                    </h3>
                    <p className="text-sm text-gray-400">
                      {candidate.workField || "Área no especificada"}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex justify-between items-center text-gray-400 text-sm">
                  <span>{candidate.yearsExperience || 0} años exp.</span>
                  <span className="text-emerald-400 font-semibold text-base">
                    {candidate.averageScore || 0}%
                  </span>
                </div>

                
                <div className="absolute inset-0 -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/10 to-transparent blur-xl" />
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
