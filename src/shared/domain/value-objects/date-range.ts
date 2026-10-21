import { DomainError } from '../errors/domain-error';

export class InvalidDateRangeError extends DomainError { }

const HOUR_MS = 60 * 60 * 1000;
const DAY_MS = 24 * HOUR_MS;

export class DateRange {
    private constructor(
        readonly start: Date,
        readonly end: Date,
    ) { }

    static create(start: Date, end: Date): DateRange {
        if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
            throw new InvalidDateRangeError('Las fechas del periodo no son válidas');
        }
        if (end.getTime() <= start.getTime()) {
            throw new InvalidDateRangeError('La fecha de fin debe ser posterior a la de inicio');
        }
        // Copias defensivas: Date es mutable.
        return new DateRange(new Date(start), new Date(end));
    }

    /** Días cobrables: cualquier fracción de día cuenta como un día completo. */
    days(): number {
        return Math.ceil((this.end.getTime() - this.start.getTime()) / DAY_MS);
    }

    /** Horas que faltan para el inicio. Negativo si ya empezó. */
    hoursUntilStart(now: Date): number {
        return (this.start.getTime() - now.getTime()) / HOUR_MS;
    }

    equals(other: DateRange): boolean {
        return this.start.getTime() === other.start.getTime() && this.end.getTime() === other.end.getTime();
    }
}