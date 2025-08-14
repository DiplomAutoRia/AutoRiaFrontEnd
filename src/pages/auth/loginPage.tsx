import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

import { zodResolver } from '@hookform/resolvers/zod';
import { Alert, Box, Button, CircularProgress, Container, Divider, TextField, Typography } from '@mui/material';
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
    <Container
      maxWidth="sm"
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'grey.100',
        py: 5,
      }}
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: 400,
          backgroundColor: 'white',
          p: 4,
          borderRadius: 2,
          boxShadow: 3,
        }}
      >
        <Typography
          variant="h4"
          component="h2"
          sx={{
            textAlign: 'center',
            mb: 3,
            fontWeight: 'bold',
          }}
        >
          Вхід
        </Typography>

        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'center' }}>
          <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || ''}>
            <GoogleLogin
              onSuccess={(credentialResponse: { credential?: string }) => {
                if (credentialResponse.credential) {
                  dispatch(googleAuth(credentialResponse.credential));
                }
              }}
              onError={() => {}}
            />
          </GoogleOAuthProvider>
        </Box>

        <Box sx={{ position: 'relative', mb: 3 }}>
          <Divider />
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              backgroundColor: 'white',
              px: 1,
            }}
          >
            <Typography variant="body2" color="text.secondary">
              або
            </Typography>
          </Box>
        </Box>

        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          <Box sx={{ mb: 2 }}>
            <TextField
              fullWidth
              type="text"
              placeholder="Введіть email або телефон (+380XXXXXXXXX)"
              error={!!errors.contact}
              helperText={errors.contact?.message}
              {...register('contact')}
              sx={{ mb: 1 }}
            />
          </Box>

          <Box sx={{ mb: 2 }}>
            <TextField
              fullWidth
              type="password"
              placeholder="Введіть пароль"
              error={!!errors.password}
              helperText={errors.password?.message}
              {...register('password')}
              sx={{ mb: 1 }}
            />
          </Box>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={loading}
            sx={{
              py: 1.5,
              mb: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {loading && (
              <CircularProgress
                size={20}
                sx={{
                  color: 'white',
                  mr: 1,
                }}
              />
            )}
            {loading ? 'Завантаження...' : 'Увійти'}
          </Button>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2">
              <Link
                to="/register"
                style={{
                  color: '#1976d2',
                  textDecoration: 'none',
                }}
              >
                Немає акаунту? Зареєструватись
              </Link>
            </Typography>
          </Box>
        </Box>
      </Box>
    </Container>
  );
}
