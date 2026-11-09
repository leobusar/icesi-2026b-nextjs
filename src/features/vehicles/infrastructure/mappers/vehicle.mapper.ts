import { Money } from '@/shared/domain/value-objects/money';
import type { Vehicle } from '../../domain/entities/vehicle';
import { Plate } from '../../domain/value-objects/plate';
import type { VehicleDto } from '../dtos/vehicle.dto';

export function toVehicle(dto: VehicleDto): Vehicle {
  return {
    id: Number(dto.id),
    plate: Plate.create(dto.plate),
    brand: dto.brand,
    model: dto.model,
    year: dto.year,
    category: dto.category,
    dailyRate: Money.cop(dto.dailyRate),
  };
}
