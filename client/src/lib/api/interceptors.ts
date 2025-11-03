// Interceptores de Axios
import type {
  AxiosInstance,
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";
import { normalizeErrorMessage, type NormalizedAxiosError } from "./errors";

export const setupRequestInterceptor = (client: AxiosInstance, getToken: () => Promise<string | null | undefined>) => {
  client.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
      try {
        const token = await getToken();

        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (error) {
        console.error("Error al obtener el token de Clerk en el interceptor:", error);
        // Aquí podrías manejar el error, por ejemplo, redirigir al login si es crítico
      }

      // Log para desarrollo (opcional)
      if (process.env.NODE_ENV === "development") {
        console.log(
          `🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`
        );
      }

      return config;
    },
    (error: AxiosError) => {
      console.error("❌ Request Error:", error);
      return Promise.reject(error);
    }
  );
};

export const setupResponseInterceptor = (client: AxiosInstance, signOut: () => Promise<void>) => {
  client.interceptors.response.use(
    (response) => {
      // Log para desarrollo (opcional)
      if (process.env.NODE_ENV === "development") {
        console.log(
          `✅ API Response: ${response.config.method?.toUpperCase()} ${
            response.config.url
          } - Status: ${response.status}`
        );
      }

      return response;
    },
    (error: AxiosError) => {
      // NORMALIZAR ERROR usando tu middleware
      const normalizedMessage = normalizeErrorMessage(error);
      
      // Agregar mensaje normalizado al error para que los hooks puedan usarlo
      const normalizedError = error as NormalizedAxiosError;
      normalizedError.normalizedMessage = normalizedMessage;

      // Manejo de errores globales
      if (error.response) {
        const { status } = error.response;

        // Token expirado o no válido
        if (status === 401) {
          signOut(); // Reemplazado con signOut de Clerk

          // Solo redirigir si no estamos ya en la página de login
          if (
            typeof window !== "undefined" &&
            !window.location.pathname.includes("/auth/login")
          ) {
            window.location.href = "/auth/login";
          }
        }

        // Log mejorado para desarrollo
        if (process.env.NODE_ENV === "development") {
          console.group(`🚨 API Error [${status}]`);
          console.error("Normalized Message:", normalizedMessage);
          console.error("Original Response:", error.response.data);
          console.error("Full Error:", error);
          console.groupEnd();
        }
      } else if (error.request) {
        // Error de red o timeout
        if (process.env.NODE_ENV === "development") {
          console.error("❌ Network Error:", normalizedMessage);
        }
      }

      return Promise.reject(error);
    }
  );
};

export const setupAuthErrorInterceptor = (client: AxiosInstance, signOut: () => Promise<void>) => {
  client.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
      // Si la respuesta es 401 (No autorizado) o 403 (Prohibido), quemar el token
      if (error.response?.status === 401 || error.response?.status === 403) {
        signOut(); // Reemplazado con signOut de Clerk
      }

      return Promise.reject(error);
    }
  );
};
