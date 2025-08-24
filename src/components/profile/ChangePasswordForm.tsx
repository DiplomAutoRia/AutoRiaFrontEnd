import React from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { zodResolver } from '@hookform/resolvers/zod';
import { Alert, Box, Button, TextField, Typography } from '@mui/material';
import { z } from 'zod';

import { useChangePasswordMutation } from '../../redux/api/authApi';

type ChangePasswordFormData = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

interface ChangePasswordFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

const ChangePasswordForm: React.FC<ChangePasswordFormProps> = ({ onSuccess, onCancel }) => {
  const { t } = useTranslation();
  const [changePassword, { isLoading, error }] = useChangePasswordMutation();

  const changePasswordSchema = z
    .object({
      currentPassword: z.string().min(1, t('profile.validation.currentPasswordRequired')),
      newPassword: z
        .string()
        .min(8, t('profile.validation.newPasswordMin'))
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, t('profile.validation.passwordComplexity')),
      confirmPassword: z.string().min(1, t('profile.validation.confirmPasswordRequired')),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: t('profile.validation.passwordsDontMatch'),
      path: ['confirmPassword'],
    });

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
    } catch {}
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 1 }}>
      <Typography variant="h6" component="h2" gutterBottom>
        {t('profile.changePassword')}
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {'data' in error && typeof error.data === 'object' && error.data && 'message' in error.data
            ? String(error.data.message)
            : t('profile.errors.changePasswordFailed')}
        </Alert>
      )}

      <TextField
        {...register('currentPassword')}
        margin="normal"
        required
        fullWidth
        label={t('profile.currentPassword')}
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
        label={t('profile.newPassword')}
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
        label={t('profile.confirmNewPassword')}
        type="password"
        autoComplete="new-password"
        error={!!errors.confirmPassword}
        helperText={errors.confirmPassword?.message}
      />

      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
        <Button onClick={onCancel} disabled={isLoading}>
          {t('common.cancel')}
        </Button>
        <Button type="submit" variant="contained" disabled={isLoading}>
          {isLoading ? t('common.loading') : t('profile.updatePassword')}
        </Button>
      </Box>
    </Box>
  );
};

export default ChangePasswordForm;
