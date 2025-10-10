'use client';

import { useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';
import { apiClient } from '@/lib/api/client';
import {
  setupRequestInterceptor,
  setupResponseInterceptor,
  setupAuthErrorInterceptor,
} from '@/lib/api/interceptors';

/**
 * Este componente no renderiza UI. Su único propósito es configurar los
 * interceptores de Axios utilizando los hooks de Clerk (`useAuth`) una vez
 * que la aplicación se ha montado en el cliente.
 */
export function AxiosInterceptorProvider({ children }: { children: React.ReactNode }) {
  const { getToken, signOut, isLoaded } = useAuth();

  useEffect(() => {
    setupRequestInterceptor(apiClient, getToken);
    setupResponseInterceptor(apiClient, signOut);
    setupAuthErrorInterceptor(apiClient, signOut);
  }, [getToken, signOut, isLoaded]);

  return <>{children}</>;
}
