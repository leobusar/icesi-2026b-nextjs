export interface RentalDto {
  id: number;
  vehicle_id: number;
  plate: string;
  brand_name: string;
  model: string;
  category: string;
  start_date: string;
  end_date: string;
  daily_rate: number;
}
