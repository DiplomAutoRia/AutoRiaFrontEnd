import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

import { zodResolver } from '@hookform/resolvers/zod';
import { Phone, Visibility, VisibilityOff } from '@mui/icons-material';
import {
  Box,
  Button,
  Checkbox,
  Container,
  Divider,
  FormControlLabel,
  IconButton,
  InputAdornment,
  Paper,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
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

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { loading, error, user } = useSelector((state: RootState) => state.auth);
  const [showPhoneForm, setShowPhoneForm] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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
        {/* Frame 767 as background */}
        <Box
          sx={{
            position: 'absolute',
            top: 16,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 384,
            height: 320,
            backgroundImage: `url('/assets/Frame 767.png')`,
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
            {showPhoneForm ? (
              <PhoneLoginForm onBack={() => setShowPhoneForm(false)} />
            ) : (
              <>
                <Typography
                  variant="h4"
                  component="h1"
                  textAlign="center"
                  fontWeight="bold"
                  color="text.primary"
                  mb={1}
                >
                  Увійти в Turbosell
                </Typography>

                <Typography variant="body2" textAlign="center" color="text.secondary" mb={3}>
                  Купуйте й продавайте авто онлайн
                </Typography>

                <Stack spacing={2} mb={3}>
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
                          sx={{ py: 1.5, textTransform: 'none' }}
                        >
                          Увійти через Google
                        </Button>
                      )}
                    />
                  </GoogleOAuthProvider>

                  <Button
                    variant="outlined"
                    fullWidth
                    startIcon={<Phone />}
                    onClick={() => setShowPhoneForm(true)}
                    sx={{ py: 1.5, textTransform: 'none' }}
                  >
                    Увійти через номер телефону
                  </Button>
                </Stack>

                <Divider sx={{ my: 3 }}>
                  <Typography variant="caption" color="text.secondary">
                    Або
                  </Typography>
                </Divider>

                <Box component="form" onSubmit={handleSubmit(onSubmit)}>
                  <TextField
                    fullWidth
                    label="Телефон або e-mail"
                    margin="normal"
                    error={!!errors.contact}
                    helperText={errors.contact?.message}
                    {...register('contact')}
                    sx={{ mb: 1 }}
                  />

                  <TextField
                    fullWidth
                    label="Пароль"
                    type={showPassword ? 'text' : 'password'}
                    margin="normal"
                    error={!!errors.password}
                    helperText={errors.password?.message}
                    {...register('password')}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    sx={{ mb: 1 }}
                  />

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <FormControlLabel
                      control={<Checkbox size="small" />}
                      label={<Typography variant="body2">Запам'ятати мене</Typography>}
                    />
                    <Link to={routes.FORGOT_PASSWORD}>
                      <Typography variant="body2" color="primary">
                        Забули пароль?
                      </Typography>
                    </Link>
                  </Box>

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
                    sx={{ mb: 2, py: 1.5, textTransform: 'none' }}
                  >
                    {loading ? 'Входимо...' : 'Увійти'}
                  </Button>

                  <Box textAlign="center">
                    <Link to={routes.REGISTER}>
                      <Typography variant="body2" color="primary">
                        Зареєструватися
                      </Typography>
                    </Link>
                  </Box>

                  <Typography variant="caption" textAlign="center" color="text.secondary" display="block" mt={2}>
                    Під час входу ви погоджуєтеся з нашими{' '}
                    <Link to="/terms">
                      <Typography component="span" variant="caption" color="primary">
                        Умовами користування
                      </Typography>
                    </Link>
                  </Typography>
                </Box>
              </>
            )}
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
          {showPhoneForm ? (
            <PhoneLoginForm onBack={() => setShowPhoneForm(false)} />
          ) : (
            <>
              <Typography variant="h3" component="h1" textAlign="center" fontWeight="bold" color="text.primary" mb={1}>
                Увійти в Turbosell
              </Typography>

              <Typography variant="h6" textAlign="center" color="text.secondary" mb={4}>
                Купуйте й продавайте авто онлайн
              </Typography>

              <Stack spacing={2} mb={4}>
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
                        sx={{ py: 1.5, textTransform: 'none' }}
                      >
                        Вхід через Google
                      </Button>
                    )}
                  />
                </GoogleOAuthProvider>

                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<Phone />}
                  onClick={() => setShowPhoneForm(true)}
                  sx={{ py: 1.5, textTransform: 'none' }}
                >
                  Увійти через номер
                </Button>
              </Stack>

              <Divider sx={{ my: 4 }}>
                <Typography variant="body2" color="text.secondary">
                  або
                </Typography>
              </Divider>

              <Box component="form" onSubmit={handleSubmit(onSubmit)}>
                <TextField
                  fullWidth
                  label="Телефон або e-mail"
                  margin="normal"
                  error={!!errors.contact}
                  helperText={errors.contact?.message}
                  {...register('contact')}
                  sx={{ mb: 1 }}
                />

                <TextField
                  fullWidth
                  label="Пароль"
                  type={showPassword ? 'text' : 'password'}
                  margin="normal"
                  error={!!errors.password}
                  helperText={errors.password?.message}
                  {...register('password')}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{ mb: 1 }}
                />

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <FormControlLabel control={<Checkbox />} label="Запам'ятати мене" />
                  <Link to={routes.FORGOT_PASSWORD}>
                    <Typography color="primary">Забули пароль?</Typography>
                  </Link>
                </Box>

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
                  {loading ? 'Входимо...' : 'Увійти'}
                </Button>

                <Box textAlign="center">
                  <Link to={routes.REGISTER}>
                    <Typography color="primary">Зареєструватися</Typography>
                  </Link>
                </Box>

                <Typography variant="caption" textAlign="center" color="text.secondary" display="block" mt={2}>
                  Під час входу ви погоджуєтеся з нашими{' '}
                  <Link to="/terms">
                    <Typography component="span" variant="caption" color="primary">
                      Умовами користування
                    </Typography>
                  </Link>
                </Typography>
              </Box>
            </>
          )}
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
          src="/assets/images/Login.png"
          alt="Login illustration"
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
