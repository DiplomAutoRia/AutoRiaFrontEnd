import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft } from 'lucide-react';
import { z } from 'zod';

import { requestPasswordReset } from '../../redux/auth/authSlice';
import type { AppDispatch, RootState } from '../../redux/store';
import { routes } from '../../routes';

const forgotPasswordSchema = z.object({
  contact_info: z.string().min(1, 'Будь ласка, введіть ваш email або номер телефону'),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state: RootState) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      const contactType: 'email' | 'phone' = data.contact_info.includes('@') ? 'email' : 'phone';

      const contactInfo = {
        type: contactType,
        value: data.contact_info,
      };

      await dispatch(requestPasswordReset(contactInfo)).unwrap();

      navigate(routes.RESET_PASSWORD, { state: { contactInfo } });
    } catch (err) {
      console.error('Failed to request password reset:', err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-8 relative min-h-screen overflow-auto bg-white">
        <img
          src="/locales/images/Logo2.png"
          alt="Logo"
          className="absolute top-4 left-4 h-20 z-50 cursor-pointer"
          onClick={() => navigate(routes.HOME)}
        />

        <div className="w-full max-w-md mx-auto">
          <h1 className="text-3xl font-bold text-black text-center mb-2">Відновлення пароля</h1>

          <p className="text-gray-600 text-center mb-6">
            Для відновлення пароля, введіть Ваш телефон чи e-mail, які Ви вказували при реєстрації.
          </p>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md mb-4">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {successMessage && (
            <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-md mb-4">
              <p className="text-green-700 text-sm">{successMessage}</p>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <input
                type="text"
                placeholder="Телефон або e-mail"
                className={`w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.contact_info ? 'border-red-500' : 'border-gray-300'
                }`}
                {...register('contact_info')}
              />
              {errors.contact_info && <p className="mt-1 text-sm text-red-600">{errors.contact_info.message}</p>}
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
                  Відправка...
                </>
              ) : (
                'Продовжити'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center text-blue-600 hover:text-blue-700 transition-colors text-sm"
            >
              <ArrowLeft size={16} className="mr-2" />
              Повернутися назад
            </button>
          </div>
        </div>
      </div>

      <div className="hidden md:block w-1/2 bg-blue-600 max-h-screen">
        <img src="/locales/images/Password.png" alt="Password Recovery" className="w-full h-full object-cover" />
      </div>
    </div>
  );
}
