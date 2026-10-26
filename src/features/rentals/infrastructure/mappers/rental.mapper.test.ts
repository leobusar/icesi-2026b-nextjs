import { describe, expect, it } from 'vitest';
import { InvalidDateRangeError } from '@/shared/domain/value-objects/date-range';
import type { RentalDto } from '../dtos/rental.dto';
import { toRental } from './rental.mapper';

const dto: RentalDto = {
  id: 42,
  vehicle_id: 1,
  plate: 'KLM482',
  brand_name: 'Mazda',
  model: 'CX-30',
  category: 'SUV',
  start_date: '2026-11-03T15:00:00.000Z',
  end_date: '2026-11-10T15:00:00.000Z',
  daily_rate: 150000,
};

describe('toRental', () => {
  it('traduce el JSON del backend a la entidad Rental', () => {
    const rental = toRental(dto);
    expect(rental.id).toBe(42);
    expect(rental.vehicle).toEqual({ brand: 'Mazda', model: 'CX-30' });
    expect(rental.period.days()).toBe(7);
    expect(rental.dailyRate.amount).toBe(150_000);
  });

  it('rechaza en el borde un alquiler con fechas al revés', () => {
    expect(() => toRental({ ...dto, end_date: '2026-11-01T15:00:00.000Z' })).toThrow(InvalidDateRangeError);
  });
});
