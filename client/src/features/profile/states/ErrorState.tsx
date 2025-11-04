import { User, RefreshCw } from "lucide-react";

interface ErrorStateProps {
  readonly error: Error;
  readonly onRetry: () => void;
}

export function ErrorState({ error, onRetry }: ErrorStateProps) {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="text-center">
        <User className="h-16 w-16 text-red-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">Error al cargar el perfil</h2>
        <p className="text-gray-400 mb-4 max-w-md">
          {error?.message || "Ha ocurrido un error inesperado"}
        </p>
        <button 
          onClick={onRetry}
          className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition-colors flex items-center gap-2 mx-auto"
        >
          <RefreshCw className="h-4 w-4" />
          Reintentar
        </button>
      </div>
    </div>
  );
}