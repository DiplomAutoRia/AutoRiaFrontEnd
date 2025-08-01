import { configureStore } from '@reduxjs/toolkit';
import vehiclesReducer from './redux/vehicles/vehiclesSlice';

export const store = configureStore({
  reducer: {
    vehicles: vehiclesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
