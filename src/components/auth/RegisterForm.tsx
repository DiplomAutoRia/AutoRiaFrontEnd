import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import { createSelector } from '@reduxjs/toolkit';

import { confirmSchema, registerSchema } from '../../common/utils/zod-validation';
import { completeRegister, initialRegister, resetRegister, verifyRegister } from '../../redux/auth/authSlice';
import type { AppDispatch, RootState } from '../../redux/store';
import { routes } from '../../routes';
import { Button } from '../ui';

interface RegisterFormProps {
  onInitialSubmit?: (_data: {
    first_name: string;
    last_name: string;
    contact_info: { type: 'email' | 'phone'; value: string };
  }) => void;
  onConfirmSubmit?: (_data: { contact_info: string; code: string; password: string; password_confirm: string }) => void;
  onBack?: () => void;
}

export default function RegisterForm({ onInitialSubmit, onConfirmSubmit, onBack }: RegisterFormProps) {
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
  const selectRegisterState = createSelector(
    (state: RootState) => state.auth,
    (auth) => ({
      loading: auth.loading,
      error: auth.error,
      registerStep: auth.registerStep,
    }),
  );
  const { registerStep } = useSelector(selectRegisterState);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [, setSubmitted] = useState(false);

  const [confirmErrors, setConfirmErrors] = useState<Record<string, string>>({});
  const [confirmTouched, setConfirmTouched] = useState<Record<string, boolean>>({});
  const [, setConfirmSubmitted] = useState(false);

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
      const submitData = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        contact_info: {
          type: formData.contactType,
          value: formData.contact,
        },
      };

      if (onInitialSubmit) {
        onInitialSubmit(submitData);
      } else {
        dispatch(initialRegister(submitData));
      }
    }
  };

  const handleConfirmSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setConfirmSubmitted(true);
    const newErrors = validateConfirm(confirmData);
    setConfirmErrors(newErrors);
    setConfirmTouched({ code: true, password: true, repeatPassword: true });
    if (Object.keys(newErrors).length === 0) {
      const submitData = {
        contact_info: formData.contact,
        code: confirmData.code,
        password: confirmData.password,
        password_confirm: confirmData.repeatPassword,
      };

      if (onConfirmSubmit) {
        onConfirmSubmit(submitData);
      } else {
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
    }
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      dispatch(resetRegister());
    }
  };

  if (registerStep === 'initial') {
    return (
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="firstName"
          className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-transparent mb-4 ${errors.firstName && (touched.firstName || formData.firstName) ? 'border-red-500' : 'border-gray-300'}`}
          value={formData.firstName}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleFocus}
          autoComplete="off"
          placeholder="Імʼя"
        />
        {errors.firstName && (touched.firstName || formData.firstName) && (
          <p className="text-red-600 text-sm mt-1 mb-4">{errors.firstName}</p>
        )}

        <input
          type="text"
          name="lastName"
          className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-transparent mb-4 ${errors.lastName && (touched.lastName || formData.lastName) ? 'border-red-500' : 'border-gray-300'}`}
          value={formData.lastName}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleFocus}
          autoComplete="off"
          placeholder="Прізвище"
        />
        {errors.lastName && (touched.lastName || formData.lastName) && (
          <p className="text-red-600 text-sm mt-1 mb-4">{errors.lastName}</p>
        )}

        <input
          type="text"
          name="contact"
          className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-transparent mb-4 ${errors.contact && (touched.contact || formData.contact) ? 'border-red-500' : 'border-gray-300'}`}
          value={formData.contact}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleFocus}
          autoComplete="off"
          placeholder="Пошта або номер телефону"
        />
        {errors.contact && (touched.contact || formData.contact) && (
          <p className="text-red-600 text-sm mt-1 mb-4">{errors.contact}</p>
        )}

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

        <Button type="submit" disabled={!formData.acceptTerms} className="w-full mb-2">
          Продовжити
        </Button>

        <div className="flex justify-end">
          <Link to={routes.LOGIN} className="text-indigo-600 hover:underline text-sm">
            Вже зареєстровані?
          </Link>
        </div>
      </form>
    );
  }

  return (
    <form onSubmit={handleConfirmSubmit}>
      <input
        type="text"
        name="code"
        className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-transparent mb-4 ${confirmErrors.code && (confirmTouched.code || confirmData.code) ? 'border-red-500' : 'border-gray-300'}`}
        value={confirmData.code}
        onChange={handleConfirmChange}
        onFocus={handleConfirmFocus}
        onBlur={handleConfirmFocus}
        autoComplete="off"
        placeholder="Код підтвердження"
      />
      {confirmErrors.code && (confirmTouched.code || confirmData.code) && (
        <p className="text-red-600 text-sm mt-1 mb-4">{confirmErrors.code}</p>
      )}

      <input
        type="password"
        name="password"
        className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-transparent mb-4 ${confirmErrors.password && (confirmTouched.password || confirmData.password) ? 'border-red-500' : 'border-gray-300'}`}
        value={confirmData.password}
        onChange={handleConfirmChange}
        onFocus={handleConfirmFocus}
        onBlur={handleConfirmFocus}
        autoComplete="off"
        placeholder="Пароль"
      />
      {confirmErrors.password && (confirmTouched.password || confirmData.password) && (
        <p className="text-red-600 text-sm mt-1 mb-4">{confirmErrors.password}</p>
      )}

      <input
        type="password"
        name="repeatPassword"
        className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-transparent mb-4 ${confirmErrors.repeatPassword && (confirmTouched.repeatPassword || confirmData.repeatPassword) ? 'border-red-500' : 'border-gray-300'}`}
        value={confirmData.repeatPassword}
        onChange={handleConfirmChange}
        onFocus={handleConfirmFocus}
        onBlur={handleConfirmFocus}
        autoComplete="off"
        placeholder="Повторіть пароль"
      />
      {confirmErrors.repeatPassword && (confirmTouched.repeatPassword || confirmData.repeatPassword) && (
        <p className="text-red-600 text-sm mt-1 mb-4">{confirmErrors.repeatPassword}</p>
      )}

      <Button type="submit" className="w-full">
        Завершити реєстрацію
      </Button>

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
  );
}
