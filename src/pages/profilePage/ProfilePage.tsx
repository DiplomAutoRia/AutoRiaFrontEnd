import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import CloseIcon from '@mui/icons-material/Close';
import {
  Avatar,
  Box,
  Button,
  Chip,
  Container,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  Stack,
  Typography,
} from '@mui/material';

import ChangePasswordForm from '../../components/profile/ChangePasswordForm';
import ProfileEditForm from '../../components/profile/ProfileEditForm';
import type { RootState } from '../../redux/store';
import { routes } from '../../routes';

export default function ProfilePage() {
  const { user } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  const [showEditForm, setShowEditForm] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  const handleEditProfile = () => setShowEditForm(true);
  const handleMyListings = () => navigate(routes.MY_VEHICLES);
  const handleFavorites = () => navigate(routes.FAVORITES);
  const handleSettings = () => alert('Налаштування будуть доступні незабаром');
  const handleChangePassword = () => setShowPasswordForm(true);
  const handleDeleteAccount = () => {
    if (window.confirm('Ви впевнені, що хочете видалити свій акаунт? Цю дію неможливо скасувати.')) {
      alert('Функція видалення акаунта буде доступна незабаром');
    }
  };

  if (!user) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1 }}>
            Профіль недоступний
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Будь ласка, увійдіть до системи
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <>
      <Container maxWidth="sm" sx={{ py: 1 }}>
        <Paper elevation={2} sx={{ borderRadius: 2 }}>
          <Box sx={{ background: 'linear-gradient(45deg, #3f51b5 30%, #9c27b0 90%)', p: 1.5, color: 'white' }}>
            <Stack direction="row" alignItems="center" spacing={1.5}>
              <Avatar sx={{ width: 48, height: 48, bgcolor: 'white', color: 'primary.main', fontSize: '1.2rem' }}>
                {user.first_name?.[0]?.toUpperCase()}
                {user.last_name?.[0]?.toUpperCase()}
              </Avatar>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 0.2 }}>
                  {user.first_name} {user.last_name}
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', mb: 0.3 }}>
                  {user.email || user.phone_number}
                </Typography>
                <Chip
                  label={user.is_verified ? 'Верифікований' : 'Не верифікований'}
                  color={user.is_verified ? 'success' : 'warning'}
                  size="small"
                />
              </Box>
            </Stack>
          </Box>

          <Box sx={{ p: 1.5 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
              Особиста інформація
            </Typography>
            <Stack direction="row" spacing={2} flexWrap="wrap" sx={{ mb: 1.5 }}>
              <Box sx={{ minWidth: 100 }}>
                <Typography variant="caption" color="text.secondary">
                  Ім'я
                </Typography>
                <Typography variant="body2">{user.first_name}</Typography>
              </Box>
              <Box sx={{ minWidth: 100 }}>
                <Typography variant="caption" color="text.secondary">
                  Прізвище
                </Typography>
                <Typography variant="body2">{user.last_name}</Typography>
              </Box>
              {user.email && (
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Email
                  </Typography>
                  <Typography variant="body2">{user.email}</Typography>
                </Box>
              )}
              {user.phone_number && (
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Телефон
                  </Typography>
                  <Typography variant="body2">{user.phone_number}</Typography>
                </Box>
              )}
            </Stack>

            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
              Статистика
            </Typography>
            <Stack direction="row" spacing={1} sx={{ mb: 1.5 }}>
              <Paper sx={{ p: 1, textAlign: 'center', bgcolor: 'grey.50', flex: 1 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  0
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Оголошень
                </Typography>
              </Paper>
              <Paper sx={{ p: 1, textAlign: 'center', bgcolor: 'grey.50', flex: 1 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  0
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Улюблених
                </Typography>
              </Paper>
            </Stack>

            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
              Дії
            </Typography>
            <Stack spacing={0.5} sx={{ mb: 1.5 }}>
              <Button onClick={handleEditProfile} variant="contained" size="small" fullWidth>
                Редагувати профіль
              </Button>
              <Button onClick={handleMyListings} variant="outlined" size="small" fullWidth>
                Мої оголошення
              </Button>
              <Button onClick={handleFavorites} variant="outlined" size="small" fullWidth>
                Улюблені
              </Button>
              <Button onClick={handleSettings} variant="outlined" size="small" fullWidth>
                Налаштування
              </Button>
            </Stack>

            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
              Безпека
            </Typography>
            <Stack spacing={0.5}>
              <Button onClick={handleChangePassword} variant="contained" color="warning" size="small" fullWidth>
                Змінити пароль
              </Button>
              <Button onClick={handleDeleteAccount} variant="contained" color="error" size="small" fullWidth>
                Видалити акаунт
              </Button>
            </Stack>
          </Box>
        </Paper>
      </Container>

      <Dialog open={showEditForm} onClose={() => setShowEditForm(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ p: 1.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            Редагувати профіль
          </Typography>
          <IconButton onClick={() => setShowEditForm(false)} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 1.5 }}>
          <ProfileEditForm
            user={user}
            onSuccess={() => setShowEditForm(false)}
            onCancel={() => setShowEditForm(false)}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={showPasswordForm} onClose={() => setShowPasswordForm(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ p: 1.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            Змінити пароль
          </Typography>
          <IconButton onClick={() => setShowPasswordForm(false)} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 1.5 }}>
          <ChangePasswordForm
            onSuccess={() => setShowPasswordForm(false)}
            onCancel={() => setShowPasswordForm(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
