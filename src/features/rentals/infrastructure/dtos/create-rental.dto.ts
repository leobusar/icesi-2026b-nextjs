/** Forma EXACTA del JSON que espera POST /rentals. */
export interface CreateRentalDto {
  vehicle_id: number;
  start_date: string;
  end_date: string;
}
