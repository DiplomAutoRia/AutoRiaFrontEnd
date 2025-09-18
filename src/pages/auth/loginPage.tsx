import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

import { zodResolver } from '@hookform/resolvers/zod';
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';

import { loginSchema } from '../../common/utils/zod-validation';
import PhoneLoginForm from '../../components/auth/PhoneLoginForm';
import { googleAuth, loginUser } from '../../redux/auth/authSlice';
import type { AppDispatch, RootState } from '../../redux/store';
import { routes } from '../../routes';

export default function LoginPage() {
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
  const navigate = useNavigate();
  const { loading, error, user } = useSelector((state: RootState) => state.auth);
  const [showPhoneForm, setShowPhoneForm] = useState(false);

  useEffect(() => {
    if (user) {
      navigate(routes.HOME);
    }
  }, [user, navigate]);

  const onSubmit = (data: { contact: string; password: string }) => {
    dispatch(
      loginUser({
        contact_info: data.contact,
        password: data.password,
      }),
    );
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
          {showPhoneForm ? (
            <PhoneLoginForm onBack={() => setShowPhoneForm(false)} />
          ) : (
            <>
              <h1 className="text-3xl font-bold text-black text-center mb-2">Увійти в Turbosell</h1>

              <p className="text-gray-600 text-center mb-6">Купуйте й продавайте авто онлайн</p>

              <div className="mb-6 flex flex-col gap-3">
                <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || ''}>
                  <GoogleLogin
                    onSuccess={(credentialResponse: { credential?: string }) => {
                      if (credentialResponse.credential) {
                        dispatch(googleAuth(credentialResponse.credential));
                      }
                    }}
                    onError={() => {}}
                    render={(renderProps: { onClick: () => void; disabled: boolean }) => (
                      <button
                        onClick={renderProps.onClick}
                        disabled={renderProps.disabled}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 rounded-md bg-white text-gray-700 font-medium text-sm hover:bg-gray-50 transition-colors"
                      >
                        <img
                          src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                          alt="Google"
                          className="w-5 h-5"
                        />
                        Вхід через Google
                      </button>
                    )}
                  />
                </GoogleOAuthProvider>

                <button
                  onClick={() => setShowPhoneForm(true)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 rounded-md bg-white text-gray-700 font-medium text-sm hover:bg-gray-50 transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                  Увійти через номер
                </button>
              </div>

              <div className="flex items-center mb-6">
                <div className="flex-1 border-t border-gray-300"></div>
                <span className="px-3 text-gray-500">або</span>
                <div className="flex-1 border-t border-gray-300"></div>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <input
                    type="text"
                    placeholder="Телефон або e-mail"
                    className={`w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.contact ? 'border-red-500' : 'border-gray-300'
                    }`}
                    {...register('contact')}
                  />
                  {errors.contact && <p className="mt-1 text-sm text-red-600">{errors.contact.message}</p>}
                </div>

                <div>
                  <input
                    type="password"
                    placeholder="Пароль"
                    className={`w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.password ? 'border-red-500' : 'border-gray-300'
                    }`}
                    {...register('password')}
                  />
                  {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>}

                  <div className="flex justify-between items-center mt-2">
                    <label className="flex items-center gap-2 text-sm text-gray-600">
                      <input type="checkbox" className="w-4 h-4 text-blue-600 rounded" />
                      Запам'ятати мене
                    </label>

                    <Link to="/forgot-password" className="text-blue-600 text-sm hover:underline">
                      Забули пароль?
                    </Link>
                  </div>
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
                      Завантаження...
                    </>
                  ) : (
                    'Увійти'
                  )}
                </button>

                <div className="text-center">
                  <Link to="/register" className="text-blue-600 font-medium hover:underline">
                    Зареєструватися
                  </Link>
                </div>

                {error && (
                  <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
                    <p className="text-red-700 text-sm">{error}</p>
                  </div>
                )}

                <p className="text-xs text-gray-500 text-center mt-4">
                  Під час входу ви погоджуєтеся з {'Умовами користування'}
                </p>
              </form>
            </>
          )}
        </div>
      </div>

      <div className="hidden md:block w-1/2 bg-blue-500 max-h-screen">
        <img src="/locales/images/Login.png" alt="Login" className="w-full h-full object-cover" />
      </div>
    </div>
  );
}
