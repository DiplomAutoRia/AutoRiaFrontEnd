export interface ApiError {
  message: string;
  status?: number;
  data?: Record<string, unknown>;
}

export interface ApiResponse<T = unknown> {
  data: T;
  status: number;
  message?: string;
}

export interface RTKQueryError {
  status: number;
  data: {
    message?: string;
    detail?: string;
    errors?: Record<string, string[]>;
  };
}

export interface FormError {
  message: string;
  field?: string;
}

export interface ApiListResponse<T> {
  count: number;
  next?: string | null;
  previous?: string | null;
  results: T[];
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface AuthTokenResponse {
  access: string;
  refresh: string;
}

export interface RegisterResponse {
  message: string;
  user?: {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
  };
}

export interface VerificationResponse {
  message: string;
  success: boolean;
}
