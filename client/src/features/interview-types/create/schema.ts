import * as z from 'zod';

/**
 * El esquema de validación para el formulario de creación de tipos de entrevista.
 */
export const createInterviewTypeSchema = z.object({
  name: z.string().min(5, { message: 'El nombre debe tener al menos 5 caracteres.' }),
  description: z.string().min(20, { message: 'El prompt debe tener al menos 20 caracteres.' }),
});

/**
 * El tipo de TypeScript inferido del esquema de Zod. Se usa para tipar el formulario
 * y los datos de envío.
 */
export type CreateInterviewTypeValues = z.infer<typeof createInterviewTypeSchema>;
