import type {Rental} from '../entities/rental'; 
import {STANDARD_CANCELLATION, type CancellationPolicy} from '../value-objects/cancellation-policy'; 

export function canCancel (
    rental: Rental, 
    now: Date, 
    policy: CancellationPolicy = STANDARD_CANCELLATION,
): boolean {
    throw new Error("TODO: Not implemented");
}