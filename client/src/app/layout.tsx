"use client";

import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { esES } from "@clerk/localizations";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AxiosInterceptorProvider } from "@/components/providers/AxiosInterceptorProvider";

const queryClient = new QueryClient();

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
            <AxiosInterceptorProvider>{children}</AxiosInterceptorProvider>
          </body>
        </html>
      </QueryClientProvider>
    </ClerkProvider>
  );
}
