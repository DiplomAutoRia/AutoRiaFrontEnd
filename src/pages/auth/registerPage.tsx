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
  
  // State for typing status for each field
  const [firstNameIsTyping, setFirstNameIsTyping] = useState(false);
  const [lastNameIsTyping, setLastNameIsTyping] = useState(false);
  const [contactIsTyping, setContactIsTyping] = useState(false);
  const [codeIsTyping, setCodeIsTyping] = useState(false);
  const [passwordIsTyping, setPasswordIsTyping] = useState(false);
  const [repeatPasswordIsTyping, setRepeatPasswordIsTyping] = useState(false);

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
  
  // Debounced errors
  const firstNameError = useDebounce(firstNameIsTyping ? '' : errors.firstName || '', 3000);
  const lastNameError = useDebounce(lastNameIsTyping ? '' : errors.lastName || '', 3000);
  const contactError = useDebounce(contactIsTyping ? '' : errors.contact || '', 3000);
  const codeError = useDebounce(codeIsTyping ? '' : confirmErrors.code || '', 3000);
  const passwordError = useDebounce(passwordIsTyping ? '' : confirmErrors.password || '', 3000);
  const repeatPasswordError = useDebounce(repeatPasswordIsTyping ? '' : confirmErrors.repeatPassword || '', 3000);

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
                  className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-transparent ${firstNameError ? 'border-red-500' : 'border-gray-300'}`}
                  value={formData.firstName}
                  onChange={(e) => {
                    handleChange(e);
                    setFirstNameIsTyping(true);
                  }}
                  onBlur={() => setFirstNameIsTyping(false)}
                  autoComplete="off"
                  placeholder="Імʼя"
                />
              </div>
              {firstNameError && <p className="text-red-600 text-sm mt-1">{firstNameError}</p>}
            </div>

            <div className="mb-4">
              <div className="relative">
                <input
                  type="text"
                  name="lastName"
                  className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-transparent ${lastNameError ? 'border-red-500' : 'border-gray-300'}`}
                  value={formData.lastName}
                  onChange={(e) => {
                    handleChange(e);
                    setLastNameIsTyping(true);
                  }}
                  onBlur={() => setLastNameIsTyping(false)}
                  autoComplete="off"
                  placeholder="Прізвище"
                />
              </div>
              {lastNameError && <p className="text-red-600 text-sm mt-1">{lastNameError}</p>}
            </div>

            <div className="mb-4">
              <div className="relative">
                <input
                  type="text"
                  name="contact"
                  className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-transparent ${contactError ? 'border-red-500' : 'border-gray-300'}`}
                  value={formData.contact}
                  onChange={(e) => {
                    handleChange(e);
                    setContactIsTyping(true);
                  }}
                  onBlur={() => setContactIsTyping(false)}
                  autoComplete="off"
                  placeholder="Пошта або номер телефону"
                />
              </div>
              {contactError && <p className="text-red-600 text-sm mt-1">{contactError}</p>}
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
                  className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-transparent ${codeError ? 'border-red-500' : 'border-gray-300'}`}
                  value={confirmData.code}
                  onChange={(e) => {
                    handleConfirmChange(e);
                    setCodeIsTyping(true);
                  }}
                  onBlur={() => setCodeIsTyping(false)}
                  autoComplete="off"
                  placeholder="Код підтвердження"
                />
              </div>
              {codeError && <p className="text-red-600 text-sm mt-1">{codeError}</p>}
            </div>

            <div className="mb-4">
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-transparent ${passwordError ? 'border-red-500' : 'border-gray-300'}`}
                  value={confirmData.password}
                  onChange={(e) => {
                    handleConfirmChange(e);
                    setPasswordIsTyping(true);
                  }}
                  onBlur={() => setPasswordIsTyping(false)}
                  autoComplete="off"
                  placeholder="Пароль"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                </button>
              </div>
              {passwordError && <p className="text-red-600 text-sm mt-1">{passwordError}</p>}
            </div>

            <div className="mb-4">
              <div className="relative">
                <input
                  type={showRepeatPassword ? "text" : "password"}
                  name="repeatPassword"
                  className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-transparent ${repeatPasswordError ? 'border-red-500' : 'border-gray-300'}`}
                  value={confirmData.repeatPassword}
                  onChange={(e) => {
                    handleConfirmChange(e);
                    setRepeatPasswordIsTyping(true);
                  }}
                  onBlur={() => setRepeatPasswordIsTyping(false)}
                  autoComplete="off"
                  placeholder="Повторіть пароль"
                />
                <button
                  type="button"
                  onClick={() => setShowRepeatPassword(!showRepeatPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                >
                  {showRepeatPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                </button>
              </div>
              {repeatPasswordError && <p className="text-red-600 text-sm mt-1">{repeatPasswordError}</p>}
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
