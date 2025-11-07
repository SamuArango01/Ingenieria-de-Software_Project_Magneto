import { Users } from "lucide-react";

interface EmptyStateProps {
  search: string;
}

export function EmptyState({ search }: EmptyStateProps) {
  return (
    <div className="text-center py-16">
      <div className="w-20 h-20 mx-auto mb-6 bg-gray-700 rounded-2xl flex items-center justify-center">
        <Users className="w-10 h-10 text-gray-400" />
      </div>
      <h3 className="text-xl font-semibold text-white mb-2">
        {search ? "No se encontraron resultados" : "No hay candidatos"}
      </h3>
      <p className="text-gray-400 max-w-md mx-auto">
        {search
          ? `No se encontraron candidatos para "${search}". Intenta con otros términos.`
          : "Aún no hay candidatos registrados en el sistema."}
      </p>
    </div>
  );
}