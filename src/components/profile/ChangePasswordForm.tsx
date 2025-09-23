import React from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { zodResolver } from '@hookform/resolvers/zod';
import { Alert, Box, Button, TextField, Typography } from '@mui/material';

import { changePasswordSchema } from '../../common/utils/zod-validation';
import { useChangePasswordMutation } from '../../redux/api/authApi';

type ChangePasswordFormData = {
  current_password: string;
  new_password: string;
  confirm_password: string;
};

interface ChangePasswordFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

const ChangePasswordForm: React.FC<ChangePasswordFormProps> = ({ onSuccess, onCancel }) => {
  const { t } = useTranslation();
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
        current_password: data.current_password,
        new_password: data.new_password,
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
        {...register('current_password')}
        margin="normal"
        required
        fullWidth
        label={t('profile.currentPassword')}
        type="password"
        autoComplete="current-password"
        error={!!errors.current_password}
        helperText={errors.current_password?.message}
      />

      <TextField
        {...register('new_password')}
        margin="normal"
        required
        fullWidth
        label={t('profile.newPassword')}
        type="password"
        autoComplete="new-password"
        error={!!errors.new_password}
        helperText={errors.new_password?.message}
      />

      <TextField
        {...register('confirm_password')}
        margin="normal"
        required
        fullWidth
        label={t('profile.confirmNewPassword')}
        type="password"
        autoComplete="new-password"
        error={!!errors.confirm_password}
        helperText={errors.confirm_password?.message}
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
