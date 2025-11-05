import { Users  } from "lucide-react";

export function HeaderSection() {
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
                Dashboard de Entrevistas
              </h1>
              <p className="text-gray-400 text-lg font-light">
                Analiza el avance del reclutamiento mediante estadísticas de entrevistas totales, candidatos activos y comparativas mensuales.
              </p>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
}