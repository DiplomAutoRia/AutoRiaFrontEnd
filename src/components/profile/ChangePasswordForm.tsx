import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Alert, Box, Button, TextField, Typography } from '@mui/material';
import { useChangePasswordMutation } from '../../redux/api/authApi';

const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Поточний пароль обов\'язковий'),
    newPassword: z
      .string()
      .min(8, 'Новий пароль повинен містити принаймні 8 символів')
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Пароль повинен містити принаймні одну велику літеру, одну малу літеру та одну цифру'),
    confirmPassword: z.string().min(1, 'Підтвердження пароля обов\'язкове'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Паролі не співпадають',
    path: ['confirmPassword'],
  });

type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;

interface ChangePasswordFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

const ChangePasswordForm: React.FC<ChangePasswordFormProps> = ({ onSuccess, onCancel }) => {
  const [changePassword, { isLoading, error }] = useChangePasswordMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
  });

  const onSubmit = async (data: ChangePasswordFormData) => {
    try {
      await changePassword({
        current_password: data.currentPassword,
        new_password: data.newPassword,
      }).unwrap();
      
      reset();
      onSuccess?.();
    } catch (err) {
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 1 }}>
      <Typography variant="h6" component="h2" gutterBottom>
        Змінити пароль
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {'data' in error && typeof error.data === 'object' && error.data && 'message' in error.data
            ? String(error.data.message)
            : 'Помилка при зміні пароля'}
        </Alert>
      )}

      <TextField
        {...register('currentPassword')}
        margin="normal"
        required
        fullWidth
        label="Поточний пароль"
        type="password"
        autoComplete="current-password"
        error={!!errors.currentPassword}
        helperText={errors.currentPassword?.message}
      />

      <TextField
        {...register('newPassword')}
        margin="normal"
        required
        fullWidth
        label="Новий пароль"
        type="password"
        autoComplete="new-password"
        error={!!errors.newPassword}
        helperText={errors.newPassword?.message}
      />

      <TextField
        {...register('confirmPassword')}
        margin="normal"
        required
        fullWidth
        label="Підтвердити новий пароль"
        type="password"
        autoComplete="new-password"
        error={!!errors.confirmPassword}
        helperText={errors.confirmPassword?.message}
      />

      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
        <Button
          onClick={onCancel}
          disabled={isLoading}
        >
          Скасувати
        </Button>
        <Button
          type="submit"
          variant="contained"
          disabled={isLoading}
        >
          {isLoading ? 'Змінюємо...' : 'Змінити пароль'}
        </Button>
      </Box>
    </Box>
  );
};

export default ChangePasswordForm;