import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

import { zodResolver } from '@hookform/resolvers/zod';
import {
  Box,
  Button,
  Checkbox,
  Container,
  FormControlLabel,
  Paper,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';

import { type RegisterFormData, registerSchema } from '../../common/utils/zod-validation';
import RegisterForm from '../../components/auth/RegisterForm';
import { googleAuth, initialRegister } from '../../redux/auth/authSlice';
import type { AppDispatch, RootState } from '../../redux/store';
import { routes } from '../../routes';

export default function RegisterPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      contact: '',
      acceptTerms: true,
    },
  });

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { loading, error, registerStep, user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (user) {
      navigate(routes.HOME);
    }
  }, [user, navigate]);

  // Тимчасово відключимо перенаправлення, щоб показувати форму підтвердження на тій же сторінці
  // useEffect(() => {
  //   if (registerStep === 'verify' && contactInfo) {
  //     if (contactInfo.type === 'email') {
  //       navigate(routes.EMAIL_CONFIRMATION);
  //     } else {
  //       navigate(routes.PHONE_CONFIRMATION);
  //     }
  //   }
  // }, [registerStep, contactInfo, navigate]);

  const onSubmit = (data: RegisterFormData) => {
    dispatch(
      initialRegister({
        first_name: data.firstName,
        last_name: data.lastName,
        contact_info: {
          type: data.contact.includes('@') ? 'email' : 'phone',
          value: data.contact,
        } as { type: 'email' | 'phone'; value: string },
      }),
    );
  };

  // Якщо потрібно підтвердження, показуємо форму підтвердження з таким самим дизайном
  if (registerStep === 'verify' || registerStep === 'complete') {
    if (isMobile) {
      return (
        <Box
          sx={{
            minHeight: '100vh',
            background: 'linear-gradient(to bottom, #3b82f6, #2563eb)',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
          }}
        >
          {/* Frame 768 as background */}
          <Box
            sx={{
              position: 'absolute',
              top: 16,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 384,
              height: 320,
              backgroundImage: `url('/assets/Frame 768.png')`,
              backgroundSize: 'contain',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              zIndex: 0,
            }}
          />

          {/* Content */}
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', p: 3, zIndex: 10 }}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: '16px 16px 0 0',
                backgroundColor: 'white',
                maxHeight: '85vh',
                overflow: 'auto',
              }}
            >
              <Typography
                variant="h4"
                component="h1"
                textAlign="center"
                fontWeight="bold"
                color="text.primary"
                mb={3}
                sx={{ fontSize: '22px' }}
              >
                Підтвердження реєстрації
              </Typography>

              <RegisterForm />
            </Paper>
          </Box>
        </Box>
      );
    }

    // Desktop version for confirmation
    return (
      <Box sx={{ minHeight: '100vh', height: '100vh', display: 'flex', overflow: 'hidden' }}>
        {/* Left side - Form */}
        <Box
          sx={{
            width: { md: '50%' },
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            p: 4,
            position: 'relative',
            bgcolor: 'white',
          }}
        >
          <img
            src="/assets/images/Logo2.png"
            alt="Logo"
            style={{
              position: 'absolute',
              top: 16,
              left: 16,
              height: 80,
              cursor: 'pointer',
              zIndex: 50,
            }}
            onClick={() => navigate(routes.HOME)}
          />

          <Container maxWidth="sm">
            <Typography variant="h3" component="h1" textAlign="center" fontWeight="bold" color="text.primary" mb={4}>
              Підтвердження реєстрації
            </Typography>

            <RegisterForm />
          </Container>
        </Box>

        {/* Right side - Blue gradient with illustration */}
        <Box
          sx={{
            width: { md: '50%' },
            display: { xs: 'none', md: 'flex' },
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
            position: 'relative',
            p: 4,
          }}
        >
          <Box
            component="img"
            src="/assets/images/Register.png"
            alt="Register illustration"
            sx={{
              maxWidth: '80%',
              height: 'auto',
              objectFit: 'contain',
            }}
          />
        </Box>
      </Box>
    );
  }

  if (isMobile) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(to bottom, #3b82f6, #2563eb)',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
        }}
      >
        {/* Frame 768 as background */}
        <Box
          sx={{
            position: 'absolute',
            top: 16,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 384,
            height: 320,
            backgroundImage: `url('/assets/Frame 768.png')`,
            backgroundSize: 'contain',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            zIndex: 0,
          }}
        />

        {/* Content */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', p: 3, zIndex: 10 }}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: '16px 16px 0 0',
              backgroundColor: 'white',
              maxHeight: '85vh',
              overflow: 'auto',
            }}
          >
            <Typography
              variant="h4"
              component="h1"
              textAlign="center"
              fontWeight="bold"
              color="text.primary"
              mb={3}
              sx={{ fontSize: '22px' }}
            >
              Зареєструватися в Turbosell
            </Typography>

            <Box component="form" onSubmit={handleSubmit(onSubmit)}>
              <TextField
                fullWidth
                label="Ім'я"
                margin="normal"
                error={!!errors.firstName}
                helperText={errors.firstName?.message}
                {...register('firstName')}
                sx={{ mb: 1 }}
              />

              <TextField
                fullWidth
                label="Прізвище"
                margin="normal"
                error={!!errors.lastName}
                helperText={errors.lastName?.message}
                {...register('lastName')}
                sx={{ mb: 1 }}
              />

              <TextField
                fullWidth
                label="Телефон або e-mail"
                margin="normal"
                error={!!errors.contact}
                helperText={errors.contact?.message}
                {...register('contact')}
                sx={{ mb: 1 }}
              />

              <FormControlLabel
                control={<Checkbox {...register('acceptTerms')} color="primary" size="small" />}
                label={
                  <Typography variant="body2" color="text.secondary">
                    Я приймаю{' '}
                    <Link to="/terms">
                      <Typography component="span" variant="body2" color="primary">
                        Умови використання
                      </Typography>
                    </Link>{' '}
                    та{' '}
                    <Link to="/privacy">
                      <Typography component="span" variant="body2" color="primary">
                        Політику конфіденційності
                      </Typography>
                    </Link>
                  </Typography>
                }
                sx={{ mb: 1, alignItems: 'flex-start' }}
              />
              {errors.acceptTerms && (
                <Typography variant="caption" color="error" display="block" mb={1}>
                  {errors.acceptTerms.message}
                </Typography>
              )}

              {error && (
                <Paper sx={{ p: 2, mb: 2, bgcolor: 'error.50', border: 1, borderColor: 'error.200' }}>
                  <Typography variant="body2" color="error">
                    {error}
                  </Typography>
                </Paper>
              )}

              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading}
                size="large"
                sx={{ mb: 3, py: 1.5, textTransform: 'none' }}
              >
                {loading ? 'Реєструємося...' : 'Зареєструватися'}
              </Button>

              <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || ''}>
                <GoogleLogin
                  onSuccess={(credentialResponse: { credential?: string }) => {
                    if (credentialResponse.credential) {
                      dispatch(googleAuth(credentialResponse.credential));
                    }
                  }}
                  onError={() => {}}
                  render={(renderProps: { onClick: () => void; disabled: boolean }) => (
                    <Button
                      onClick={renderProps.onClick}
                      disabled={renderProps.disabled}
                      variant="outlined"
                      fullWidth
                      startIcon={
                        <img
                          src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                          alt="Google"
                          style={{ width: 20, height: 20 }}
                        />
                      }
                      sx={{ py: 1.5, textTransform: 'none', mb: 3 }}
                    >
                      Зареєструватися через Google
                    </Button>
                  )}
                />
              </GoogleOAuthProvider>

              <Box textAlign="center" sx={{ mt: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Вже зареєстровані?{' '}
                  <Link to={routes.LOGIN}>
                    <Typography component="span" variant="body2" color="primary" fontWeight="medium">
                      Увійти
                    </Typography>
                  </Link>
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Box>
      </Box>
    );
  }

  // Desktop version
  return (
    <Box sx={{ minHeight: '100vh', height: '100vh', display: 'flex', overflow: 'hidden' }}>
      {/* Left side - Form */}
      <Box
        sx={{
          width: { md: '50%' },
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          p: 4,
          position: 'relative',
          bgcolor: 'white',
        }}
      >
        <img
          src="/assets/images/Logo2.png"
          alt="Logo"
          style={{
            position: 'absolute',
            top: 16,
            left: 16,
            height: 80,
            cursor: 'pointer',
            zIndex: 50,
          }}
          onClick={() => navigate(routes.HOME)}
        />

        <Container maxWidth="sm">
          <Typography variant="h3" component="h1" textAlign="center" fontWeight="bold" color="text.primary" mb={4}>
            Зареєструватися в Turbosell
          </Typography>

          <Box component="form" onSubmit={handleSubmit(onSubmit)}>
            <TextField
              fullWidth
              label="Ім'я"
              margin="normal"
              error={!!errors.firstName}
              helperText={errors.firstName?.message}
              {...register('firstName')}
              sx={{ mb: 1 }}
            />

            <TextField
              fullWidth
              label="Прізвище"
              margin="normal"
              error={!!errors.lastName}
              helperText={errors.lastName?.message}
              {...register('lastName')}
              sx={{ mb: 1 }}
            />

            <TextField
              fullWidth
              label="Телефон або e-mail"
              margin="normal"
              error={!!errors.contact}
              helperText={errors.contact?.message}
              {...register('contact')}
              sx={{ mb: 1 }}
            />

            <FormControlLabel
              control={<Checkbox {...register('acceptTerms')} color="primary" />}
              label={
                <Typography variant="body1" color="text.secondary">
                  Я приймаю{' '}
                  <Link to="/terms">
                    <Typography component="span" variant="body1" color="primary">
                      Умови використання
                    </Typography>
                  </Link>{' '}
                  та{' '}
                  <Link to="/privacy">
                    <Typography component="span" variant="body1" color="primary">
                      Політику конфіденційності
                    </Typography>
                  </Link>
                </Typography>
              }
              sx={{ mb: 1, alignItems: 'center' }}
            />
            {errors.acceptTerms && (
              <Typography variant="body2" color="error" display="block" mb={1}>
                {errors.acceptTerms.message}
              </Typography>
            )}

            {error && (
              <Paper sx={{ p: 2, mb: 3, bgcolor: 'error.50', border: 1, borderColor: 'error.200' }}>
                <Typography color="error">{error}</Typography>
              </Paper>
            )}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              size="large"
              sx={{ mb: 3, py: 1.5, textTransform: 'none' }}
            >
              {loading ? 'Реєструємося...' : 'Зареєструватися'}
            </Button>

            <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || ''}>
              <GoogleLogin
                onSuccess={(credentialResponse: { credential?: string }) => {
                  if (credentialResponse.credential) {
                    dispatch(googleAuth(credentialResponse.credential));
                  }
                }}
                onError={() => {}}
                render={(renderProps: { onClick: () => void; disabled: boolean }) => (
                  <Button
                    onClick={renderProps.onClick}
                    disabled={renderProps.disabled}
                    variant="outlined"
                    fullWidth
                    startIcon={
                      <img
                        src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                        alt="Google"
                        style={{ width: 20, height: 20 }}
                      />
                    }
                    sx={{ py: 1.5, textTransform: 'none', mb: 3 }}
                  >
                    Зареєструватися через Google
                  </Button>
                )}
              />
            </GoogleOAuthProvider>

            <Box textAlign="center">
              <Typography variant="body1" color="text.secondary">
                Вже зареєстровані?{' '}
                <Link to={routes.LOGIN}>
                  <Typography component="span" variant="body1" color="primary" fontWeight="medium">
                    Увійти
                  </Typography>
                </Link>
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Right side - Blue gradient with illustration */}
      <Box
        sx={{
          width: { md: '50%' },
          display: { xs: 'none', md: 'flex' },
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
          position: 'relative',
          p: 4,
        }}
      >
        <Box
          component="img"
          src="/assets/images/Register.png"
          alt="Register illustration"
          sx={{
            maxWidth: '80%',
            height: 'auto',
            objectFit: 'contain',
          }}
        />
      </Box>
    </Box>
  );
}
