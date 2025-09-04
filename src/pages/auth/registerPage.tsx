import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import { useDebounce } from '../../hooks/useDebounce';
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
  
  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);
  
  const [firstNameIsTyping, setFirstNameIsTyping] = useState(false);
  const [lastNameIsTyping, setLastNameIsTyping] = useState(false);
  const [contactIsTyping, setContactIsTyping] = useState(false);
  const [passwordIsTyping, setPasswordIsTyping] = useState(false);
  const [repeatPasswordIsTyping, setRepeatPasswordIsTyping] = useState(false);

  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [confirmTouched, setConfirmTouched] = useState<Record<string, boolean>>({});

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
  const [confirmErrors, setConfirmErrors] = useState<Record<string, string>>({});

  const firstNameError = useDebounce(firstNameIsTyping ? '' : errors.firstName || '', 2000);
  const lastNameError = useDebounce(lastNameIsTyping ? '' : errors.lastName || '', 2000);
  const contactError = useDebounce(contactIsTyping ? '' : errors.contact || '', 2000);
  const codeError = useDebounce(confirmErrors.code || '', 2000);
  const passwordError = useDebounce(passwordIsTyping ? '' : confirmErrors.password || '', 2000);
  const repeatPasswordError = useDebounce(repeatPasswordIsTyping ? '' : confirmErrors.repeatPassword || '', 2000);

  useEffect(() => {
    if (user) {
      navigate(routes.HOME);
    }
  }, [user, navigate]);

  useEffect(() => {
    if (registerStep === 'done') {
      navigate(routes.HOME);
    }
  }, [registerStep, navigate]);

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
    setTouched(prev => ({ ...prev, [name]: true }));
  };

  const handleConfirmFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target;
    setConfirmTouched(prev => ({ ...prev, [name]: true }));
  };

  const handleConfirmChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setConfirmData((prev) => {
      const updated = { ...prev, [name]: value };
      setConfirmErrors(validateConfirm(updated));
      return updated;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validate(formData);
    setErrors(newErrors);
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
    const newErrors = validateConfirm(confirmData);
    setConfirmErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      dispatch(
        verifyRegister({
          contact_info: formData.contact,
          code: confirmData.code,
        }),
      ).then((res) => {
        if (res.type.endsWith('/fulfilled')) {
          dispatch(
            completeRegister({
              contact_info: formData.contact,
              password: confirmData.password,
              password_confirm: confirmData.repeatPassword,
            }),
          ).then((res) => {
            if (res.type.endsWith('/fulfilled')) {
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
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left Column - Form */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-8 relative min-h-screen overflow-auto bg-white">
        <img 
          src="/locales/images/Logo2.png" 
          alt="Logo" 
          className="absolute top-4 left-4 h-20 z-50 cursor-pointer"
          onClick={() => navigate(routes.HOME)}
        />
        
        <div className="w-full max-w-md mx-auto">
          <h1 className="text-3xl font-bold text-black text-center mb-2">
            Зареєструватись в TurboSell
          </h1>
          
          <p className="text-gray-600 text-center mb-6">
            Купуйте й продавайте авто онлайн
          </p>

          <div className="mb-6 flex flex-col gap-3">
            <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
              <GoogleLogin
                onSuccess={(credentialResponse: CredentialResponse) => {
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
                    <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
                    Вхід через Google
                  </button>
                )}
              />
            </GoogleOAuthProvider>
          </div>

          <div className="flex items-center mb-6">
            <div className="flex-1 border-t border-gray-300"></div>
            <span className="px-3 text-gray-500">або</span>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>

          {registerStep === 'initial' ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <input
                  type="text"
                  placeholder="Імʼя"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  onFocus={handleFocus}
                  onBlur={handleFocus}
                  autoComplete="off"
                  className={`w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.firstName && (touched.firstName || formData.firstName) ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.firstName && (touched.firstName || formData.firstName) && (
                  <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
                )}
              </div>

              <div>
                <input
                  type="text"
                  placeholder="Прізвище"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  onFocus={handleFocus}
                  onBlur={handleFocus}
                  autoComplete="off"
                  className={`w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.lastName && (touched.lastName || formData.lastName) ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.lastName && (touched.lastName || formData.lastName) && (
                  <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
                )}
              </div>

              <div>
                <input
                  type="text"
                  placeholder="Пошта або номер телефону"
                  name="contact"
                  value={formData.contact}
                  onChange={handleChange}
                  onFocus={handleFocus}
                  onBlur={handleFocus}
                  autoComplete="off"
                  className={`w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.contact && (touched.contact || formData.contact) ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.contact && (touched.contact || formData.contact) && (
                  <p className="mt-1 text-sm text-red-600">{errors.contact}</p>
                )}
              </div>

              <label className="flex items-center gap-2 text-sm text-gray-700 mb-4">
                <input
                  type="checkbox"
                  name="acceptTerms"
                  checked={formData.acceptTerms}
                  onChange={handleChange}
                  className="w-4 h-4 text-blue-600 rounded"
                />
                Я приймаю умови використання та Політику конфіденційності
              </label>

              <button
                type="submit"
                disabled={!formData.acceptTerms}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Продовжити
              </button>

              <div className="text-center">
                <Link
                  to="/login"
                  className="text-blue-600 font-medium hover:underline"
                >
                  Вже зареєстровані?
                </Link>
              </div>
            </form>
          ) : (
            <form onSubmit={handleConfirmSubmit} className="space-y-4">
              <div>
                <input
                  type="text"
                  placeholder="Код підтвердження"
                  name="code"
                  value={confirmData.code}
                  onChange={handleConfirmChange}
                  onFocus={handleConfirmFocus}
                  onBlur={handleConfirmFocus}
                  autoComplete="off"
                  className={`w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    confirmErrors.code && (confirmTouched.code || confirmData.code) ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {confirmErrors.code && (confirmTouched.code || confirmData.code) && (
                  <p className="mt-1 text-sm text-red-600">{confirmErrors.code}</p>
                )}
              </div>

              <div>
                <input
                  type="password"
                  placeholder="Пароль"
                  name="password"
                  value={confirmData.password}
                  onChange={handleConfirmChange}
                  onFocus={handleConfirmFocus}
                  onBlur={handleConfirmFocus}
                  autoComplete="off"
                  className={`w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    confirmErrors.password && (confirmTouched.password || confirmData.password) ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {confirmErrors.password && (confirmTouched.password || confirmData.password) && (
                  <p className="mt-1 text-sm text-red-600">{confirmErrors.password}</p>
                )}
              </div>

              <div>
                <input
                  type="password"
                  placeholder="Повторіть пароль"
                  name="repeatPassword"
                  value={confirmData.repeatPassword}
                  onChange={handleConfirmChange}
                  onFocus={handleConfirmFocus}
                  onBlur={handleConfirmFocus}
                  autoComplete="off"
                  className={`w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    confirmErrors.repeatPassword && (confirmTouched.repeatPassword || confirmData.repeatPassword) ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {confirmErrors.repeatPassword && (confirmTouched.repeatPassword || confirmData.repeatPassword) && (
                  <p className="mt-1 text-sm text-red-600">{confirmErrors.repeatPassword}</p>
                )}
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Завершити реєстрацію
              </button>

              <div className="flex justify-between items-center mt-2">
                <Link to="/login" className="text-blue-600 text-sm hover:underline">
                  Вже зареєстровані
                </Link>
                <button
                  type="button"
                  onClick={handleBack}
                  className="text-blue-600 text-sm hover:underline"
                >
                  Вказати інші дані
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      <div className="hidden md:block w-1/2 bg-blue-600 max-h-screen">
        <img
          src="/locales/images/Register.png"
          alt="Register"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
}
