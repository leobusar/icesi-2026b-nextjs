import { describe, expect, it } from 'vitest';
import { InvalidPlateError, Plate } from './plate';

describe('Plate', () => {
  it('acepta el formato ABC123', () => {
    expect(Plate.create('ABC123').value).toBe('ABC123');
  });

  it.each(['AB1234', 'abc123', 'ABC12', 'ABCDEF', '123ABC'])('rechaza %s', (value) => {
    expect(() => Plate.create(value)).toThrow(InvalidPlateError);
  });

  it('se muestra con guion, como en el código legado', () => {
    expect(Plate.create('KLM482').toString()).toBe('KLM-482');
  });

  it('compara por valor', () => {
    expect(Plate.create('ABC123').equals(Plate.create('ABC123'))).toBe(true);
    expect(Plate.create('ABC123').equals(Plate.create('XYZ999'))).toBe(false);
  });
});
