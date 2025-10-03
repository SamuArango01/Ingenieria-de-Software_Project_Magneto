"use client";

import React from "react";
import { UserButton, useUser } from "@clerk/nextjs";
import { Menu } from "lucide-react"; // Using Menu icon from lucide-react for mobile toggle
import NotificationDropdown from "./NotificationDropdown";

export default function Header({
  onMobileSidebarToggle,
}: { 
  onMobileSidebarToggle: () => void;
}) {
  const { user } = useUser();

  return (
    <header className="bg-gray-900 border-b border-gray-800 shadow-lg h-16">
      <div className="flex items-center justify-between h-full px-4 sm:px-6 lg:px-8">
        {/* Mobile sidebar toggle */}
        <button
          type="button"
          className="lg:hidden p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
          onClick={onMobileSidebarToggle}
        >
          <Menu className="h-6 w-6" />
        </button>



        {/* User Info and Notifications */}
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