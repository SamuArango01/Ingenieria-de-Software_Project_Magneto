"use client";

import { AuthBackground } from "./components/Background";

import { AuthCard } from "./components/AuthCard";
import { useUser } from "@clerk/nextjs";
import { useEffect } from "react";
import { LoadingCard } from "./components/LoadingCard";
import { useRouter } from "next/navigation";

export function Auth() {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && user) {
      router.push("/dashboard");
    }
  }, [user, isLoaded, router]);

  if (!isLoaded || user) {
    return (
      <AuthBackground>
        <LoadingCard />
      </AuthBackground>
    );
  }

  return (
    <AuthBackground>
      <AuthCard />
    </AuthBackground>
  );
}
