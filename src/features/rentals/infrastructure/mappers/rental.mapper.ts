import { DateRange } from '@/shared/domain/value-objects/date-range';
import { Money } from '@/shared/domain/value-objects/money';
import type { Rental } from '../../domain/entities/rental';
import type { RentalDto } from '../dtos/rental.dto';

export function toRental(dto: RentalDto): Rental {
  return {
    id: dto.id,
    vehicle: { brand: dto.brand_name, model: dto.model },
    period: DateRange.create(new Date(dto.start_date), new Date(dto.end_date)),
    dailyRate: Money.cop(dto.daily_rate),
  };
}
