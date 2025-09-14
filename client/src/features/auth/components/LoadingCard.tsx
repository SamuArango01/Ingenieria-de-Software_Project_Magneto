import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function LoadingCard() {
  return (
    <Card className="w-full max-w-md bg-gray-800/90 border-gray-700 backdrop-blur-sm shadow-2xl mx-auto lg:mx-0">
      <CardHeader className="text-center pb-6">
        <CardTitle className="text-3xl font-bold tracking-tight text-white mb-2">
          Cargando...
        </CardTitle>
        <p className="text-gray-400 text-sm">Verificando tu sesión</p>
      </CardHeader>

      <CardContent className="px-6 py-8">
        <div className="flex flex-col items-center space-y-6">
          {/* Spinner animado */}
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-600"></div>
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-t-blue-500 border-r-emerald-500 absolute top-0 left-0"></div>
          </div>

          {/* Texto de carga */}
          <div className="text-center">
            <p className="text-white font-medium mb-2">
              Preparando tu experiencia
            </p>
            <div className="flex items-center justify-center space-x-1">
              <div className="animate-bounce h-2 w-2 bg-blue-500 rounded-full"></div>
              <div
                className="animate-bounce h-2 w-2 bg-emerald-500 rounded-full"
                style={{ animationDelay: "0.1s" }}
              ></div>
              <div
                className="animate-bounce h-2 w-2 bg-purple-500 rounded-full"
                style={{ animationDelay: "0.2s" }}
              ></div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
