export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email?: string;
  phone_number?: string;
  is_verified: boolean;
}

export interface LoginResponse {
  access: string;
  refresh: string;
  user_id: number;
  first_name: string;
  last_name: string;
  email: string;
}

export interface RegisterInitialResponse {
  message: string;
  detail?: string;
}

export interface RegisterVerifyResponse {
  message: string;
  detail?: string;
}

export interface RegisterCompleteResponse {
  access: string;
  refresh: string;
  user: User;
}

export interface GoogleAuthRequest {
  access_token: string;
}

export interface GoogleAuthResponse {
  access: string;
  refresh: string;
  user: User;
}

export interface LoginFormData {
  contact_info: string;
  password: string;
}

export interface RegisterInitialFormData {
  first_name: string;
  last_name: string;
  contact_info: {
    type: 'email' | 'phone';
    value: string;
  };
}

export interface RegisterVerifyFormData {
  contact_info: string;
  code: string;
}

export interface RegisterCompleteFormData {
  contact_info: string;
  password: string;
  password_confirm: string;
}

export interface AuthState {
  loading: boolean;
  error: string | null;
  user: User | null;
  registerStep: 'initial' | 'verify' | 'complete' | 'done';
  contactInfo: { type: 'email' | 'phone'; value: string } | null;
  successMessage: string | null;
}

export interface LoginUserPayload {
  contact_info: string;
  password: string;
}

export interface InitialRegisterPayload {
  first_name: string;
  last_name: string;
  contact_info: { type: 'email' | 'phone'; value: string };
}

export interface VerifyRegisterPayload {
  contact_info: string;
  code: string;
}

export interface CompleteRegisterPayload {
  contact_info: string;
  password: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}
