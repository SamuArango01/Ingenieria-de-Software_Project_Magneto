/**
 * Utilidades para manejo de avatares de usuario
 */

/**
 * Genera URL de avatar placeholder usando pravatar.cc
 * @param userId - ID del usuario para generar un avatar único
 * @returns URL del avatar placeholder
 * @example
 * getPlaceholderAvatar("user_123") // "https://i.pravatar.cc/150?u=user_123"
 */
export function getPlaceholderAvatar(userId: string): string {
  return `https://i.pravatar.cc/150?u=${encodeURIComponent(userId)}`;
}

/**
 * Genera URL de avatar placeholder por índice
 * @param index - Índice numérico para generar avatar
 * @returns URL del avatar placeholder
 * @example
 * getPlaceholderAvatarByIndex(1) // "https://i.pravatar.cc/150?img=1"
 */
export function getPlaceholderAvatarByIndex(index: number): string {
  return `https://i.pravatar.cc/150?img=${index}`;
}
