import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { ArrowLeft } from 'lucide-react';

import { loginUser } from '../../redux/auth/authSlice';
import type { AppDispatch, RootState } from '../../redux/store';

interface PhoneLoginFormProps {
  onBack: () => void;
}

export default function PhoneLoginForm({ onBack }: PhoneLoginFormProps) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector((state: RootState) => state.auth);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(
      loginUser({
        contact_info: phoneNumber,
        password: password,
      }),
    );
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <h1 className="text-3xl font-bold text-black text-center mb-2">Увійти в Turbosell</h1>

      <p className="text-gray-600 mb-6 text-center">Введіть номер телефону та пароль для входу в систему.</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="Номер телефону"
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Пароль"
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

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
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
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
      </form>

      <div className="mt-6 text-center">
        <button
          onClick={onBack}
          className="inline-flex items-center text-blue-600 hover:text-blue-700 transition-colors text-sm"
        >
          <ArrowLeft size={16} className="mr-2" />
          Повернутися назад
        </button>
      </div>

      <p className="text-xs text-gray-500 mt-4 text-center">
        Під час входу ви погоджуєтеся з{' '}
        <a href="#" className="text-blue-600 hover:underline">
          Умовами користування
        </a>
      </p>
    </div>
  );
}
