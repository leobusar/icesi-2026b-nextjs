import { describe, expect, it } from 'vitest';
import { DateRange, InvalidDateRangeError } from './date-range';

const d = (iso: string) => new Date(iso);

describe('DateRange', () => {
  describe('create', () => {
    it('rechaza un periodo cuyo fin es igual al inicio', () => {
      expect(() => DateRange.create(d('2026-11-03T10:00:00Z'), d('2026-11-03T10:00:00Z'))).toThrow(
        InvalidDateRangeError,
      );
    });

    it('rechaza un periodo cuyo fin es anterior al inicio', () => {
      expect(() => DateRange.create(d('2026-11-05T10:00:00Z'), d('2026-11-03T10:00:00Z'))).toThrow(
        InvalidDateRangeError,
      );
    });

    it('rechaza fechas inválidas', () => {
      expect(() => DateRange.create(d('no-es-fecha'), d('2026-11-03T10:00:00Z'))).toThrow(InvalidDateRangeError);
    });

    it('no se ve afectado si se modifica la fecha original', () => {
      const start = d('2026-11-03T10:00:00Z');
      const range = DateRange.create(start, d('2026-11-05T10:00:00Z'));
      start.setFullYear(2030);
      expect(range.start.toISOString()).toBe('2026-11-03T10:00:00.000Z');
    });
  });

  describe('days', () => {
    it.each([
      ['2026-11-05T10:00:00Z', 2], // 48 h
      ['2026-11-05T11:00:00Z', 3], // 49 h: la hora extra cuenta como un día
      ['2026-11-03T18:00:00Z', 1], // 8 h
    ])('desde el 3 nov 10:00 hasta %s son %i días', (end, expected) => {
      expect(DateRange.create(d('2026-11-03T10:00:00Z'), d(end)).days()).toBe(expected);
    });
  });

  describe('hoursUntilStart', () => {
    const range = DateRange.create(d('2026-11-03T12:00:00Z'), d('2026-11-05T12:00:00Z'));

    it('cuenta las horas que faltan para el inicio', () => {
      expect(range.hoursUntilStart(d('2026-11-02T10:00:00Z'))).toBe(26);
    });

    it('es negativo si el periodo ya empezó', () => {
      expect(range.hoursUntilStart(d('2026-11-04T12:00:00Z'))).toBeLessThan(0);
    });
  });
});
