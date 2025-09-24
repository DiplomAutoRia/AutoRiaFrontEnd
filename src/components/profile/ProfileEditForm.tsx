import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { zodResolver } from '@hookform/resolvers/zod';
import { Alert, Box, Button, TextField } from '@mui/material';

import { profileSchema } from '../../common/utils/zod-validation';
import type { User } from '../../models/auth';

type ProfileEditFormData = {
  first_name: string;
  last_name: string;
  email?: string;
  phone_number?: string;
  location?: string;
};

interface ProfileEditFormProps {
  user?: User | null;
  onSubmit?: (_data: ProfileEditFormData) => void;
  onCancel?: () => void;
  onSuccess?: () => void;
}

const ProfileEditForm: React.FC<ProfileEditFormProps> = ({ user, onSubmit, onCancel, onSuccess }) => {
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProfileEditFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      first_name: user?.first_name || '',
      last_name: user?.last_name || '',
      email: user?.email || '',
      phone_number: user?.phone_number || '',
    },
  });

  const handleFormSubmit = async (data: ProfileEditFormData) => {
    setIsSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      if (onSubmit) {
        await onSubmit(data);
      } else {
      }
      setSuccess(true);
      setTimeout(() => {
        onSuccess?.();
      }, 1500);
    } catch {
      setError(t('profile.errors.updateFailed'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    reset();
    if (onCancel) {
      onCancel();
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit(handleFormSubmit)} sx={{ mt: 1 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {t('profile.success.profileUpdated')}
        </Alert>
      )}

      <TextField
        {...register('first_name')}
        margin="normal"
        required
        fullWidth
        label={t('profile.firstName')}
        error={!!errors.first_name}
        helperText={errors.first_name?.message}
        disabled={isSubmitting}
      />

      <TextField
        {...register('last_name')}
        margin="normal"
        required
        fullWidth
        label={t('profile.lastName')}
        error={!!errors.last_name}
        helperText={errors.last_name?.message}
        disabled={isSubmitting}
      />

      <TextField
        {...register('email')}
        margin="normal"
        fullWidth
        label="Email"
        type="email"
        error={!!errors.email}
        helperText={errors.email?.message}
        disabled={isSubmitting}
      />

      <TextField
        {...register('phone_number')}
        margin="normal"
        fullWidth
        label={t('profile.phone')}
        type="tel"
        error={!!errors.phone_number}
        helperText={errors.phone_number?.message}
        disabled={isSubmitting}
      />

      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
        <Button onClick={handleCancel} disabled={isSubmitting}>
          {t('common.cancel')}
        </Button>
        <Button type="submit" variant="contained" disabled={isSubmitting}>
          {isSubmitting ? t('common.loading') : t('profile.saveChanges')}
        </Button>
      </Box>
    </Box>
  );
};

export default ProfileEditForm;
