export interface CancellationPolicy {
    readonly minHoursBeforeStart: number;
}

const STANDARD_CANCELLATION: CancellationPolicy = {minHoursBeforeStart: 24};