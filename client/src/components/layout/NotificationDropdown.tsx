"use client";

import React from "react";
import { Bell } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function NotificationDropdown() {
  // Sample notifications
  const notifications = [
    { id: 1, message: "Entrevista completada, resultados disponibles.", read: false, link: "/entrevistador/reportes/123" },
    { id: 2, message: "Nueva solicitud de entrevista recibida.", read: true, link: "/entrevistador/entrevistas" },
    { id: 3, message: "Tu perfil ha sido actualizado.", read: true, link: "/entrevistador/configuracion" },
  ];

  const unreadNotifications = notifications.filter(n => !n.read).length;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="relative p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
        >
          <Bell className="h-6 w-6" />
          {unreadNotifications > 0 && (
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500" />
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80 bg-gray-800 text-white border border-gray-700">
        <DropdownMenuLabel className="text-lg font-semibold">Notificaciones</DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-gray-700" />
        {notifications.length === 0 ? (
          <DropdownMenuItem className="text-gray-400">No hay notificaciones nuevas.</DropdownMenuItem>
        ) : (
          notifications.map((notification) => (
            <DropdownMenuItem
              key={notification.id}
              className={`flex flex-col items-start p-2 cursor-pointer hover:bg-gray-700 ${
                !notification.read ? "bg-gray-700/50" : ""
              }`}
              onClick={() => {
                // Handle notification click, e.g., navigate to link
                console.log("Notification clicked:", notification.message);
                // router.push(notification.link); // If using Next.js router
              }}
            >
              <p className={`text-sm ${!notification.read ? "font-semibold" : "text-gray-300"}`}>
                {notification.message}
              </p>
              <p className="text-xs text-gray-500">Hace 5 minutos</p> {/* Placeholder for time */}
            </DropdownMenuItem>
          ))
        )}
        <DropdownMenuSeparator className="bg-gray-700" />
        <DropdownMenuItem className="text-center text-blue-400 hover:text-blue-300 cursor-pointer">
          Ver todas las notificaciones
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
