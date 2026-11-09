import { describe, expect, it } from 'vitest';
import { InvalidPlateError } from '../../domain/value-objects/plate';
import type { VehicleDto } from '../dtos/vehicle.dto';
import { toVehicle } from './vehicle.mapper';

const dto: VehicleDto = {
  id: '1',
  plate: 'KLM482',
  brand: 'Mazda',
  model: 'CX-30',
  year: 2024,
  category: 'SUV',
  dailyRate: 150000,
};

describe('toVehicle', () => {
  it('traduce la respuesta de GraphQL a la entidad Vehicle', () => {
    const vehicle = toVehicle(dto);
    expect(vehicle.id).toBe(1);
    expect(vehicle.plate.toString()).toBe('KLM-482');
    expect(vehicle.brand).toBe('Mazda');
    expect(vehicle.dailyRate.amount).toBe(150_000);
  });

  it('rechaza en el borde una placa con formato inválido', () => {
    expect(() => toVehicle({ ...dto, plate: 'invalida' })).toThrow(InvalidPlateError);
  });
});
