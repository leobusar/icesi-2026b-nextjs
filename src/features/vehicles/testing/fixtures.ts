import { Money } from '@/shared/domain/value-objects/money';
import type { Vehicle } from '../domain/entities/vehicle';
import { Plate } from '../domain/value-objects/plate';

export function aVehicle(
  overrides: {
    id?: number;
    plate?: string;
    brand?: string;
    model?: string;
    year?: number;
    category?: string;
    dailyRate?: number;
  } = {},
): Vehicle {
  return {
    id: overrides.id ?? 1,
    plate: Plate.create(overrides.plate ?? 'KLM482'),
    brand: overrides.brand ?? 'Mazda',
    model: overrides.model ?? 'CX-30',
    year: overrides.year ?? 2024,
    category: overrides.category ?? 'SUV',
    dailyRate: Money.cop(overrides.dailyRate ?? 150_000),
  };
}
