import { CheckIcon, StarIcon } from "@heroicons/react/20/solid";

const benefits = [
  {
    name: "Preparación Personalizada",
    description: "La IA analiza tu perfil y crea entrevistas adaptadas a tu industria y nivel de experiencia.",
    icon: StarIcon,
  },
  {
    name: "Feedback Inmediato",
    description: "Recibe análisis detallado de tu desempeño al instante, con sugerencias específicas para mejorar.",
    icon: CheckIcon,
  },
  {
    name: "Disponibilidad 24/7",
    description: "Practica cuando quieras, sin horarios fijos. Tu entrenamiento siempre disponible.",
    icon: StarIcon,
  },
  {
    name: "Múltiples Escenarios",
    description: "Enfréntate a diferentes tipos de entrevistadores y preguntas desafiantes.",
    icon: CheckIcon,
  },
];

const stats = [
  { id: 1, name: "Calidad de entrevistas", value: "95%" },
  { id: 2, name: "Mejora en resultados", value: "2.5x" },
  { id: 3, name: "Tiempo de preparación", value: "15 min" },
  { id: 4, name: "Industrias cubiertas", value: "50+" },
];

export function Benefits() {
  return (
    <div className="bg-slate-900 px-6 py-16 sm:py-24 lg:px-8" id="benefits">
      <div className="mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white sm:text-5xl mb-4">
            Ventajas Exclusivas
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Descubre por qué StarTraining es la elección ideal para tu preparación
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {benefits.map((benefit) => (
            <div
              key={benefit.name}
              className="bg-slate-800/40 rounded-lg p-6 border border-slate-700/30 hover:border-blue-500/30 transition-colors duration-200"
            >
              <div className="flex items-start gap-4">
                <div className="bg-blue-500/10 p-2 rounded-lg">
                  <benefit.icon
                    aria-hidden="true"
                    className="h-5 w-5 text-blue-400"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {benefit.name}
                  </h3>
                  <p className="text-gray-400 text-sm">
                    {benefit.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 grid grid-cols-2 gap-6 sm:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.id} className="text-center">
              <div className="text-2xl font-bold text-white">
                {stat.value}
              </div>
              <div className="text-xs text-gray-400 mt-1">
                {stat.name}
              </div>
            </div>
          ))}
        </div>

       
        <div className="mt-12 text-center">
          <h3 className="text-2xl font-bold text-white mb-4">
            Comienza tu preparación hoy
          </h3>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="/auth"
              className="bg-blue-600 px-6 py-3 text-base font-semibold text-white rounded-lg hover:bg-blue-500 transition-colors"
            >
              Comenzar Gratis
            </a>
            <a
              href="#features"
              className="bg-white/10 px-6 py-3 text-base font-semibold text-white rounded-lg hover:bg-white/20 transition-colors border border-white/10"
            >
              Ver Características
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}