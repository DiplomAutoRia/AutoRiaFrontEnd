import { configureStore } from '@reduxjs/toolkit';
import vehiclesReducer from './redux/vehicles/vehiclesSlice';
import authReducer from './redux/auth/authSlice';

export const store = configureStore({
  reducer: {
    vehicles: vehiclesReducer,
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
