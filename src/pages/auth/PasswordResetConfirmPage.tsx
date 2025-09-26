import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';

import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft } from 'lucide-react';
import { z } from 'zod';

import { confirmPasswordReset } from '../../redux/auth/authSlice';
import type { AppDispatch, RootState } from '../../redux/store';
import { routes } from '../../routes';

const passwordResetConfirmSchema = z
  .object({
    code: z.string().min(1, 'Код підтвердження обовʼязковий'),
    password: z
      .string()
      .min(6, 'Пароль повинен містити принаймні 6 символів')
      .refine((password) => /[a-zA-Z]/.test(password), {
        message: 'Пароль повинен містити принаймні одну літеру',
      })
      .refine((password) => /[0-9]/.test(password), {
        message: 'Пароль повинен містити принаймні одну цифру',
      }),
    password_confirm: z.string(),
  })
  .refine((data) => data.password === data.password_confirm, {
    message: 'Паролі не співпадають',
    path: ['password_confirm'],
  });

type PasswordResetConfirmFormData = z.infer<typeof passwordResetConfirmSchema>;

export default function PasswordResetConfirmPage() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();
  const { loading, error } = useSelector((state: RootState) => state.auth);
  const [isSuccess, setIsSuccess] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);

  const { contactInfo } = location.state || {};

  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PasswordResetConfirmFormData>({
    resolver: zodResolver(passwordResetConfirmSchema),
  });

  const onSubmit = async (data: PasswordResetConfirmFormData) => {
    try {
      if (!contactInfo) {
        throw new Error('Контактна інформація не знайдена');
      }

      await dispatch(
        confirmPasswordReset({
          contact_info: contactInfo.value,
          code: data.code,
          password: data.password,
          password_confirm: data.password_confirm,
        }),
      ).unwrap();

      setIsSuccess(true);
    } catch (err) {
      console.error('Failed to reset password:', err);
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleBackToLogin = () => {
    navigate(routes.LOGIN);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-8 relative min-h-screen overflow-auto bg-white">
        <img
          src="/assets/images/Logo2.png"
          alt="Logo"
          className="absolute top-4 left-4 h-12 z-50 cursor-pointer"
          onClick={() => navigate(routes.HOME)}
        />

        <div className="w-full max-w-md mx-auto">
          {!isSuccess ? (
            <>
              <h1 className="text-3xl font-bold text-black text-center mb-2">Встановлення нового пароля</h1>

              <p className="text-gray-600 text-center mb-4">
                {contactInfo?.type === 'email'
                  ? 'Ми надіслали листа з кодом підтвердження на вашу електронну пошту. Перевірте вхідні повідомлення (або папку "Спам").'
                  : 'Ми надіслали 4-значний код у SMS на ваш номер телефону. Введіть його нижче, щоб відновити пароль.'}
              </p>

              <p className="text-sm text-gray-500 text-center mb-6">
                Код дійсний: <span className="font-semibold">{formatTime(timeLeft)}</span>
              </p>

              {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md mb-4">
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-1">
                    Код підтвердження
                  </label>
                  <input
                    id="code"
                    type="text"
                    className={`w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.code ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Введіть код підтвердження"
                    {...register('code')}
                  />
                  {errors.code && <p className="mt-1 text-sm text-red-600">{errors.code.message}</p>}
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    Новий пароль
                  </label>
                  <input
                    id="password"
                    type="password"
                    autoComplete="new-password"
                    className={`w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.password ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Введіть новий пароль"
                    {...register('password')}
                  />
                  {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>}
                </div>

                <div>
                  <label htmlFor="password_confirm" className="block text-sm font-medium text-gray-700 mb-1">
                    Підтвердіть новий пароль
                  </label>
                  <input
                    id="password_confirm"
                    type="password"
                    autoComplete="new-password"
                    className={`w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.password_confirm ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Повторіть новий пароль"
                    {...register('password_confirm')}
                  />
                  {errors.password_confirm && (
                    <p className="mt-1 text-sm text-red-600">{errors.password_confirm.message}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {loading ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Збереження...
                    </>
                  ) : (
                    'Змінити пароль'
                  )}
                </button>
              </form>

              <div className="mt-6 text-center">
                <button
                  onClick={handleBackToLogin}
                  className="inline-flex items-center text-blue-600 hover:text-blue-700 transition-colors text-sm"
                >
                  <ArrowLeft size={16} className="mr-2" />
                  Повернутися до входу
                </button>
              </div>
            </>
          ) : (
            <>
              <h1 className="text-3xl font-bold text-black text-center mb-2">Пароль змінено</h1>

              <p className="text-gray-600 text-center mb-6">
                Ваш пароль успішно змінено. Тепер ви можете увійти з новим паролем.
              </p>

              <button
                onClick={handleBackToLogin}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Увійти
              </button>
            </>
          )}
        </div>
      </div>

      <div className="hidden md:block w-1/2 bg-blue-600 max-h-screen">
        <img src="/assets/images/Password.png" alt="Password Recovery" className="w-full h-full object-cover" />
      </div>
    </div>
  );
}
