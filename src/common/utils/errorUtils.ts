import type { AxiosError } from 'axios';

export interface ErrorResponse {
  message: string;
  detail?: string;
  errors?: Record<string, string[]>;
}

export function isAxiosError(error: unknown): error is AxiosError<ErrorResponse> {
  return (
    typeof error === 'object' &&
    error !== null &&
    'isAxiosError' in error &&
    (error as AxiosError).isAxiosError === true
  );
}

export function getErrorMessage(error: unknown): string {
  if (isAxiosError(error)) {
    const data = error.response?.data;
    if (data?.message) return data.message;
    if (data?.detail) return data.detail;
    if (error.message) return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === 'string') {
    return error;
  }

  return 'Сталася невідома помилка';
}

export function getValidationErrors(error: unknown): Record<string, string> {
  if (isAxiosError(error)) {
    const data = error.response?.data;
    if (data?.errors) {
      const validationErrors: Record<string, string> = {};
      Object.entries(data.errors).forEach(([field, messages]) => {
        if (Array.isArray(messages) && messages.length > 0) {
          validationErrors[field] = messages[0];
        }
      });
      return validationErrors;
    }
  }

  return {};
}

export class AppError extends Error {
  public status?: number;
  public data?: Record<string, unknown>;

  constructor(message: string, status?: number, data?: Record<string, unknown>) {
    super(message);
    this.name = 'AppError';
    this.status = status;
    this.data = data;
  }
}

export function createAppError(error: unknown): AppError {
  if (isAxiosError(error)) {
    return new AppError(
      getErrorMessage(error),
      error.response?.status,
      error.response?.data && typeof error.response.data === 'object'
        ? (error.response.data as unknown as Record<string, unknown>)
        : undefined,
    );
  }

  if (error instanceof AppError) {
    return error;
  }

  return new AppError(getErrorMessage(error));
}
