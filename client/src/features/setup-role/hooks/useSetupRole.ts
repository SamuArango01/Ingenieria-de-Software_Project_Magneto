
"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export function useSetupRole() {
  const { user } = useUser();
  const router = useRouter();
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [otherRole, setOtherRole] = useState("");
  const [experience, setExperience] = useState("");

  useEffect(() => {
    if (user?.fullName) {
      setName(user.fullName);
    }
  }, [user]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí se manejaría el envío del formulario
    console.log({ name, role, otherRole, experience });
    router.push("/dashboard");
  };

  return {
    name,
    setName,
    role,
    setRole,
    otherRole,
    setOtherRole,
    experience,
    setExperience,
    handleSubmit,
    user,
  };
}
