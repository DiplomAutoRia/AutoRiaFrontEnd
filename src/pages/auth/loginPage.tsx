import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

import { zodResolver } from '@hookform/resolvers/zod';
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';

import { loginSchema } from '../../common/utils/zod-validation';
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
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-10">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-6">Вхід</h2>

        <div className="mb-6 flex justify-center">
          <GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID">
            <GoogleLogin
              onSuccess={(credentialResponse: { credential?: string }) => {
                if (credentialResponse.credential) {
                  dispatch(googleAuth(credentialResponse.credential));
                }
              }}
              onError={() => {
                console.log('Login Failed');
              }}
              useOneTap
            />
          </GoogleOAuthProvider>
        </div>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">або</span>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <input
              type="text"
              className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                errors.contact ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Введіть email або телефон (+380XXXXXXXXX)"
              {...register('contact')}
            />
            {errors.contact && <p className="text-red-500 text-sm mt-1">{errors.contact.message}</p>}
          </div>

          <div className="mb-4">
            <input
              type="password"
              className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                errors.password ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Введіть пароль"
              {...register('password')}
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-indigo-600 text-white font-semibold rounded hover:bg-indigo-700 transition disabled:bg-indigo-300 flex justify-center items-center"
            disabled={loading}
          >
            {loading && (
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            )}
            {loading ? 'Завантаження...' : 'Увійти'}
          </button>

          {error && <div className="text-red-600 text-sm mt-2">{error}</div>}

          <div className="mt-4 text-center">
            <Link to={routes.REGISTER} className="text-indigo-600 hover:underline">
              Немає акаунту? Зареєструватись
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
