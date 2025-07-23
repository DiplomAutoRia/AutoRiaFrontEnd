import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { Button, Input } from '../ui';

const changePasswordSchema = z
  .object({
    current_password: z.string().min(1, "Поточний пароль обов'язковий"),
    new_password: z.string().min(6, 'Новий пароль повинен містити щонайменше 6 символів'),
    confirm_password: z.string().min(1, "Підтвердження пароля обов'язкове"),
  })
  .refine((data) => data.new_password === data.confirm_password, {
    message: 'Паролі не співпадають',
    path: ['confirm_password'],
  });

type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;

interface ChangePasswordFormProps {
  onSubmit?: (_data: ChangePasswordFormData) => void;
  onCancel?: () => void;
}

export default function ChangePasswordForm({ onSubmit, onCancel }: ChangePasswordFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      current_password: '',
      new_password: '',
      confirm_password: '',
    },
  });

  const handleFormSubmit = async (data: ChangePasswordFormData) => {
    setIsSubmitting(true);
    try {
      if (onSubmit) {
        await onSubmit(data);
      } else {
        console.log('Password change data:', data);
      }
      reset();
    } catch (error) {
      console.error('Password change error:', error);
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
        label="Поточний пароль"
        type="password"
        {...register('current_password')}
        error={errors.current_password?.message}
        placeholder="Введіть поточний пароль"
      />

      <Input
        label="Новий пароль"
        type="password"
        {...register('new_password')}
        error={errors.new_password?.message}
        placeholder="Введіть новий пароль"
      />

      <Input
        label="Підтвердити новий пароль"
        type="password"
        {...register('confirm_password')}
        error={errors.confirm_password?.message}
        placeholder="Підтвердіть новий пароль"
      />

      <div className="flex gap-3 pt-4">
        <Button type="submit" variant="warning" isLoading={isSubmitting} className="flex-1">
          Змінити пароль
        </Button>
        <Button type="button" variant="secondary" onClick={handleCancel} className="flex-1">
          Скасувати
        </Button>
      </div>
    </form>
  );
}
