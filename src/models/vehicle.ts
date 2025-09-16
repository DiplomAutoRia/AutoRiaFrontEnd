export interface Vehicle {
  id: number;
  user: number;
  brand: string;
  model: string;
  year: number;
  price: number;
  currency: CurrencyType;
  description: string;
  location: string;
  mileage?: number;
  color?: ColorType;
  engine_volume?: number;
  engine_power?: number;
  fuel_type?: FuelType;
  transmission?: TransmissionType;
  registration_country?: string;
  is_custom_cleared?: boolean;
  vin_code?: string;
  number_of_owners?: number;
  is_new?: boolean;
  plate_number?: string;
  is_active: boolean;
  views_count: number;
  created_at: string;
  updated_at: string;
  images: VehicleImage[];
  vehicle_type: VehicleType;
  body_type?: CarBodyType;
  drive_type?: DriveType;
  technical_condition?: TechnicalCondition;
  bike_type?: MotorcycleType;
  seat_height?: number;
  truck_load_capacity?: number;
  axle_count?: number;
  trailer_type?: TrailerType;
  trailer_load_capacity?: number;
  specialization?: string;
  weight?: number;
  seats?: number;
  doors_count?: number;
  boat_type?: BoatType;
  engine_type?: EngineType;
  hull_material?: HullMaterial;
  aircraft_type?: AircraftType;
  engine_count?: number;
  max_altitude?: number;
  sleeping_places?: number;
  has_kitchen?: boolean;
  has_bathroom?: boolean;
}

export interface VehicleImage {
  id: number;
  image: string;
  vehicle: number;
  uploaded_at: string;
}

export interface VehicleCreateRequest {
  vehicle_type: VehicleType;
  brand: string;
  model: string;
  year: number;
  price: number;
  currency: CurrencyType;
  description: string;
  location?: string;
  mileage?: number;
  color?: ColorType;
  engine_volume?: number;
  engine_power?: number;
  fuel_type?: FuelType;
  transmission?: TransmissionType;
  registration_country?: string;
  is_custom_cleared?: boolean;
  vin_code?: string;
  number_of_owners?: number;
  is_new?: boolean;
  plate_number?: string;
  uploaded_images?: File[];
  body_type?: CarBodyType;
  drive_type?: DriveType;
  technical_condition?: TechnicalCondition;
  bike_type?: MotorcycleType;
  seat_height?: number;
  truck_load_capacity?: number;
  axle_count?: number;
  trailer_type?: TrailerType;
  trailer_load_capacity?: number;
  specialization?: string;
  weight?: number;
  seats?: number;
  doors_count?: number;
  boat_type?: BoatType;
  engine_type?: EngineType;
  hull_material?: HullMaterial;
  aircraft_type?: AircraftType;
  engine_count?: number;
  max_altitude?: number;
  sleeping_places?: number;
  has_kitchen?: boolean;
  has_bathroom?: boolean;
}

export interface VehicleListResponse {
  count: number;
  next?: string;
  previous?: string;
  page_size: number;
  results: Vehicle[];
}

export interface VehicleFilters {
  page?: number;
  limit?: number;
  vehicle_type?: VehicleType;
  year_min?: number;
  year_max?: number;
  price_min?: number;
  price_max?: number;
  brand?: string;
  model?: string[];
  fuel_type?: FuelType[];
  transmission?: TransmissionType[];
  color?: ColorType[];
  body_type?: CarBodyType[];
  bike_type?: MotorcycleType[];
  trailer_type?: TrailerType[];
  specialization?: string[];
  seats_min?: number;
  boat_type?: BoatType[];
  aircraft_type?: AircraftType[];
  has_kitchen?: boolean;
  location?: string;
  mileage?: number;
  engine_volume?: number;
  engine_power?: number;
  drive_type?: DriveType;
  currency?: CurrencyType;
  technical_condition?: TechnicalCondition;
  has_bathroom?: boolean;
  is_custom_cleared?: boolean;
}

export const VEHICLE_TYPES = [
  'car',
  'motorcycle',
  'truck',
  'trailer',
  'specialtech',
  'bus',
  'watertransport',
  'airtransport',
  'motorhome',
] as const;

export const FUEL_TYPES = ['petrol', 'diesel', 'electric', 'hybrid', 'gas', 'other'] as const;

export const TRANSMISSION_TYPES = ['manual', 'automatic', 'cvt', 'robotic', 'other'] as const;

export const COLOR_TYPES = ['black', 'white', 'gray', 'red', 'blue', 'green', 'other'] as const;

export type VehicleType = (typeof VEHICLE_TYPES)[number];
export type FuelType = (typeof FUEL_TYPES)[number];
export type TransmissionType = (typeof TRANSMISSION_TYPES)[number];
export type ColorType = (typeof COLOR_TYPES)[number];

export const CURRENCY_TYPES = ['USD', 'EUR', 'UAH'] as const;
export type CurrencyType = (typeof CURRENCY_TYPES)[number];

export const TECHNICAL_CONDITIONS = ['excellent', 'good', 'satisfactory', 'needs_repair', 'not_running'] as const;
export type TechnicalCondition = (typeof TECHNICAL_CONDITIONS)[number];

export const DRIVE_TYPES = ['front', 'rear', 'all', 'full'] as const;
export type DriveType = (typeof DRIVE_TYPES)[number];

export const CAR_BODY_TYPES = [
  'sedan',
  'hatchback',
  'suv',
  'wagon',
  'coupe',
  'convertible',
  'pickup',
  'van',
  'minivan',
] as const;
export type CarBodyType = (typeof CAR_BODY_TYPES)[number];

export const MOTORCYCLE_TYPES = [
  'sportbike',
  'cruiser',
  'touring',
  'standard',
  'dual_sport',
  'dirt_bike',
  'scooter',
] as const;
export type MotorcycleType = (typeof MOTORCYCLE_TYPES)[number];

export const TRAILER_TYPES = ['cargo', 'flatbed', 'enclosed', 'utility', 'boat', 'car_hauler'] as const;
export type TrailerType = (typeof TRAILER_TYPES)[number];

export const BOAT_TYPES = ['motorboat', 'sailboat', 'yacht', 'jet_ski', 'fishing_boat', 'speedboat'] as const;
export type BoatType = (typeof BOAT_TYPES)[number];

export const AIRCRAFT_TYPES = ['airplane', 'helicopter', 'glider', 'ultralight'] as const;
export type AircraftType = (typeof AIRCRAFT_TYPES)[number];

export const ENGINE_TYPES = ['inboard', 'outboard', 'stern_drive', 'jet_drive', 'electric'] as const;
export type EngineType = (typeof ENGINE_TYPES)[number];

export const HULL_MATERIALS = ['fiberglass', 'aluminum', 'wood', 'steel', 'inflatable'] as const;
export type HullMaterial = (typeof HULL_MATERIALS)[number];
