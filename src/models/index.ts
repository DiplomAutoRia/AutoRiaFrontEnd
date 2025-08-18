export * from './api';
export * from './auth';
export * from './brands';
export * from './components';
export * from './form';
export * from './vehicle';
export * from './favorite';

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredBy<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;

export type ID = string | number;

export type LoadingStatus = 'idle' | 'loading' | 'succeeded' | 'failed';
export type RequestStatus = 'pending' | 'fulfilled' | 'rejected';

export interface ApiResponseWrapper<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface ListResponse<T> {
  results: T[];
  count: number;
  next?: string | null;
  previous?: string | null;
}

export interface BaseFilter {
  page?: number;
  limit?: number;
  search?: string;
  ordering?: string;
}

export type EventHandler<T = Element> = (_event: React.SyntheticEvent<T>) => void;
export type ChangeHandler<T = HTMLInputElement> = (_event: React.ChangeEvent<T>) => void;
export type ClickHandler<T = HTMLButtonElement> = (_event: React.MouseEvent<T>) => void;
export type FormSubmitHandler<T = HTMLFormElement> = (_event: React.FormEvent<T>) => void;

export type AsyncFunction<T = void> = () => Promise<T>;
export type AsyncFunctionWithParams<P, T = void> = (_params: P) => Promise<T>;

export type PropsWithChildren<P = {}> = P & { children?: React.ReactNode };
export type ComponentWithProps<P = {}> = React.FC<PropsWithChildren<P>>;

export type AppThunk<ReturnType = void> = (
  _dispatch: import('../redux/store').AppDispatch,
  _getState: () => import('../redux/store').RootState,
) => ReturnType;

export interface RouteConfig {
  path: string;
  component: React.ComponentType;
  exact?: boolean;
  private?: boolean;
}
