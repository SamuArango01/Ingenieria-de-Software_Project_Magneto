"use client";

import React from "react";
import { UserButton, useUser } from "@clerk/nextjs";
import { Menu, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import NotificationDropdown from "./NotificationDropdown";
import { Separator } from "@/components/ui/separator";

export default function Header({
  onMobileSidebarToggle,
  onDesktopSidebarToggle,
  isSidebarCollapsed,
  pageTitle,
}: {
  onMobileSidebarToggle: () => void;
  onDesktopSidebarToggle: () => void;
  isSidebarCollapsed: boolean;
  pageTitle: string;
}) {
  const { user } = useUser();

  return (
    <header className="bg-gray-900 border-b border-gray-800 shadow-lg h-20">
      <div className="flex items-center justify-between h-full px-4 sm:px-6 lg:px-8">
        {/* Left section: Mobile toggle, Desktop toggle, Separator, Page Title */}
        <div className="flex items-center space-x-4">
          {/* Mobile sidebar toggle */}
          <button
            type="button"
            className="lg:hidden p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            onClick={onMobileSidebarToggle}
          >
            <Menu className="h-6 w-6" />
          </button>

          {/* Desktop sidebar toggle */}
          <button
            type="button"
            className="hidden lg:block p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            onClick={onDesktopSidebarToggle}
          >
            {isSidebarCollapsed ? (
              <PanelLeftOpen className="h-6 w-6" />
            ) : (
              <PanelLeftClose className="h-6 w-6" />
            )}
          </button>

          {/* Vertical Separator */}
          <Separator orientation="vertical" className="w-px bg-gray-400 hidden lg:block" />

          {/* Page Title */}
          <h2 className="text-xl font-semibold text-white hidden lg:block">{pageTitle}</h2>
        </div>

        {/* Right section: Notifications and User Info */}
        <div className="flex items-center space-x-4">
          <NotificationDropdown />
          <div className="flex items-center space-x-3">
            <UserButton afterSignOutUrl="/" />
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
    </header>
  );
}