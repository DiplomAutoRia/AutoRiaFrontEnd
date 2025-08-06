import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { confirmPasswordReset } from '../../redux/auth/authSlice';
import type { RootState, AppDispatch } from '../../redux/store';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const resetPasswordSchema = z.object({
  code: z.string().min(1, 'Код підтвердження обовʼязковий'),
  new_password: z.string()
    .min(6, 'Пароль повинен містити принаймні 6 символів')
    .refine(password => /[a-zA-Z]/.test(password), {
      message: 'Пароль повинен містити принаймні одну літеру',
    })
    .refine(password => /[0-9]/.test(password), {
      message: 'Пароль повинен містити принаймні одну цифру',
    }),
  confirm_new_password: z.string(),
}).refine(data => data.new_password === data.confirm_new_password, {
  message: 'Паролі не співпадають',
  path: ['confirm_new_password'],
});

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector((state: RootState) => state.auth);
  const [contactInfo, setContactInfo] = useState<string | { type: string; value: string }>('');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  const { 
    register, 
    handleSubmit, 
    formState: { errors } 
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  useEffect(() => {
    if (location.state?.contact_info) {
      setContactInfo(location.state.contact_info);
    } else {
      navigate('/forgot-password');
    }
  }, [location, navigate]);

  const onSubmit = async (data: ResetPasswordFormData) => {
    try {
      const contactInfoObj = typeof contactInfo === 'string' ? 
        { type: contactInfo.includes('@') ? 'email' : 'phone', value: contactInfo } : 
        contactInfo;
      
      await dispatch(confirmPasswordReset({
        contact_info: contactInfoObj.value, 
        code: data.code,
        password: data.new_password
      })).unwrap();
      
      setSuccessMessage('Пароль успішно змінено! Тепер ви можете увійти з новим паролем.');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      console.error('Failed to reset password:', err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Встановлення нового паролю
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Код було надіслано на: {typeof contactInfo === 'string' ? contactInfo : contactInfo.value}
          </p>
        </div>
        
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}
        
        {successMessage && (
          <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-4">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm text-green-700">{successMessage}</p>
              </div>
            </div>
          </div>
        )}
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <div>
              <label htmlFor="code" className="block text-sm font-medium text-gray-700">
                Код підтвердження
              </label>
              <input
                id="code"
                type="text"
                className={`mt-1 block w-full px-3 py-2 border ${
                  errors.code ? 'border-red-500' : 'border-gray-300'
                } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                {...register('code')}
              />
              {errors.code && (
                <p className="mt-1 text-sm text-red-600">{errors.code.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="new_password" className="block text-sm font-medium text-gray-700">
                Новий пароль
              </label>
              <input
                id="new_password"
                type="password"
                autoComplete="new-password"
                className={`mt-1 block w-full px-3 py-2 border ${
                  errors.new_password ? 'border-red-500' : 'border-gray-300'
                } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                {...register('new_password')}
              />
              {errors.new_password && (
                <p className="mt-1 text-sm text-red-600">{errors.new_password.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="confirm_new_password" className="block text-sm font-medium text-gray-700">
                Підтвердіть новий пароль
              </label>
              <input
                id="confirm_new_password"
                type="password"
                autoComplete="new-password"
                className={`mt-1 block w-full px-3 py-2 border ${
                  errors.confirm_new_password ? 'border-red-500' : 'border-gray-300'
                } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                {...register('confirm_new_password')}
              />
              {errors.confirm_new_password && (
                <p className="mt-1 text-sm text-red-600">{errors.confirm_new_password.message}</p>
              )}
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {loading ? 'Збереження...' : 'Змінити пароль'}
            </button>
          </div>
          
          <div className="text-center">
            <button
              type="button"
              onClick={() => navigate('/forgot-password')}
              className="text-sm text-indigo-600 hover:text-indigo-900"
            >
              Повернутися назад
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
