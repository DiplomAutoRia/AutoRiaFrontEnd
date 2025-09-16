import { configureStore } from '@reduxjs/toolkit';

import authReducer from './redux/auth/authSlice';
import vehiclesReducer from './redux/vehicles/vehiclesSlice';

export const store = configureStore({
  reducer: {
    vehicles: vehiclesReducer,
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
