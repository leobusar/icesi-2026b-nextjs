import { DiscountPolicy, STANDARD_DISCOUNT } from "../../domain/value-objects/discount-policy";
import { RentalRepository } from "../repositories/rental-repository";
import { CancellationPolicy, STANDARD_CANCELLATION } from "../../domain/value-objects/cancellation-policy";
import { calculatePrice } from "../../domain/rules/pricing";
import { canCancel } from "../../domain/rules/cancellation";

interface Deps {
    rentals: RentalRepository, 
    discountPolicy?: DiscountPolicy, 
    cancellationPolicy?: CancellationPolicy
}

export function  makeListMyRentals({
    rentals, 
    discountPolicy = STANDARD_DISCOUNT, 
    cancellationPolicy = STANDARD_CANCELLATION
}: Deps) {
  return async () => {
    const now = new Date();
    const mine = await rentals.findMine();
    return mine.map((rental=>({
        rental, 
        price: calculatePrice(rental.period, rental.dailyRate, discountPolicy), 
        canCancel: canCancel(rental, now, cancellationPolicy)
    })))
  }  
}