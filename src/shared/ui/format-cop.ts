import type { Money } from '../domain/value-objects/money';

/** $945.000 — decisión de presentación (mercadeo), no del negocio. */
export function formatCOP(money: Money): string {
  return `$${money.amount.toLocaleString('es-CO')}`;
}
