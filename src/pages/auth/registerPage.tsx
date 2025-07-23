import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import { createSelector } from '@reduxjs/toolkit';

import { confirmSchema, registerSchema } from '../../common/utils/zod-validation';
import {
  completeRegister,
  googleAuth,
  initialRegister,
  resetRegister,
  verifyRegister,
} from '../../redux/auth/authSlice';
import type { AppDispatch, RootState } from '../../redux/store';
import { routes } from '../../routes';

type CredentialResponse = {
  credential?: string;
  select_by?: string;
  clientId?: string;
};

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    contact: '',
    contactType: 'email' as 'email' | 'phone',
    acceptTerms: false,
  });

  const [confirmData, setConfirmData] = useState({
    code: '',
    password: '',
    repeatPassword: '',
  });
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const selectRegisterState = createSelector(
    (state: RootState) => state.auth,
    (auth) => ({
      loading: auth.loading,
      error: auth.error,
      registerStep: auth.registerStep,
      user: auth.user,
    }),
  );
  const { registerStep, user } = useSelector(selectRegisterState);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [, setSubmitted] = useState(false);

  const [confirmErrors, setConfirmErrors] = useState<Record<string, string>>({});
  const [confirmTouched, setConfirmTouched] = useState<Record<string, boolean>>({});
  const [, setConfirmSubmitted] = useState(false);

  useEffect(() => {
    if (user) {
      navigate(routes.HOME);
    }
  }, [user, navigate]);

  const validate = (fieldValues = formData) => {
    const result = registerSchema.safeParse(fieldValues);
    if (result.success) return {};
    const newErrors: Record<string, string> = {};
    result.error.errors.forEach((err) => {
      if (err.path[0]) newErrors[err.path[0] as string] = err.message;
    });
    return newErrors;
  };

  const validateConfirm = (fields = confirmData) => {
    const result = confirmSchema.safeParse(fields);
    if (result.success) return {};
    const newErrors: Record<string, string> = {};
    result.error.errors.forEach((err) => {
      if (err.path[0]) newErrors[err.path[0] as string] = err.message;
    });
    return newErrors;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => {
      const updated = {
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      };
      setErrors(validate(updated));
      return updated;
    });
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const handleConfirmChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setConfirmData((prev) => {
      const updated = { ...prev, [name]: value };
      setConfirmErrors(validateConfirm(updated));
      return updated;
    });
  };

  const handleConfirmFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target;
    setConfirmTouched((prev) => ({ ...prev, [name]: true }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    const newErrors = validate(formData);
    setErrors(newErrors);
    setTouched({ firstName: true, lastName: true, contact: true });
    if (Object.keys(newErrors).length === 0 && formData.acceptTerms) {
      dispatch(
        initialRegister({
          first_name: formData.firstName,
          last_name: formData.lastName,
          contact_info: {
            type: formData.contactType,
            value: formData.contact,
          },
        }),
      );
    }
  };

  const handleConfirmSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setConfirmSubmitted(true);
    const newErrors = validateConfirm(confirmData);
    setConfirmErrors(newErrors);
    setConfirmTouched({ code: true, password: true, repeatPassword: true });
    if (Object.keys(newErrors).length === 0) {
      dispatch(
        verifyRegister({
          contact_info: formData.contact,
          code: confirmData.code,
        }),
      ).then((res: any) => {
        if (!res.error) {
          dispatch(
            completeRegister({
              contact_info: formData.contact,
              password: confirmData.password,
              password_confirm: confirmData.repeatPassword,
            }),
          ).then((res: any) => {
            if (res.error) {
              console.error('Registration error:', res.error);
            }
          });
        }
      });
    }
  };

  const handleBack = () => {
    dispatch(resetRegister());
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-10">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-6">Реєстрація</h2>

        <div className="mb-6 flex justify-center">
          <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
            <GoogleLogin
              onSuccess={(credentialResponse: CredentialResponse) => {
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
        {registerStep === 'initial' ? (
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <div className="relative">
                <input
                  type="text"
                  name="firstName"
                  className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-transparent ${errors.firstName && (touched.firstName || formData.firstName) ? 'border-red-500' : 'border-gray-300'}`}
                  value={formData.firstName}
                  onChange={handleChange}
                  onFocus={handleFocus}
                  onBlur={handleFocus}
                  autoComplete="off"
                  placeholder="Імʼя"
                />
              </div>
              {errors.firstName && (touched.firstName || formData.firstName) && (
                <p className="text-red-600 text-sm mt-1">{errors.firstName}</p>
              )}
            </div>

            <div className="mb-4">
              <div className="relative">
                <input
                  type="text"
                  name="lastName"
                  className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-transparent ${errors.lastName && (touched.lastName || formData.lastName) ? 'border-red-500' : 'border-gray-300'}`}
                  value={formData.lastName}
                  onChange={handleChange}
                  onFocus={handleFocus}
                  onBlur={handleFocus}
                  autoComplete="off"
                  placeholder="Прізвище"
                />
              </div>
              {errors.lastName && (touched.lastName || formData.lastName) && (
                <p className="text-red-600 text-sm mt-1">{errors.lastName}</p>
              )}
            </div>

            <div className="mb-4">
              <div className="relative">
                <input
                  type="text"
                  name="contact"
                  className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-transparent ${errors.contact && (touched.contact || formData.contact) ? 'border-red-500' : 'border-gray-300'}`}
                  value={formData.contact}
                  onChange={handleChange}
                  onFocus={handleFocus}
                  onBlur={handleFocus}
                  autoComplete="off"
                  placeholder="Пошта або номер телефону"
                />
              </div>
              {errors.contact && (touched.contact || formData.contact) && (
                <p className="text-red-600 text-sm mt-1">{errors.contact}</p>
              )}
            </div>

            <div className="flex items-center mb-4">
              <input
                type="checkbox"
                id="acceptTerms"
                name="acceptTerms"
                checked={formData.acceptTerms}
                onChange={handleChange}
                className="mr-2"
              />
              <label htmlFor="acceptTerms" className="text-gray-700 cursor-pointer">
                Я приймаю умови
              </label>
            </div>

            <button
              type="submit"
              className="w-full py-2 mb-2 bg-indigo-600 text-white font-semibold rounded hover:bg-indigo-700 transition disabled:bg-indigo-300"
              disabled={!formData.acceptTerms}
            >
              Продовжити
            </button>

            <div className="flex justify-end">
              <Link to={routes.LOGIN} className="text-indigo-600 hover:underline text-sm">
                Вже зареєстровані?
              </Link>
            </div>
          </form>
        ) : (
          <form onSubmit={handleConfirmSubmit}>
            <div className="mb-4">
              <div className="relative">
                <input
                  type="text"
                  name="code"
                  className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-transparent ${confirmErrors.code && (confirmTouched.code || confirmData.code) ? 'border-red-500' : 'border-gray-300'}`}
                  value={confirmData.code}
                  onChange={handleConfirmChange}
                  onFocus={handleConfirmFocus}
                  onBlur={handleConfirmFocus}
                  autoComplete="off"
                  placeholder="Код підтвердження"
                />
              </div>
              {confirmErrors.code && (confirmTouched.code || confirmData.code) && (
                <p className="text-red-600 text-sm mt-1">{confirmErrors.code}</p>
              )}
            </div>

            <div className="mb-4">
              <div className="relative">
                <input
                  type="password"
                  name="password"
                  className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-transparent ${confirmErrors.password && (confirmTouched.password || confirmData.password) ? 'border-red-500' : 'border-gray-300'}`}
                  value={confirmData.password}
                  onChange={handleConfirmChange}
                  onFocus={handleConfirmFocus}
                  onBlur={handleConfirmFocus}
                  autoComplete="off"
                  placeholder="Пароль"
                />
              </div>
              {confirmErrors.password && (confirmTouched.password || confirmData.password) && (
                <p className="text-red-600 text-sm mt-1">{confirmErrors.password}</p>
              )}
            </div>

            <div className="mb-4">
              <div className="relative">
                <input
                  type="password"
                  name="repeatPassword"
                  className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-transparent ${confirmErrors.repeatPassword && (confirmTouched.repeatPassword || confirmData.repeatPassword) ? 'border-red-500' : 'border-gray-300'}`}
                  value={confirmData.repeatPassword}
                  onChange={handleConfirmChange}
                  onFocus={handleConfirmFocus}
                  onBlur={handleConfirmFocus}
                  autoComplete="off"
                  placeholder="Повторіть пароль"
                />
              </div>
              {confirmErrors.repeatPassword && (confirmTouched.repeatPassword || confirmData.repeatPassword) && (
                <p className="text-red-600 text-sm mt-1">{confirmErrors.repeatPassword}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-indigo-600 text-white font-semibold rounded hover:bg-indigo-700 transition"
            >
              Завершити реєстрацію
            </button>

            <div className="flex justify-between mt-4">
              <Link to={routes.LOGIN} className="text-indigo-600 hover:underline text-sm">
                Вже зареєстровані
              </Link>
              <button
                type="button"
                className="text-indigo-600 hover:underline text-sm bg-transparent border-none cursor-pointer"
                onClick={handleBack}
              >
                Вказати інші дані
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
