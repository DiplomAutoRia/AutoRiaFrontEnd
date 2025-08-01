import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface Vehicle {
  id: string;
  title: string;
  price: number;
  year: number;
  mileage: number;
  brand: string;
  fuel: string;
  transmission: string;
  location: string;
  image: string;
}

interface VehiclesState {
  vehicles: Vehicle[];
}

const storedVehicles = localStorage.getItem('vehicles');
const initialState: VehiclesState = {
  vehicles: storedVehicles ? JSON.parse(storedVehicles) : [],
};

const vehiclesSlice = createSlice({
  name: 'vehicles',
  initialState,
  reducers: {
    addVehicle: (state, action: PayloadAction<Vehicle>) => {
      const newVehicles = [...state.vehicles, action.payload];
      localStorage.setItem('vehicles', JSON.stringify(newVehicles));
      return {
        ...state,
        vehicles: newVehicles
      };
    },
  },
});

export const { addVehicle } = vehiclesSlice.actions;
export default vehiclesSlice.reducer;
