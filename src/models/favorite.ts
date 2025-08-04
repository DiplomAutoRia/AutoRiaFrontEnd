export interface Favorite {
  id: number;
  user: number;
  vehicle: number;
  created_at: string;
}

export interface FavoriteWithVehicle extends Favorite {
  vehicle_details: {
    id: number;
    brand: string;
    model: string;
    year: number;
    price: number;
    currency: string;
    location: string;
    images: Array<{
      id: number;
      image: string;
    }>;
  };
}

export interface FavoriteCreateRequest {
  vehicle: number;
}