"use client";

import "./globals.css";
import { ClerkProvider, useAuth } from "@clerk/nextjs";
import { esES } from "@clerk/localizations";
import { useEffect } from "react";
import { apiClient } from "@/lib/api/client";
import {
  setupRequestInterceptor,
  setupResponseInterceptor,
  setupAuthErrorInterceptor,
} from "@/lib/api/interceptors";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Create a new instance of QueryClient
const queryClient = new QueryClient();

function ClerkInterceptor({ children }: { children: React.ReactNode }) {
  const { getToken, signOut } = useAuth();

  useEffect(() => {
    setupRequestInterceptor(apiClient, getToken);
    setupResponseInterceptor(apiClient, signOut);
    setupAuthErrorInterceptor(apiClient, signOut);
  }, [getToken, signOut]);

  return <>{children}</>;
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider localization={esES}>
      <QueryClientProvider client={queryClient}>
        <html lang="en">
          <body>
            <ClerkInterceptor>{children}</ClerkInterceptor>
          </body>
        </html>
      </QueryClientProvider>
    </ClerkProvider>
  );
}
