export class DateRange {
    private constructor (
        readonly start: Date, 
        readonly end: Date
    ) {}

    static create(start: Date, end: Date): DateRange {
        throw new Error("TODO: not implemented");    
    }

    days(): number {
        throw new Error("TODO: not implemented");    
    }

    hoursUntilStart(now: Date): number {
        throw new Error("TODO: not implemented");    
    }

    equals(other: DateRange): boolean {
        throw new Error("TODO: not implemented");    
    }


}