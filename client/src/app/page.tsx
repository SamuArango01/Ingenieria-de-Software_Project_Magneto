"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function App() {
  const [message, setMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchMessage = async () => {
      try {
        const response = await fetch("http://localhost:3211/");
        const data = await response.json();
        setMessage(data.message);
      } catch (error) {
        console.log(error);
        setError(error instanceof Error ? error.message : "Error al cargar");
      } finally {
        setLoading(false);
      }
    };

    fetchMessage();
  }, []);

  return (
    <div className="bg-gray-900 min-h-screen">
      <header className="absolute inset-x-0 top-0 z-50">
        <nav
          aria-label="Global"
          className="flex items-center justify-between p-6 lg:px-8"
        >
          <div className="flex lg:flex-1">
            <a href="#" className="-m-1.5 p-1.5">
              <span className="sr-only">StarTraining</span>
              <div className="h-8 w-8 bg-emerald-500 rounded-lg"></div>
            </a>
          </div>
          <div className="hidden lg:flex lg:gap-x-12">
            <a href="#" className="text-sm font-semibold text-white">
              API
            </a>
            <a href="#" className="text-sm font-semibold text-white">
              Features
            </a>
            <a href="#" className="text-sm font-semibold text-white">
              Docs
            </a>
            <Link
              href={"/register"}
              className="text-sm font-semibold text-white"
            >
              Dashboard
            </Link>
          </div>
          <div className="hidden lg:flex lg:flex-1 lg:justify-end"></div>
        </nav>
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
            className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-emerald-400 to-green-600 opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
          ></div>
        </div>

        <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
          <div className="hidden sm:mb-8 sm:flex sm:justify-center">
            <div className="relative rounded-full px-3 py-1 text-sm text-gray-400 ring-1 ring-white/10 hover:ring-white/20">
              API conectada exitosamente.{" "}
              <a href="#" className="font-semibold text-emerald-400">
                <span aria-hidden="true" className="absolute inset-0"></span>Ver
                más <span aria-hidden="true">&rarr;</span>
              </a>
            </div>
          </div>

          <div className="text-center">
            <h1 className="text-5xl font-semibold tracking-tight text-white sm:text-7xl mb-8">
              StarTraining
            </h1>

            <div className="mb-8">
              {loading && (
                <p className="text-emerald-400 text-3xl font-bold animate-pulse">
                  Cargando...
                </p>
              )}
              {error && (
                <p className="text-red-400 text-2xl font-bold">
                  Error: {error}
                </p>
              )}
              {message && (
                <p className="text-emerald-400 text-8xl font-bold animate-pulse mb-4">
                  {message}
                </p>
              )}
            </div>

            <p className="mt-8 text-lg font-medium text-gray-400 sm:text-xl">
              Servidor API corriendo en localhost:3211. Conectividad y respuesta
              verificadas exitosamente.
            </p>

            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                href={"/register"}
                className="rounded-md bg-emerald-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500"
              >
                Registrarse
              </Link>
              <a href="#" className="text-sm font-semibold text-white">
                Documentación <span aria-hidden="true">→</span>
              </a>
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
            className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-emerald-400 to-green-600 opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
          ></div>
        </div>
      </div>
    </div>
  );
}
