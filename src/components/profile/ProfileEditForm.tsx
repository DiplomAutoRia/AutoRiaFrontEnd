import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Alert, Box, Button, TextField } from '@mui/material';

import type { User } from '../../models/auth';

const profileEditSchema = z.object({
  first_name: z.string().min(2, "Ім'я повинно містити щонайменше 2 символи"),
  last_name: z.string().min(2, 'Прізвище повинно містити щонайменше 2 символи'),
  email: z.string().email('Невірний формат email').optional().or(z.literal('')),
  phone_number: z.string().optional().or(z.literal('')),
});

type ProfileEditFormData = z.infer<typeof profileEditSchema>;

interface ProfileEditFormProps {
  user?: User | null;
  onSubmit?: (_data: ProfileEditFormData) => void;
  onCancel?: () => void;
  onSuccess?: () => void;
}

const ProfileEditForm: React.FC<ProfileEditFormProps> = ({ user, onSubmit, onCancel, onSuccess }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProfileEditFormData>({
    resolver: zodResolver(profileEditSchema),
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
    } catch (error) {
      setError('Помилка при оновленні профілю. Спробуйте ще раз.');
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
          Профіль успішно оновлено!
        </Alert>
      )}

      <TextField
        {...register('first_name')}
        margin="normal"
        required
        fullWidth
        label="Ім'я"
        error={!!errors.first_name}
        helperText={errors.first_name?.message}
        disabled={isSubmitting}
      />

      <TextField
        {...register('last_name')}
        margin="normal"
        required
        fullWidth
        label="Прізвище"
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
        label="Номер телефону"
        type="tel"
        error={!!errors.phone_number}
        helperText={errors.phone_number?.message}
        disabled={isSubmitting}
      />

      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
        <Button
          onClick={handleCancel}
          disabled={isSubmitting}
        >
          Скасувати
        </Button>
        <Button
          type="submit"
          variant="contained"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Збереження...' : 'Зберегти зміни'}
        </Button>
      </Box>
    </Box>
  );
};

export default ProfileEditForm;
