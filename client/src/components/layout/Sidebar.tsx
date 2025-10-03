"use client";

import Link from "next/link";
import {
  LayoutDashboard,
  Users,
  FileText,
  BarChart2,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import React, { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const navigation = [
  { name: "Dashboard", href: "/entrevistador", icon: LayoutDashboard },
  {
    name: "Entrevistas",
    href: "/entrevistador/entrevistas",
    icon: Users,
  },
  {
    name: "Reportes",
    href: "/entrevistador/reportes",
    icon: FileText,
  },
  { name: "Analisis", href: "/entrevistador/analisis", icon: BarChart2 },
  {
    name: "Configuracion",
    href: "/entrevistador/configuracion",
    icon: Settings,
  },
];

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside
      className={`hidden lg:flex lg:flex-col bg-gray-900 text-white border-r border-gray-800 transition-all duration-300 ease-in-out ${
        isCollapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Sidebar Header */}
      <div
        className={`flex items-center h-16 border-b border-gray-800 transition-all duration-300 ease-in-out ${
          isCollapsed ? "justify-center" : "justify-between px-4"
        }`}
      >
        {!isCollapsed && (
          <div className="flex items-center">
            <div className="h-8 w-8 bg-emerald-500 rounded-lg mr-3"></div>
            <h1 className="text-xl font-semibold">StarTraining</h1>
          </div>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
        >
          {isCollapsed ? (
            <ChevronRight className="h-6 w-6" />
          ) : (
            <ChevronLeft className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-4 space-y-2">
        <TooltipProvider>
          {navigation.map((item) => (
            <Tooltip key={item.name}>
              <TooltipTrigger asChild>
                <Link
                  href={item.href}
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-300 hover:bg-gray-700 hover:text-white transition-colors ${
                    isCollapsed ? "justify-center" : ""
                  }`}
                >
                  <item.icon
                    className={`h-5 w-5 ${
                      isCollapsed ? "mr-0" : "mr-3"
                    }`}
                  />
                  {!isCollapsed && <span>{item.name}</span>}
                </Link>
              </TooltipTrigger>
              {isCollapsed && <TooltipContent side="right">{item.name}</TooltipContent>}
            </Tooltip>
          ))}
        </TooltipProvider>
      </nav>

      {/* Sidebar Footer */}
      <div className="border-t border-gray-800 p-4">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="/"
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-300 hover:bg-gray-700 hover:text-white transition-colors ${
                  isCollapsed ? "justify-center" : ""
                }`}
              >
                <LogOut
                  className={`h-5 w-5 ${
                    isCollapsed ? "mr-0" : "mr-3"
                  }`}
                />
                {!isCollapsed && <span>Salir del Dashboard</span>}
              </Link>
            </TooltipTrigger>
            {isCollapsed && <TooltipContent side="right">Salir del Dashboard</TooltipContent>}
          </Tooltip>
        </TooltipProvider>
      </div>
    </aside>
  );
}
