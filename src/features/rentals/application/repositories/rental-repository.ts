import { Rental } from "../../domain/entities/rental";

export interface RentalRepository {
    findMine(): Promise<Rental[]>; 
    cancel(rentalId: number): Promise<void>;
}