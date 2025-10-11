import { getAuth } from '@clerk/express';
import { UserService } from '@/modules/users/services/UserService';
import type { Request, Response, NextFunction } from 'express';

/**
 * Middleware para sincronizar el usuario de Clerk con la base de datos local.
 * Utiliza UserService para la lógica de "obtener o crear".
 */
export const syncUserMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = getAuth(req);

  if (!userId) {
    return next(); // Ruta no protegida, continuar
  }

  const userService = new UserService();
  const result = await userService.getOrCreateUser(userId);

  result.match(
    (_user) => {
      // El usuario fue encontrado o creado exitosamente.
      // Opcionalmente, podríamos adjuntar el usuario de la BD a la request si fuera necesario:
      // (req as any).dbUser = user;
      next(); // Continuar al siguiente middleware o controlador
    },
    (error) => {
      // Si hubo un error durante la sincronización, detener la petición
      // y devolver una respuesta de error apropiada.
      if (error.type === 'ClerkUserNotFoundError') {
        return res.status(404).json({ message: error.message });
      }
      return res.status(500).json({ message: error.message });
    }
  );
};
