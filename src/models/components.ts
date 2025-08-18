import type { ReactNode } from 'react';

import type { SxProps, Theme } from '@mui/material';

export interface BaseComponentProps {
  className?: string;
  sx?: SxProps<Theme>;
  children?: ReactNode;
}

export interface LoadingState {
  isLoading: boolean;
  error?: string | null;
}

export interface PaginationProps {
  currentPage: number;
  totalCount: number;
  pageSize: number;
  onPageChange: (_page: number) => void;
}

export interface ModalProps extends BaseComponentProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  fullWidth?: boolean;
}

export type ButtonVariant = 'text' | 'outlined' | 'contained';
export type ButtonColor = 'inherit' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning';
export type ButtonSize = 'small' | 'medium' | 'large';

export interface InputProps extends BaseComponentProps {
  label?: string;
  placeholder?: string;
  value?: string | number;
  onChange?: (_value: string | number) => void;
  error?: boolean;
  helperText?: string;
  disabled?: boolean;
  required?: boolean;
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';
}

export interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends BaseComponentProps {
  label?: string;
  value?: string | number;
  onChange?: (_value: string | number) => void;
  options: SelectOption[];
  error?: boolean;
  helperText?: string;
  disabled?: boolean;
  required?: boolean;
  multiple?: boolean;
}

export interface FileUploadProps extends BaseComponentProps {
  accept?: string;
  multiple?: boolean;
  maxSize?: number;
  onUpload: (_files: File[]) => void;
  onError?: (_error: string) => void;
  disabled?: boolean;
}

export interface CardProps extends BaseComponentProps {
  title?: string;
  subtitle?: string;
  actions?: ReactNode;
  elevation?: number;
}

export interface NavigationItem {
  label: string;
  path: string;
  icon?: ReactNode;
  children?: NavigationItem[];
  requiresAuth?: boolean;
}

export interface SearchProps {
  query: string;
  onQueryChange: (_query: string) => void;
  onSearch: () => void;
  placeholder?: string;
  disabled?: boolean;
}
