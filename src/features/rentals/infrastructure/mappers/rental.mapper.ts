import { DateRange } from '@/shared/domain/value-objects/date-range';
import { Money } from '@/shared/domain/value-objects/money';
import type { NewRental } from '../../application/repositories/rental-repository';
import type { Rental } from '../../domain/entities/rental';
import type { CreateRentalDto } from '../dtos/create-rental.dto';
import type { RentalDto } from '../dtos/rental.dto';

export function toRental(dto: RentalDto): Rental {
  return {
    id: dto.id,
    vehicle: { brand: dto.brand_name, model: dto.model },
    period: DateRange.create(new Date(dto.start_date), new Date(dto.end_date)),
    dailyRate: Money.cop(dto.daily_rate),
  };
}

/** Traduce el dominio a JSON, en el otro sentido: para crear una reserva. */
export function toCreateRentalDto(newRental: NewRental): CreateRentalDto {
  return {
    vehicle_id: newRental.vehicleId,
    start_date: newRental.period.start.toISOString(),
    end_date: newRental.period.end.toISOString(),
  };
}
