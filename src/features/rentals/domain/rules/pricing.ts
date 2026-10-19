import { Money } from '@/shared/domain/value-objects/money'
import {STANDARD_DISCOUNT, type DiscountPolicy} from '../value-objects/discount-policy'; 
import type {DateRange} from '@/shared/domain/value-objects/date-range';

export interface RentalPrice {
    days: number; 
    subtotal: Money; 
    discountPercentage: number;
    total: Money;
}

export function calculatePrice(
    period: DateRange,
    dailyRate: Money, 
    policy: DiscountPolicy = STANDARD_DISCOUNT
): RentalPrice {
    throw new Error("TODO: not implemented");
}