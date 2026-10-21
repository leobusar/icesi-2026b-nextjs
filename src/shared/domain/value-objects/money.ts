import { DomainError } from "../errors/domain-error";

export class InvalidMoneyError extends DomainError {}
export class Money {
    private constructor(readonly amount: number) {}

    static cop(amount: number): Money {
        throw new Error("TODO: not implemented");    
    }

    static zero(): Money {
        throw new Error("TODO: not implemented");    
    }

    static times(factor: number): Money {
        throw new Error("TODO: not implemented");    
    }

    withDiscount(percentage: number): Money {
        throw new Error("TODO: not implemented");    
    }
    
    equals(other: Money): boolean {
        throw new Error("TODO: not implemented");    
    }
}