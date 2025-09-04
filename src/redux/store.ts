import { useDispatch, useSelector } from 'react-redux';

import { combineReducers, configureStore } from '@reduxjs/toolkit';
import type { Middleware } from '@reduxjs/toolkit';

import { apiSlice } from './api/apiSlice';
import authReducer from './auth/authSlice';

const rootReducer = combineReducers({
  [apiSlice.reducerPath]: apiSlice.reducer,
  auth: authReducer,
});

const authMiddleware: Middleware = (store) => (next) => (action: any) => {
  if (
    action.type === 'auth/logout' ||
    action.type === 'auth/loginUser/fulfilled' ||
    action.type === 'auth/completeRegister/fulfilled' ||
    action.type === 'auth/googleAuth/fulfilled'
  ) {
    store.dispatch(apiSlice.util.resetApiState());
  }
  return next(action);
};

export function setupStore(preloadedState?: Partial<RootState>) {
  return configureStore({
    reducer: rootReducer,
    devTools: true,
    preloadedState,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(apiSlice.middleware, authMiddleware),
  });
}

export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = AppStore['dispatch'];

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
