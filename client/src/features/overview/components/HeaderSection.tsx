import { SearchInput } from "./SearchInput";
import { Users, User } from "lucide-react";

interface HeaderSectionProps {
  search: string;
  onSearchChange: (value: string) => void;
}

export function HeaderSection({ search, onSearchChange }: HeaderSectionProps) {
  return (
    <div className="mb-8 pt-4"> 
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-blue-500/10 rounded-2xl border border-blue-500/20">
              <Users className="w-10 h-10 text-blue-400" />
            </div>
            <div className="space-y-3">
              <h1 className="text-4xl font-bold text-white tracking-tight">
                Candidatos
              </h1>
              <p className="text-gray-400 text-lg font-light">
                Gestión completa de perfiles de entrevista
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full lg:w-auto">
          <div className="flex-1 min-w-[280px]">
            <SearchInput value={search} onChange={onSearchChange} />
          </div>
          <button className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-800 hover:bg-gray-700 border border-gray-600 rounded-xl transition-all duration-200 text-white font-medium">
            <User className="w-5 h-5" />
            <span>Mi Perfil</span>
          </button>
        </div>
      </div>
    </div>
  );
}