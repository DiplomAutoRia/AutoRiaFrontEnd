import { combineReducers, configureStore } from '@reduxjs/toolkit';

import { apiSlice } from './api/apiSlice';
import authReducer from './auth/authSlice';
import vehiclesReducer from './vehicles/vehiclesSlice';

const rootReducer = combineReducers({
  vehicles: vehiclesReducer,
  [apiSlice.reducerPath]: apiSlice.reducer,
  auth: authReducer,
});

export function setupStore(preloadedState?: Partial<RootState>) {
  return configureStore({
    reducer: rootReducer,
    devTools: true,
    preloadedState,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(apiSlice.middleware),
  });
}

export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = AppStore['dispatch'];
