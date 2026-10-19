export class Money {
    private constructor(readonly amount: number) {}

    static cop(amount: number): Money {
        throw new Error("TODO: not implemented");    
    }

    static zero(): Money {
        throw new Error("TODO: not implemented");    
    }

    withDiscount(percentage: number): Money {
        throw new Error("TODO: not implemented");    
    }
    
    equals(other: Money): boolean {
        throw new Error("TODO: not implemented");    
    }
}