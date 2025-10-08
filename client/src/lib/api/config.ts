export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3211/api";

// Configuración base de Axios
export const axiosConfig = {
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
};
