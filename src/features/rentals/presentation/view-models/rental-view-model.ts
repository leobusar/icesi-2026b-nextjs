import { formatCOP } from '@/shared/ui/format-cop';
import { formatDate } from '@/shared/ui/format-date';
import type { RentalSummary } from '../../application/use-cases/list-my-rentals';

/** Todo en texto, listo para pintar. El componente no calcula nada. */
export interface RentalViewModel {
  id: number;
  vehicle: string;
  startDate: string;
  days: string;
  total: string;
  discount: string | null;
  canCancel: boolean;
}

export function toRentalViewModel({ rental, price, canCancel }: RentalSummary): RentalViewModel {
  return {
    id: rental.id,
    vehicle: `${rental.vehicle.brand} ${rental.vehicle.model}`,
    startDate: formatDate(rental.period.start),
    days: price.days === 1 ? '1 día' : `${price.days} días`,
    total: formatCOP(price.total),
    discount: price.discountPercentage > 0 ? `${price.discountPercentage} % de descuento` : null,
    canCancel,
  };
}
