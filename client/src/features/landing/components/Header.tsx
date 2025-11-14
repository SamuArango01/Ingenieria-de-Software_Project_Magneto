/* eslint-disable @next/next/no-img-element */
/** biome-ignore-all lint/a11y/useValidAnchor: <explanation> */
/** biome-ignore-all lint/performance/noImgElement: <explanation> */
"use client";

import { useState } from "react";
import { Dialog, DialogPanel } from "@headlessui/react";
import { Bars3Icon, XMarkIcon, MicrophoneIcon, CpuChipIcon, ChartBarSquareIcon, SparklesIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

const navigation = [
  { name: "Cómo Funciona", href: "#features" },
  { name: "Beneficios", href: "#benefits" },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="bg-slate-900 min-h-screen">
      <header className="absolute inset-x-0 top-0 z-50">
        <nav
          aria-label="Global"
          className="flex items-center justify-between p-6 lg:px-8"
        >
          <div className="flex lg:flex-1">
            <a href="/" className="-m-1.5 p-1.5 flex items-center gap-2">
               <img 
                src="starTrain.ico" 
                alt="StarTraining"
                className="h-30 w-30 text-blue-400"
              />
            </a>
          </div>
          <div className="flex lg:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-200"
            >
              <span className="sr-only">Open main menu</span>
              <Bars3Icon aria-hidden="true" className="size-6" />
            </button>
          </div>
          <div className="hidden lg:flex lg:gap-x-12">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-sm/6 font-semibold text-white hover:text-blue-400 transition-colors duration-200"
              >
                {item.name}
              </a>
            ))}
          </div>
          <div className="hidden lg:flex lg:flex-1 lg:justify-end">
            <Link 
              href="/auth" 
              className="text-sm/6 font-semibold text-white hover:text-blue-400 transition-colors duration-200"
            >
              Iniciar Sesión <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
        </nav>
        <Dialog
          open={mobileMenuOpen}
          onClose={setMobileMenuOpen}
          className="lg:hidden"
        >
          <div className="fixed inset-0 z-50" />
          <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-slate-900 p-6 sm:max-w-sm sm:ring-1 sm:ring-gray-100/10">
            <div className="flex items-center justify-between">
              <a href="/" className="-m-1.5 p-1.5 flex items-center gap-2">
                <SparklesIcon className="h-8 w-8 text-blue-400" />
                <span className="text-xl font-bold text-white">StarTraining</span>
              </a>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="-m-2.5 rounded-md p-2.5 text-gray-200"
              >
                <span className="sr-only">Close menu</span>
                <XMarkIcon aria-hidden="true" className="size-6" />
              </button>
            </div>
            <div className="mt-6 flow-root">
              <div className="-my-6 divide-y divide-white/10">
                <div className="space-y-2 py-6">
                  {navigation.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-white hover:bg-white/5 hover:text-blue-400 transition-colors duration-200"
                    >
                      {item.name}
                    </a>
                  ))}
                </div>
                <div className="py-6">
                  <Link
                    href="/auth"
                    className="-mx-3 block rounded-lg px-3 py-2.5 text-base/7 font-semibold text-white hover:bg-white/5 hover:text-blue-400 transition-colors duration-200"
                  >
                    Iniciar Sesión
                  </Link>
                </div>
              </div>
            </div>
          </DialogPanel>
        </Dialog>
      </header>

      <div className="relative isolate px-6 pt-14 lg:px-8">
        <div
          aria-hidden="true"
          className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
        >
          <div
            style={{
              clipPath:
                "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
            }}
            className="relative left-[calc(50%-11rem)] aspect-1155/678 w-144.5 -translate-x-1/2 rotate-30 bg-gradient-to-tr from-[#2563eb] to-[#1d4ed8] opacity-20 sm:left-[calc(50%-30rem)] sm:w-288.75"
          />
        </div>

        {/* Eliminé la sección de puntos decorativos */}
    
        <div className="mx-auto max-w-4xl py-16 sm:py-24 lg:py-28">
      
          <div className="hidden sm:mb-8 sm:flex sm:justify-center">
            <div className="relative rounded-full px-6 py-3 text-base/6 text-white font-semibold ring-1 ring-blue-400/30 bg-blue-500/10 hover:bg-blue-500/20 transition-all duration-300">
              <div className="flex items-center gap-2">
                <SparklesIcon className="h-5 w-5 text-blue-300" />
                <span>Plataforma de Entrevistas con IA</span>
              </div>
            </div>
          </div>
          
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl font-bold tracking-tight text-balance text-white sm:text-7xl bg-gradient-to-r from-blue-100 via-white to-blue-200 bg-clip-text text-transparent">
                StarTraining
              </h1>
            </div>

            {/* Descripción Principal */}
            <div className="space-y-4">
              <p className="text-xl font-medium text-pretty text-gray-300 sm:text-2xl/9 max-w-3xl mx-auto">
               De la práctica al éxito: entrenamiento con IA que impulsa tu desempeño y te prepara para destacar en cada entrevista laboral
              </p>
            </div>

           
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl mx-auto pt-4">
              <div className="text-center space-y-3 group">
                <div className="bg-blue-500/10 rounded-xl p-4 inline-flex border border-blue-400/20 group-hover:border-blue-300/30 group-hover:bg-blue-500/15 transition-all duration-300">
                  <MicrophoneIcon className="h-9 w-9 text-blue-300 group-hover:text-blue-200 transition-colors" />
                </div>
                <h3 className="text-white font-semibold text-base group-hover:text-blue-300 transition-colors">Grabación por Voz</h3>
                <p className="text-sm text-gray-400 group-hover:text-blue-200/70 transition-colors">Responde en tiempo real</p>
              </div>
              
              <div className="text-center space-y-3 group">
                <div className="bg-blue-500/10 rounded-xl p-4 inline-flex border border-blue-400/20 group-hover:border-blue-300/30 group-hover:bg-blue-500/15 transition-all duration-300">
                  <CpuChipIcon className="h-9 w-9 text-blue-300 group-hover:text-blue-200 transition-colors" />
                </div>
                <h3 className="text-white font-semibold text-base group-hover:text-blue-300 transition-colors">IA Avanzada</h3>
                <p className="text-sm text-gray-400 group-hover:text-blue-200/70 transition-colors">Análisis profundo</p>
              </div>
              
              <div className="text-center space-y-3 group">
                <div className="bg-blue-500/10 rounded-xl p-4 inline-flex border border-blue-400/20 group-hover:border-blue-300/30 group-hover:bg-blue-500/15 transition-all duration-300">
                  <ChartBarSquareIcon className="h-9 w-9 text-blue-300 group-hover:text-blue-200 transition-colors" />
                </div>
                <h3 className="text-white font-semibold text-base group-hover:text-blue-300 transition-colors">Métricas Detalladas</h3>
                <p className="text-sm text-gray-400 group-hover:text-blue-200/70 transition-colors">Seguimiento de progreso</p>
              </div>
            </div>

            <div className="space-y-4 pt-8">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/auth"
                  className="relative group bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-4 text-base font-semibold text-white rounded-lg shadow-lg hover:shadow-blue-500/25 transform hover:scale-105 transition-all duration-300 hover:from-blue-500 hover:to-blue-600 border border-blue-500/20"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Comenzar Entrenamiento 
                  </span>
                </Link>
                <a href="#features" className="group flex items-center gap-2 text-base font-semibold text-white hover:text-blue-300 transition-colors duration-200">
                  <span>Ver Demo</span>
                  <div className="group-hover:translate-x-1 transition-transform duration-300">
                    <span aria-hidden="true" className="text-lg">→</span>
                  </div>
                </a>
              </div>
              
            </div>
          </div>
        </div>

       
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
        >
          <div
            style={{
              clipPath:
                "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
            }}
            className="relative left-[calc(50%+3rem)] aspect-1155/678 w-144.5 -translate-x-1/2 bg-gradient-to-tr from-[#2563eb] to-[#1d4ed8] opacity-20 sm:left-[calc(50%+36rem)] sm:w-288.75"
          />
        </div>
      </div>
    </div>
  );
}