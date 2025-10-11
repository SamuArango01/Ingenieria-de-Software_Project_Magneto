// Cliente Axios principal
import axios from "axios";
import { axiosConfig } from "./config";
import {
  setupResponseInterceptor,
  setupAuthErrorInterceptor,
} from "./interceptors";

export const apiClient = axios.create(axiosConfig);

// Configurar interceptores

export default apiClient;
