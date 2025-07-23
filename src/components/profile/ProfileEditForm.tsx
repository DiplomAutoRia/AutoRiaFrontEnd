import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';

import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import type { RootState } from '../../redux/store';
import { Button, Input } from '../ui';

const profileEditSchema = z.object({
  first_name: z.string().min(2, "Ім'я повинно містити щонайменше 2 символи"),
  last_name: z.string().min(2, 'Прізвище повинно містити щонайменше 2 символи'),
  email: z.string().email('Невірний формат email').optional().or(z.literal('')),
  phone_number: z.string().optional().or(z.literal('')),
});

type ProfileEditFormData = z.infer<typeof profileEditSchema>;

interface ProfileEditFormProps {
  onSubmit?: (_data: ProfileEditFormData) => void;
  onCancel?: () => void;
}

export default function ProfileEditForm({ onSubmit, onCancel }: ProfileEditFormProps) {
  const { user, loading } = useSelector((state: RootState) => state.auth);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    try {
      if (onSubmit) {
        await onSubmit(data);
      } else {
        console.log('Profile update data:', data);
      }
    } catch (error) {
      console.error('Profile update error:', error);
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
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <Input
        label="Ім'я"
        {...register('first_name')}
        error={errors.first_name?.message}
        placeholder="Введіть ваше ім'я"
      />

      <Input
        label="Прізвище"
        {...register('last_name')}
        error={errors.last_name?.message}
        placeholder="Введіть ваше прізвище"
      />

      <Input
        label="Email"
        type="email"
        {...register('email')}
        error={errors.email?.message}
        placeholder="Введіть ваш email"
      />

      <Input
        label="Номер телефону"
        type="tel"
        {...register('phone_number')}
        error={errors.phone_number?.message}
        placeholder="Введіть ваш номер телефону"
      />

      <div className="flex gap-3 pt-4">
        <Button type="submit" isLoading={isSubmitting || loading} className="flex-1">
          Зберегти зміни
        </Button>
        <Button type="button" variant="secondary" onClick={handleCancel} className="flex-1">
          Скасувати
        </Button>
      </div>
    </form>
  );
}
