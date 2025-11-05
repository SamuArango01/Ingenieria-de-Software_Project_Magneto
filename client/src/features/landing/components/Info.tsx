/* eslint-disable @next/next/no-img-element */
/** biome-ignore-all lint/performance/noImgElement: <explanation> */
"use client";

import {
  MicrophoneIcon,
  ChartBarIcon,
  CpuChipIcon,
  UserGroupIcon,
  ClockIcon,
  ShieldCheckIcon,
} from "@heroicons/react/20/solid";
import { useState } from "react";

const features = [
  {
    name: "Entrevistas Realistas con IA",
    description: "Practica con entrevistadores virtuales impulsados por IA que se adaptan a tus respuestas y simulan diferentes tipos de personalidades y escenarios laborales.",
    icon: MicrophoneIcon,
  },
  {
    name: "Análisis Detallado de Desempeño",
    description: "Obtén métricas precisas sobre tu comunicación no verbal, tono de voz, claridad en respuestas y tiempo de reacción con feedback inmediato.",
    icon: ChartBarIcon,
  },
  {
    name: "Tecnología de Voz Avanzada",
    description: "Nuestra IA transcribe y analiza tus respuestas en tiempo real, identificando áreas de mejora y patrones de lenguaje.",
    icon: CpuChipIcon,
  },
  {
    name: "Preparación para Diferentes Industrias",
    description: "Accede a bancos de preguntas específicas para tecnología, finanzas, salud, marketing y más, con respuestas modelo validadas por reclutadores.",
    icon: UserGroupIcon,
  },
  {
    name: "Entrenamiento Flexible 24/7",
    description: "Practica cuando quieras, donde quieras. Sin horarios fijos y con la posibilidad de pausar y retomar tus sesiones.",
    icon: ClockIcon,
  },
  {
    name: "Privacidad y Seguridad Garantizada",
    description: "Tus datos y grabaciones están protegidos. Tu información personal nunca se comparte.",
    icon: ShieldCheckIcon,
  },
];

export function Info() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  return (
    <div className="overflow-hidden bg-slate-900 py-24 sm:py-32" id="features">
      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:max-w-none">
          {/* Encabezado más sutil */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-2 mb-6">
              <span className="text-sm font-medium text-blue-400">Características Principales</span>
            </div>
            <h2 className="mt-2 text-4xl font-semibold tracking-tight text-pretty text-white sm:text-5xl">
              Todo lo que necesitas para triunfar
            </h2>
            <p className="mt-6 text-lg text-gray-300 max-w-3xl mx-auto">
              Nuestra plataforma combina inteligencia artificial de última generación 
              con metodologías probadas por expertos en recursos humanos.
            </p>
          </div>

          {/* Grid de características más sutil */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <div 
                key={feature.name}
                className="relative group"
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div className="relative bg-slate-800/40 rounded-xl p-6 border border-slate-700/30 group-hover:border-blue-500/20 group-hover:bg-slate-800/60 transition-all duration-300">
                  {/* Ícono simple */}
                  <div className="mb-4">
                    <div className="bg-blue-500/10 p-3 rounded-lg border border-blue-500/20 inline-flex">
                      <feature.icon
                        aria-hidden="true"
                        className="size-6 text-blue-400"
                      />
                    </div>
                  </div>

                  {/* Contenido */}
                  <h3 className="text-lg font-semibold text-white mb-3 group-hover:text-blue-100 transition-colors duration-300">
                    {feature.name}
                  </h3>
                  <p className="text-gray-400 text-sm/6 group-hover:text-gray-300 transition-colors duration-300">
                    {feature.description}
                  </p>

                  {/* Línea sutil al hover */}
                  <div className="absolute bottom-0 left-6 right-6 h-0.5 bg-blue-500/0 group-hover:bg-blue-500/30 transition-all duration-300 rounded-full"></div>
                </div>
              </div>
            ))}
          </div>

  
        </div>
      </div>
    </div>
  );
}