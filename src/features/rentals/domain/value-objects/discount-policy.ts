export interface DiscountPolicy {
    readonly minDays: number;
    readonly percentage: number; 
}

export const STANDARD_DISCOUNT: DiscountPolicy =  {minDays: 7, percentage: 10};