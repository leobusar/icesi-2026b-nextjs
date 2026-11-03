import { DomainError } from '@/shared/domain/errors/domain-error';

export class InvalidPlateError extends DomainError {}

const PLATE_RE = /^[A-Z]{3}\d{3}$/;

/** Placa colombiana de vehículo particular: tres letras y tres números, como ABC123. */
export class Plate {
  private constructor(readonly value: string) {}

  static create(value: string): Plate {
    if (!PLATE_RE.test(value)) {
      throw new InvalidPlateError(`La placa no tiene el formato esperado (ABC123): ${value}`);
    }
    return new Plate(value);
  }

  /** KLM482 → KLM-482, como ya se mostraba en VehicleList.tsx. */
  toString(): string {
    return `${this.value.slice(0, 3)}-${this.value.slice(3)}`;
  }

  equals(other: Plate): boolean {
    return this.value === other.value;
  }
}
