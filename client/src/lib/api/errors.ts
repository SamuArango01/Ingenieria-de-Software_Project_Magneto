// Manejo de errores

import axios, { type AxiosError } from "axios";

export interface ApiError {
  message: string;
  status?: number;
  code?: string;
}

// Tipo para errores que han pasado por el interceptor con normalización
export interface NormalizedAxiosError extends AxiosError {
  normalizedMessage?: string;
}

interface ErrorResponseData {
  message?: string;
}

export const extractApiError = (error: unknown): ApiError => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ErrorResponseData>;
    return {
      message:
        axiosError.response?.data?.message ||
        axiosError.message ||
        "Error desconocido",
      status: axiosError.response?.status,
      code: axiosError.code,
    };
  }

  return {
    message: "Error desconocido",
  };
};

/**
 * MIDDLEWARE DE NORMALIZACIÓN DE ERRORES
 * 
 * Normaliza los diferentes formatos de error que puede devolver el backend
 * a un formato consistente que la UI puede manejar fácilmente
 */
export const normalizeErrorMessage = (error: AxiosError): string => {
  // Si no hay respuesta (error de red), usar mensaje del error
  if (!error.response?.data) {
    return error.message || 'Error de conexión';
  }
  const json = error.response.data as ApiError
  const errorMessage = json?.message ?? "Error desconocido";

  return errorMessage;
};

/**
 * FUNCIÓN MEJORADA QUE MANTIENE LA INTERFACE EXISTENTE
 * pero usa la normalización interna
 */
export const extractNormalizedApiError = (error: unknown): ApiError => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError;
    
    return {
      message: normalizeErrorMessage(axiosError),
      status: axiosError.response?.status,
      code: axiosError.code,
    };
  }

  return {
    message: "Error desconocido",
  };
};
