import type { FieldError } from 'react-hook-form';

export type FormFieldValue = string | number | boolean | File[] | undefined;

export interface FormState<T = Record<string, FormFieldValue>> {
  values: T;
  errors: Record<keyof T, FieldError | undefined>;
  isSubmitting: boolean;
  isValid: boolean;
  isDirty: boolean;
}

export type FormSubmitHandler<T> = (_data: T) => void | Promise<void>;
export type FormChangeHandler<T> = (_field: keyof T, _value: FormFieldValue) => void;
export type FormValidateHandler<T> = (_data: T) => Record<keyof T, string | undefined>;

export interface RegisterFormData {
  email: string;
  password: string;
  password_confirm: string;
  first_name: string;
  last_name: string;
}

export interface ProfileFormData {
  first_name: string;
  last_name: string;
  phone?: string;
  location?: string;
}

export interface PasswordChangeFormData {
  old_password: string;
  new_password: string;
  confirm_password: string;
}

export interface BaseFormProps<T> {
  onSubmit: FormSubmitHandler<T>;
  onCancel?: () => void;
  isLoading?: boolean;
  initialValues?: Partial<T>;
  className?: string;
}
