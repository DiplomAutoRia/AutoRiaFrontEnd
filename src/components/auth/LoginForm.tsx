import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import { zodResolver } from '@hookform/resolvers/zod';

import { loginSchema } from '../../common/utils/zod-validation';
import { loginUser } from '../../redux/auth/authSlice';
import type { AppDispatch, RootState } from '../../redux/store';
import { routes } from '../../routes';
import { Button, Input } from '../ui';

interface LoginFormProps {
  onSubmit?: (_data: { contact: string; password: string }) => void;
}

export default function LoginForm({ onSubmit }: LoginFormProps) {
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      contact: '',
      password: '',
    },
  });

  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector((state: RootState) => state.auth);

  const handleFormSubmit = (data: { contact: string; password: string }) => {
    if (onSubmit) {
      onSubmit(data);
    } else {
      dispatch(
        loginUser({
          contact_info: data.contact,
          password: data.password,
        }),
      );
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)}>
      <Input
        type="text"
        placeholder={t('auth.login.emailOrPhone')}
        error={!!errors.contact}
        helperText={errors.contact?.message}
        {...register('contact')}
      />

      <Input
        type="password"
        placeholder={t('auth.login.password')}
        error={!!errors.password}
        helperText={errors.password?.message}
        {...register('password')}
      />

      <Button type="submit" loading={loading} className="w-full">
        {t('auth.login.loginButton')}
      </Button>

      {error && <div className="text-red-600 text-sm mt-2">{error}</div>}

      <div className="mt-4 text-center">
        <Link to={routes.REGISTER} className="text-indigo-600 hover:underline">
          {t('auth.login.noAccount')}
        </Link>
      </div>
    </form>
  );
}
