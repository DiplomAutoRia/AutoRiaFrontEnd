import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import { createSelector } from '@reduxjs/toolkit';
import { Box, TextField, FormControlLabel, Checkbox, Typography, Button as MuiButton } from '@mui/material';

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
        ).then((res) => {
          if (res.type.endsWith('/fulfilled')) {
            dispatch(
              completeRegister({
                contact_info: formData.contact,
                password: confirmData.password,
                password_confirm: confirmData.repeatPassword,
              }),
            ).then((res) => {
              if (res.type.endsWith('/rejected')) {
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
      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleFocus}
          autoComplete="off"
          placeholder="Імʼя"
          fullWidth
          error={!!(errors.firstName && (touched.firstName || formData.firstName))}
          helperText={errors.firstName && (touched.firstName || formData.firstName) ? errors.firstName : ''}
        />

        <TextField
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleFocus}
          autoComplete="off"
          placeholder="Прізвище"
          fullWidth
          error={!!(errors.lastName && (touched.lastName || formData.lastName))}
          helperText={errors.lastName && (touched.lastName || formData.lastName) ? errors.lastName : ''}
        />

        <TextField
          name="contact"
          value={formData.contact}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleFocus}
          autoComplete="off"
          placeholder="Пошта або номер телефону"
          fullWidth
          error={!!(errors.contact && (touched.contact || formData.contact))}
          helperText={errors.contact && (touched.contact || formData.contact) ? errors.contact : ''}
        />

        <FormControlLabel
          control={
            <Checkbox
              name="acceptTerms"
              checked={formData.acceptTerms}
              onChange={handleChange}
            />
          }
          label="Я приймаю умови"
        />

        <Button type="submit" disabled={!formData.acceptTerms} className="w-full mb-2">
          Продовжити
        </Button>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Link to={routes.LOGIN} style={{ color: '#1976d2', textDecoration: 'none' }}>
            <Typography variant="body2" sx={{ '&:hover': { textDecoration: 'underline' } }}>
              Вже зареєстровані?
            </Typography>
          </Link>
        </Box>
      </Box>
    );
  }

  return (
    <Box component="form" onSubmit={handleConfirmSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <TextField
        name="code"
        value={confirmData.code}
        onChange={handleConfirmChange}
        onFocus={handleConfirmFocus}
        onBlur={handleConfirmFocus}
        autoComplete="off"
        placeholder="Код підтвердження"
        fullWidth
        error={!!(confirmErrors.code && (confirmTouched.code || confirmData.code))}
        helperText={confirmErrors.code && (confirmTouched.code || confirmData.code) ? confirmErrors.code : ''}
      />

      <TextField
        type="password"
        name="password"
        value={confirmData.password}
        onChange={handleConfirmChange}
        onFocus={handleConfirmFocus}
        onBlur={handleConfirmFocus}
        autoComplete="off"
        placeholder="Пароль"
        fullWidth
        error={!!(confirmErrors.password && (confirmTouched.password || confirmData.password))}
        helperText={confirmErrors.password && (confirmTouched.password || confirmData.password) ? confirmErrors.password : ''}
      />

      <TextField
        type="password"
        name="repeatPassword"
        value={confirmData.repeatPassword}
        onChange={handleConfirmChange}
        onFocus={handleConfirmFocus}
        onBlur={handleConfirmFocus}
        autoComplete="off"
        placeholder="Повторіть пароль"
        fullWidth
        error={!!(confirmErrors.repeatPassword && (confirmTouched.repeatPassword || confirmData.repeatPassword))}
        helperText={confirmErrors.repeatPassword && (confirmTouched.repeatPassword || confirmData.repeatPassword) ? confirmErrors.repeatPassword : ''}
      />

      <Button type="submit" className="w-full">
        Завершити реєстрацію
      </Button>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
        <Link to={routes.LOGIN} style={{ color: '#1976d2', textDecoration: 'none' }}>
          <Typography variant="body2" sx={{ '&:hover': { textDecoration: 'underline' } }}>
            Вже зареєстровані
          </Typography>
        </Link>
        <MuiButton
          variant="text"
          size="small"
          onClick={handleBack}
          sx={{ color: '#1976d2', textTransform: 'none' }}
        >
          Вказати інші дані
        </MuiButton>
      </Box>
    </Box>
  );
}
