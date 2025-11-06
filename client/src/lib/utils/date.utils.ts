/**
 * Utilidades para formateo de fechas en español
 */

const SPANISH_MONTHS = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre',
];

/**
 * Convierte formato YYYY-MM a nombre completo del mes en español
 * @param yearMonth - Fecha en formato "YYYY-MM" (ej: "2025-01")
 * @returns Nombre del mes en español (ej: "Enero")
 * @example
 * formatMonthToSpanish("2025-01") // "Enero"
 * formatMonthToSpanish("2025-12") // "Diciembre"
 */
export function formatMonthToSpanish(yearMonth: string): string {
  const [, monthStr] = yearMonth.split('-');
  const monthNumber = parseInt(monthStr, 10);

  if (isNaN(monthNumber) || monthNumber < 1 || monthNumber > 12) {
    console.warn(`Invalid month format: ${yearMonth}`);
    return yearMonth; // Return original if invalid
  }

  return SPANISH_MONTHS[monthNumber - 1];
}

/**
 * Obtiene el nombre completo del mes en español a partir del número
 * @param monthNumber - Número del mes (1-12)
 * @returns Nombre del mes en español
 * @example
 * getMonthNameSpanish(1) // "Enero"
 * getMonthNameSpanish(12) // "Diciembre"
 */
export function getMonthNameSpanish(monthNumber: number): string {
  if (monthNumber < 1 || monthNumber > 12) {
    console.warn(`Invalid month number: ${monthNumber}`);
    return `Mes ${monthNumber}`;
  }

  return SPANISH_MONTHS[monthNumber - 1];
}
