import type {DateRange} from '@/shared/domain/value-objects/date-range';
import type {Money} from '@/shared/domain/value-objects/money';

export interface Rental {
    readonly id: number; 
    readonly vehicle: {
        readonly brand: string; 
        readonly model: string;
    }
    readonly period: DateRange; 
    readonly dailyRate:  Money;
}