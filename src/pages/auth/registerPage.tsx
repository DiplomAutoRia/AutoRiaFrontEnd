import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

import {
  Box,
  Button,
  Checkbox,
  Container,
  Divider,
  FormControlLabel,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
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
  };

  const handleBack = () => {
    dispatch(resetRegister());
  };

  return (
    <Container
      maxWidth={false}
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'grey.100',
        py: 5,
      }}
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: 400,
          bgcolor: 'white',
          p: 4,
          borderRadius: 2,
          boxShadow: 3,
        }}
      >
        <Typography variant="h4" component="h2" textAlign="center" mb={3} fontWeight="bold">
          Реєстрація
        </Typography>

        <Box display="flex" justifyContent="center" mb={3}>
          <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
            <GoogleLogin
              onSuccess={(credentialResponse: CredentialResponse) => {
                if (credentialResponse.credential) {
                  dispatch(googleAuth(credentialResponse.credential));
                }
              }}
              onError={() => {}}
              useOneTap
            />
          </GoogleOAuthProvider>
        </Box>

        <Box position="relative" mb={3}>
          <Divider>
            <Typography variant="body2" color="text.secondary">
              або
            </Typography>
          </Divider>
        </Box>
        {registerStep === 'initial' ? (
          <Box component="form" onSubmit={handleSubmit}>
            <Stack spacing={2}>
              <TextField
                type="text"
                name="firstName"
                placeholder="Імʼя"
                value={formData.firstName}
                onChange={handleChange}
                onFocus={handleFocus}
                onBlur={handleFocus}
                autoComplete="off"
                error={!!(errors.firstName && (touched.firstName || formData.firstName))}
                helperText={errors.firstName && (touched.firstName || formData.firstName) && errors.firstName}
                fullWidth
                variant="outlined"
              />

              <TextField
                type="text"
                name="lastName"
                placeholder="Прізвище"
                value={formData.lastName}
                onChange={handleChange}
                onFocus={handleFocus}
                onBlur={handleFocus}
                autoComplete="off"
                error={!!(errors.lastName && (touched.lastName || formData.lastName))}
                helperText={errors.lastName && (touched.lastName || formData.lastName) && errors.lastName}
                fullWidth
                variant="outlined"
              />
              <TextField
                type="text"
                name="contact"
                placeholder="Пошта або номер телефону"
                value={formData.contact}
                onChange={handleChange}
                onFocus={handleFocus}
                onBlur={handleFocus}
                autoComplete="off"
                error={!!(errors.contact && (touched.contact || formData.contact))}
                helperText={errors.contact && (touched.contact || formData.contact) && errors.contact}
                fullWidth
                variant="outlined"
              />

              <FormControlLabel
                control={<Checkbox name="acceptTerms" checked={formData.acceptTerms} onChange={handleChange} />}
                label={
                  <Typography variant="body2" color="text.primary">
                    Я приймаю умови
                  </Typography>
                }
              />

              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={!formData.acceptTerms}
                fullWidth
                sx={{ py: 1.5, mb: 1 }}
              >
                Продовжити
              </Button>

              <Box display="flex" justifyContent="flex-end">
                <Link to="/login" style={{ textDecoration: 'none' }}>
                  <Typography variant="body2" color="primary" sx={{ '&:hover': { textDecoration: 'underline' } }}>
                    Вже зареєстровані?
                  </Typography>
                </Link>
              </Box>
            </Stack>
          </Box>
        ) : (
          <Box component="form" onSubmit={handleConfirmSubmit}>
            <Stack spacing={2}>
              <TextField
                type="text"
                name="code"
                placeholder="Код підтвердження"
                value={confirmData.code}
                onChange={handleConfirmChange}
                onFocus={handleConfirmFocus}
                onBlur={handleConfirmFocus}
                autoComplete="off"
                error={!!(confirmErrors.code && (confirmTouched.code || confirmData.code))}
                helperText={confirmErrors.code && (confirmTouched.code || confirmData.code) && confirmErrors.code}
                fullWidth
                variant="outlined"
              />

              <TextField
                type="password"
                name="password"
                placeholder="Пароль"
                value={confirmData.password}
                onChange={handleConfirmChange}
                onFocus={handleConfirmFocus}
                onBlur={handleConfirmFocus}
                autoComplete="off"
                error={!!(confirmErrors.password && (confirmTouched.password || confirmData.password))}
                helperText={
                  confirmErrors.password && (confirmTouched.password || confirmData.password) && confirmErrors.password
                }
                fullWidth
                variant="outlined"
              />

              <TextField
                type="password"
                name="repeatPassword"
                placeholder="Повторіть пароль"
                value={confirmData.repeatPassword}
                onChange={handleConfirmChange}
                onFocus={handleConfirmFocus}
                onBlur={handleConfirmFocus}
                autoComplete="off"
                error={
                  !!(confirmErrors.repeatPassword && (confirmTouched.repeatPassword || confirmData.repeatPassword))
                }
                helperText={
                  confirmErrors.repeatPassword &&
                  (confirmTouched.repeatPassword || confirmData.repeatPassword) &&
                  confirmErrors.repeatPassword
                }
                fullWidth
                variant="outlined"
              />

              <Button type="submit" variant="contained" color="primary" fullWidth sx={{ py: 1.5 }}>
                Завершити реєстрацію
              </Button>

              <Stack direction="row" justifyContent="space-between" mt={2}>
                <Link to="/login" style={{ textDecoration: 'none' }}>
                  <Typography variant="body2" color="primary" sx={{ '&:hover': { textDecoration: 'underline' } }}>
                    Вже зареєстровані
                  </Typography>
                </Link>
                <Button
                  type="button"
                  variant="text"
                  color="primary"
                  onClick={handleBack}
                  sx={{
                    textTransform: 'none',
                    p: 0,
                    minWidth: 'auto',
                    '&:hover': { textDecoration: 'underline', bgcolor: 'transparent' },
                  }}
                >
                  <Typography variant="body2">Вказати інші дані</Typography>
                </Button>
              </Stack>
            </Stack>
          </Box>
        )}
      </Box>
    </Container>
  );
}
