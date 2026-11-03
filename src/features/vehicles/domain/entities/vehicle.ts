import type { Money } from '@/shared/domain/value-objects/money';
import type { Plate } from '../value-objects/plate';

/** Un carro del catálogo. No tiene reglas propias: es solo sus datos. */
export interface Vehicle {
  readonly id: number;
  readonly plate: Plate;
  readonly brand: string;
  readonly model: string;
  readonly year: number;
  readonly category: string;
  readonly dailyRate: Money;
}
