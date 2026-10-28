/** 3/11/2026, siempre en hora de Colombia, sin importar dónde corra el código. */
export function formatDate(date: Date): string {
  return date.toLocaleDateString('es-CO', { timeZone: 'America/Bogota' });
}
