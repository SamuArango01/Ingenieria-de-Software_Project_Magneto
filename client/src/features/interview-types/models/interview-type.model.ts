/**
 * Representa la estructura de un tipo de entrevista, tal como se recibe del backend.
 */
export interface InterviewType {
  id: number;
  name: string;
  description: string; // Este campo contendrá el prompt para la IA
  isPublic: boolean;
  createdBy: string; // El ID del usuario que lo creó
  isActive: boolean;
  createdAt: string; // Fecha en formato ISO 8601
  updatedAt: string; // Fecha en formato ISO 8601
}

/**
 * Define los posibles valores para el filtro de la lista de tipos de entrevista.
 */
export type FilterType = 'all' | 'user' | 'public';
