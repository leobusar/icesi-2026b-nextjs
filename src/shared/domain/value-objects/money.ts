import { DomainError } from '../errors/domain-error';

export class InvalidMoneyError extends DomainError {}

export class Money {
    private constructor(readonly amount: number) {}

    static cop(amount: number): Money {
        if (!Number.isInteger(amount)) {
        throw new InvalidMoneyError(`El monto debe ser un número entero de pesos: ${amount}`);
        }
        if (amount < 0) {
        throw new InvalidMoneyError(`El monto no puede ser negativo: ${amount}`);
        }
        return new Money(amount);
    }

    static zero(): Money {
        return new Money(0);
    }

    withDiscount(percentage: number): Money {
        return Money.cop(Math.round((this.amount * (100 - percentage)) / 100));    
    }

    times(factor: number): Money {
        return Money.cop(Math.round(this.amount * factor));
    }

    equals(other: Money): boolean {
        return this.amount === other.amount;
    }
}