import type { Money } from '@/shared/domain/value-objects/money';
import type { DateRange } from '@/shared/domain/value-objects/date-range';
import { formatCOP } from '@/shared/ui/format-cop';
import { formatDate } from '@/shared/ui/format-date';
import { calculatePrice } from '../../domain/rules/pricing';
import { STANDARD_DISCOUNT, type DiscountPolicy } from '../../domain/value-objects/discount-policy';

/** Todo en texto, listo para pintar en el resumen antes de confirmar. */
export interface BookingSummaryViewModel {
  vehicleLabel: string;
  dateRangeLabel: string;
  days: string;
  subtotal: string;
  discountLabel: string | null;
  total: string;
}

export function toBookingSummary(
  vehicleLabel: string,
  period: DateRange,
  dailyRate: Money,
  policy: DiscountPolicy = STANDARD_DISCOUNT,
): BookingSummaryViewModel {
  const price = calculatePrice(period, dailyRate, policy);
  return {
    vehicleLabel,
    dateRangeLabel: `${formatDate(period.start)} al ${formatDate(period.end)}`,
    days: price.days === 1 ? '1 día' : `${price.days} días`,
    subtotal: formatCOP(price.subtotal),
    discountLabel: price.discountPercentage > 0 ? `${price.discountPercentage} % de descuento` : null,
    total: formatCOP(price.total),
  };
}
