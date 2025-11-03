import { AlertCircle } from "lucide-react";

export function ErrorState() {
  return (
    <div className="text-center py-16">
      <div className="w-20 h-20 mx-auto mb-6 bg-red-500/10 rounded-2xl flex items-center justify-center">
        <AlertCircle className="w-10 h-10 text-red-400" />
      </div>
      <h3 className="text-xl font-semibold text-white mb-2">Error al cargar</h3>
      <p className="text-gray-400 max-w-md mx-auto">
        Ha ocurrido un error al cargar los candidatos. Por favor, intenta de nuevo más tarde.
      </p>
      <button className="mt-6 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-colors duration-200">
        Reintentar
      </button>
    </div>
  );
}