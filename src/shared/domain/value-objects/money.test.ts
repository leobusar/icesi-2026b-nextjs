import { describe, expect, it } from 'vitest';
import { InvalidMoneyError, Money } from './money';

describe('Money', () => {
  it('rechaza montos negativos', () => {
    expect(() => Money.cop(-1)).toThrow(InvalidMoneyError);
  });

  it('rechaza centavos', () => {
    expect(() => Money.cop(1500.5)).toThrow(InvalidMoneyError);
  });

  it('acepta cero', () => {
    expect(Money.cop(0).equals(Money.zero())).toBe(true);
  });

  it('multiplica sin modificar el original', () => {
    const rate = Money.cop(150_000);
    expect(rate.times(7).amount).toBe(1_050_000);
    expect(rate.amount).toBe(150_000);
  });

  it('aplica un descuento porcentual', () => {
    expect(Money.cop(1_050_000).withDiscount(10).amount).toBe(945_000);
  });

  it('redondea al peso más cercano', () => {
    expect(Money.cop(85_005).withDiscount(10).amount).toBe(76_505);
  });
});
