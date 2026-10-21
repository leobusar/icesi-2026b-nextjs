import { Money } from '@/shared/domain/value-objects/money'
import { STANDARD_DISCOUNT, type DiscountPolicy } from '../value-objects/discount-policy';
import type { DateRange } from '@/shared/domain/value-objects/date-range';

export interface RentalPrice {
    days: number;
    subtotal: Money;
    discountPercentage: number;
    total: Money;
}

export function calculatePrice(
    period: DateRange,
    dailyRate: Money,
    policy: DiscountPolicy = STANDARD_DISCOUNT,
): RentalPrice {
    const days = period.days();
    const subtotal = dailyRate.times(days);
    const discountPercentage = days >= policy.minDays ? policy.percentage : 0;
    return {
        days,
        subtotal,
        discountPercentage,
        total: subtotal.withDiscount(discountPercentage),
    };
}