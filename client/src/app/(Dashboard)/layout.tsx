"use client";

import Link from "next/link";
import {
  HomeIcon,
  UserGroupIcon,
  DocumentTextIcon,
  ChartBarIcon,
  CogIcon,
  BellIcon,
  Bars3Icon,
} from "@heroicons/react/24/outline";
import { useState } from "react";
import { UserButton, useUser } from "@clerk/nextjs";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useUser();

  const navigation = [
    { name: "Dashboard", href: "/entrevistador", icon: HomeIcon },
    {
      name: "Entrevistas",
      href: "/entrevistador/entrevistas",
      icon: UserGroupIcon,
    },
    {
      name: "Reportes",
      href: "/entrevistador/reportes",
      icon: DocumentTextIcon,
    },
    { name: "Analisis", href: "/entrevistador/analisis", icon: ChartBarIcon },
    {
      name: "Configuracion",
      href: "/entrevistador/configuracion",
      icon: CogIcon,
    },
  ];

  return (
    <div className="bg-gray-900 min-h-screen">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 shadow-lg">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <button
                type="button"
                className="lg:hidden p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                <Bars3Icon className="h-6 w-6" />
              </button>
              <div className="flex items-center ml-4 lg:ml-0">
                <div className="h-8 w-8 bg-emerald-500 rounded-lg mr-3"></div>
                <h1 className="text-xl font-semibold text-white">
                  StarTraining Dashboard
                </h1>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button
                type="button"
                className="p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700"
              >
                <BellIcon className="h-6 w-6" />
              </button>
              <div className="flex items-center space-x-3">
                <UserButton />
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-white">
                    {user?.fullName}
                  </p>
                  <p className="text-xs text-gray-400">
                    {user?.primaryEmailAddress?.emailAddress}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-50 w-64 bg-gray-800 border-r border-gray-700 transform transition-transform duration-300 ease-in-out lg:transform-none`}
        >
          <div className="flex flex-col h-full">
            <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
              <nav className="mt-5 flex-1 px-2 space-y-1">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="text-gray-300 hover:bg-gray-700 hover:text-white group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors"
                  >
                    <item.icon className="text-gray-400 group-hover:text-gray-300 mr-3 h-6 w-6" />
                    {item.name}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Sidebar Footer */}
            <div className="flex-shrink-0 flex border-t border-gray-700 p-4">
              <Link
                href="/"
                className="flex items-center w-full text-gray-300 hover:text-white"
              >
                <div className="text-sm">
                  <p className="font-medium">Salir del Dashboard</p>
                  <p className="text-gray-400">Volver al inicio</p>
                </div>
              </Link>
            </div>
          </div>
        </aside>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div
            className="lg:hidden fixed inset-0 z-40 bg-gray-600 bg-opacity-75"
            onClick={() => setSidebarOpen(false)}
          ></div>
        )}

        {/* Main content */}
        <main className="flex-1 lg:ml-0">
          <div className="min-h-screen">{children}</div>
        </main>
      </div>
    </div>
  );
}
