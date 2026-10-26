import { DiscountPolicy, STANDARD_DISCOUNT } from "../../domain/value-objects/discount-policy";
import { RentalRepository } from "../repositories/rental-repository";
import { CancellationPolicy, STANDARD_CANCELLATION } from "../../domain/value-objects/cancellation-policy";
import { calculatePrice, RentalPrice } from "../../domain/rules/pricing";
import { canCancel } from "../../domain/rules/cancellation";
import { Clock } from "@/shared/domain/clock";
import { Rental } from "../../domain/entities/rental";

/** Lo que la pantalla necesita saber de cada alquiler, ya calculado. */
export interface RentalSummary {
  readonly rental: Rental;
  readonly price: RentalPrice;
  readonly canCancel: boolean;
}

export type ListMyRentals = () => Promise<RentalSummary[]>;

interface Deps {
    rentals: RentalRepository, 
    clock: Clock,
    discountPolicy?: DiscountPolicy, 
    cancellationPolicy?: CancellationPolicy
}

/**
 * Caso de uso: listar los alquileres del cliente con su precio
 * y si todavía se pueden cancelar.
 */
export function  makeListMyRentals({
    rentals,
    clock,
    discountPolicy = STANDARD_DISCOUNT, 
    cancellationPolicy = STANDARD_CANCELLATION
}: Deps): ListMyRentals  {
  return async () => {
    const now = clock.now();
    const mine = await rentals.findMine();
    return mine.map((rental=>({
        rental, 
        price: calculatePrice(rental.period, rental.dailyRate, discountPolicy), 
        canCancel: canCancel(rental, now, cancellationPolicy)
    })))
  }  
}