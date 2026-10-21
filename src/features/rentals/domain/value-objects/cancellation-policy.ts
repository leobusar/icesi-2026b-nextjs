export interface CancellationPolicy {
    readonly minHoursBeforeStart: number;
};

export const STANDARD_CANCELLATION: CancellationPolicy = {minHoursBeforeStart: 24};