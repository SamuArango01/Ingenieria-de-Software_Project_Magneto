"use client";

import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { esES } from "@clerk/localizations";
import { useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { apiClient } from "@/lib/api/client";
import { setupRequestInterceptor, setupResponseInterceptor, setupAuthErrorInterceptor } from "@/lib/api/interceptors"; // Import all interceptor setup functions

function ClerkInterceptor({ children }: { children: React.ReactNode }) {
  const { getToken, signOut } = useAuth();

  useEffect(() => {
    // Setup the request interceptor with Clerk's getToken
    setupRequestInterceptor(apiClient, getToken);
    // Setup response interceptors with Clerk's signOut
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
      <html lang="en">
        <body>
          <ClerkInterceptor>{children}</ClerkInterceptor>
        </body>
      </html>
    </ClerkProvider>
  );
}
