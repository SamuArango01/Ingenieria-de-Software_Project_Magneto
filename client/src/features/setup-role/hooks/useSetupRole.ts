
"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { getAllWorkFields } from "@/services/workFieldService";
import { getUserConfiguration, createOrUpdateUserConfiguration } from "@/services/userConfigurationService";

// Tipos locales para los datos del servicio
interface WorkField {
  id: number;
  description: string;
}

export function useSetupRole() {
  const { user } = useUser();
  const router = useRouter();

  // State para el formulario
  const [name, setName] = useState("");
  const [workFieldId, setWorkFieldId] = useState<string>("");
  const [customWorkField, setCustomWorkField] = useState("");
  const [yearsOfExperience, setYearsOfExperience] = useState("");

  // State para la UI y datos de la API
  const [workFields, setWorkFields] = useState<WorkField[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar datos iniciales
  useEffect(() => {
    if (user?.fullName) {
      setName(user.fullName);
    }

    async function loadInitialData() {
      try {
        setIsLoading(true);
        setError(null);

        // Cargar work-fields y configuración de usuario en paralelo
        const [fields, config] = await Promise.all([
          getAllWorkFields(),
          getUserConfiguration(),
        ]);

        setWorkFields(fields);

        // Si existe configuración previa, rellenar el formulario
        if (config) {
          if (config.workFieldId) {
            setWorkFieldId(String(config.workFieldId));
          } else if (config.customWorkField) {
            setWorkFieldId("otro");
            setCustomWorkField(config.customWorkField);
          }
          setYearsOfExperience(String(config.yearsOfExperience));
        }
      } catch (err: any) {
        setError(err.message || "Error al cargar los datos iniciales.");
      } finally {
        setIsLoading(false);
      }
    }

    loadInitialData();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    try {
      const experienceNum = parseInt(yearsOfExperience, 10);
      if (isNaN(experienceNum)) {
        throw new Error("Los años de experiencia deben ser un número.");
      }

      await createOrUpdateUserConfiguration({
        workFieldId: workFieldId && workFieldId !== "otro" ? parseInt(workFieldId, 10) : undefined,
        customWorkField: workFieldId === "otro" ? customWorkField : undefined,
        yearsOfExperience: experienceNum,
      });

      router.push("/dashboard"); // Redirigir al dashboard tras guardar

    } catch (err: any) {
      setError(err.message || "Error al guardar la configuración.");
      setIsSaving(false);
    }
  };

  return {
    name,
    setName,
    workFieldId,
    setWorkFieldId,
    customWorkField,
    setCustomWorkField,
    yearsOfExperience,
    setYearsOfExperience,
    workFields,
    isLoading,
    isSaving,
    error,
    handleSubmit,
    user,
  };
}
