"use client";

import React, { useState } from "react";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false); // New state for desktop sidebar collapse

  return (
    <div className="bg-gray-900 min-h-screen flex">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex">
        <Sidebar isCollapsed={isSidebarCollapsed} />
      </div>

      {/* Mobile Sidebar (as a drawer) */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        ></div>
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 border-r border-gray-800 transform transition-transform duration-300 ease-in-out lg:hidden ${
          mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Sidebar isCollapsed={false} /> {/* Mobile sidebar is always expanded */}
      </aside>

      <div className="flex flex-col flex-1 transition-all duration-300 ease-in-out">
        {/* Header */}
        <Header
          onMobileSidebarToggle={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          onDesktopSidebarToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          isSidebarCollapsed={isSidebarCollapsed}
          pageTitle="Dashboard"
        />

        {/* Main content */}
        <main className="flex-1 p-4 lg:p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}