import { Users, LayoutDashboard  } from "lucide-react";

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
        
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full lg:w-auto">
        <button className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-800 hover:bg-gray-700 border border-gray-600 rounded-xl transition-all duration-200 text-white font-medium">
          <LayoutDashboard className="w-5 h-5" />
          <span>Mi dashboard</span>
        </button>
      </div>
      </div>
    </div>
  );
}