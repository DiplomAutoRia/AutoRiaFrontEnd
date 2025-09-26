import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { zodResolver } from '@hookform/resolvers/zod';
import GoogleIcon from '@mui/icons-material/Google';
import { Avatar, Box, Button, Checkbox, FormControlLabel, Paper, Stack, TextField, Typography } from '@mui/material';

import { profileSchema } from '../../common/utils/zod-validation';
import { updateUserProfile } from '../../redux/auth/authSlice';
import type { RootState } from '../../redux/store';
import { useAddNotification } from '../notifications/NotificationSystem';

const ProfileSettingsForm: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { notifySystem } = useAddNotification();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      first_name: user?.first_name || '',
      last_name: user?.last_name || '',
      email: user?.email || '',
      phone_number: user?.phone_number || '',
      location: user?.location || '',
    },
  });

  const [newPhoneNumber, setNewPhoneNumber] = useState('');
  const [googleConnected, setGoogleConnected] = useState(false);
  const [notificationSettings, setNotificationSettings] = useState({
    telegram: { enabled: false, value: '' },
    sms: { enabled: false, value: '' },
    email: { enabled: false, value: '' },
  });

  const [mailingSettings, setMailingSettings] = useState({
    informational: true,
    purchaseHelp: true,
    autoNews: true,
    newOffers: true,
    carReviews: true,
  });

  const onSubmit = async (data: any) => {
    try {
      await dispatch(updateUserProfile(data) as any);
      // Додаємо нотифікацію про успішне оновлення профілю
      notifySystem('Профіль оновлено', 'Ваш профіль успішно оновлено');
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  const handleAddPhoneNumber = () => {
    if (newPhoneNumber.trim()) {
      // This would need to be handled with setValue from react-hook-form
      setNewPhoneNumber('');
    }
  };

  const handleToggleGoogleConnection = () => {
    setGoogleConnected((prev) => !prev);
  };

  const handleNotificationToggle = (type: keyof typeof notificationSettings) => {
    setNotificationSettings((prev) => ({
      ...prev,
      [type]: { ...prev[type], enabled: !prev[type].enabled },
    }));
  };

  const handleNotificationInputChange = (type: keyof typeof notificationSettings, value: string) => {
    setNotificationSettings((prev) => ({
      ...prev,
      [type]: { ...prev[type], value },
    }));
  };

  const handleMailingToggle = (type: keyof typeof mailingSettings) => {
    setMailingSettings((prev) => ({
      ...prev,
      [type]: !prev[type],
    }));
  };

  return (
    <>
      <Paper elevation={1} sx={{ borderRadius: 0, p: 3, position: 'relative' }}>
        {/* Header with Change Password button in top right corner */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            Налаштування профілю
          </Typography>
          <Button variant="outlined" size="small" sx={{ borderRadius: 0 }} onClick={() => navigate('/reset-password')}>
            Змінити пароль
          </Button>
        </Box>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Avatar and User Info Section - in a row aligned to left */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 4 }}>
            <Avatar
              sx={{
                width: 80,
                height: 80,
                bgcolor: 'primary.main',
                fontSize: '2rem',
                flexShrink: 0,
              }}
            >
              {user?.first_name?.[0]?.toUpperCase()}
              {user?.last_name?.[0]?.toUpperCase()}
            </Avatar>

            <Box>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                {user?.first_name} {user?.last_name}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                {user?.email || user?.phone_number}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Рейтинг: 4.8/5
              </Typography>
            </Box>
          </Box>

          <Button
            variant="outlined"
            size="small"
            sx={{ borderRadius: 0, mb: 2 }}
            onClick={() => {
              /* Handle photo change */
            }}
          >
            Змінити фото
          </Button>

          {/* Form Fields - Two separate blocks: labels on left, inputs centered */}
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4 }}>
            {/* Left block - Labels aligned to left */}
            <Box sx={{ minWidth: 120 }}>
              <Stack spacing={2} sx={{ height: '100%', justifyContent: 'space-around' }}>
                <Typography
                  variant="body2"
                  sx={{ textAlign: 'left', height: '40px', display: 'flex', alignItems: 'center' }}
                >
                  Ім'я:
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ textAlign: 'left', height: '40px', display: 'flex', alignItems: 'center' }}
                >
                  Прізвище:
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ textAlign: 'left', height: '40px', display: 'flex', alignItems: 'center' }}
                >
                  По батькові:
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ textAlign: 'left', height: '40px', display: 'flex', alignItems: 'center' }}
                >
                  Область:
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ textAlign: 'left', height: '40px', display: 'flex', alignItems: 'center' }}
                >
                  Місто/Село:
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ textAlign: 'left', height: '40px', display: 'flex', alignItems: 'center' }}
                >
                  E-mail:
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ textAlign: 'left', height: '40px', display: 'flex', alignItems: 'center' }}
                >
                  Телефон:
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ textAlign: 'left', height: '40px', display: 'flex', alignItems: 'center' }}
                >
                  Новий номер:
                </Typography>
              </Stack>
            </Box>

            {/* Right block - Inputs centered */}
            <Box sx={{ flex: 1, maxWidth: 300 }}>
              <Stack spacing={2}>
                <TextField
                  {...register('first_name')}
                  fullWidth
                  size="small"
                  error={!!errors.first_name}
                  helperText={errors.first_name?.message}
                  sx={{ borderRadius: 0 }}
                />
                <TextField
                  {...register('last_name')}
                  fullWidth
                  size="small"
                  error={!!errors.last_name}
                  helperText={errors.last_name?.message}
                  sx={{ borderRadius: 0 }}
                />
                <TextField fullWidth size="small" name="middle_name" defaultValue="" sx={{ borderRadius: 0 }} />
                <TextField fullWidth size="small" name="region" defaultValue="" sx={{ borderRadius: 0 }} />
                <TextField
                  {...register('location')}
                  fullWidth
                  size="small"
                  error={!!errors.location}
                  helperText={errors.location?.message}
                  sx={{ borderRadius: 0 }}
                />
                <TextField
                  {...register('email')}
                  fullWidth
                  size="small"
                  type="email"
                  error={!!errors.email}
                  helperText={errors.email?.message}
                  sx={{ borderRadius: 0 }}
                />
                <TextField
                  {...register('phone_number')}
                  fullWidth
                  size="small"
                  error={!!errors.phone_number}
                  helperText={errors.phone_number?.message}
                  sx={{ borderRadius: 0 }}
                />
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                  <TextField
                    fullWidth
                    size="small"
                    value={newPhoneNumber}
                    onChange={(e) => setNewPhoneNumber(e.target.value)}
                    sx={{ borderRadius: 0 }}
                  />
                  <Button
                    variant="outlined"
                    size="small"
                    sx={{
                      borderRadius: 0,
                      minWidth: '120px',
                      height: '40px',
                    }}
                    onClick={handleAddPhoneNumber}
                  >
                    Додати номер
                  </Button>
                </Box>
              </Stack>
            </Box>
          </Box>

          {/* Save Button */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <Button type="submit" variant="contained" size="small" sx={{ borderRadius: 0, minWidth: '200px' }}>
              Зберегти зміни
            </Button>
          </Box>
        </form>
      </Paper>

      {/* Quick Authorization Block - moved to separate block below profile settings */}
      <Paper elevation={1} sx={{ borderRadius: 0, p: 3, mt: 3 }}>
        <Box sx={{ textAlign: 'left' }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: 'black' }}>
            Швидка авторизація без зайвих дій
          </Typography>
          <Button
            variant={googleConnected ? 'outlined' : 'contained'}
            size="medium"
            startIcon={<GoogleIcon />}
            sx={{
              borderRadius: 0,
              fontWeight: 'bold',
              fontSize: '1rem',
              py: 1,
              px: 3,
              backgroundColor: googleConnected ? 'white' : '#4285F4',
              color: googleConnected ? '#4285F4' : 'white',
              borderColor: '#4285F4',
              '&:hover': {
                backgroundColor: googleConnected ? '#f5f5f5' : '#357ae8',
                borderColor: '#4285F4',
              },
            }}
            onClick={handleToggleGoogleConnection}
          >
            {googleConnected ? 'Відключити Google' : 'Підключити Google'}
          </Button>
        </Box>
      </Paper>

      {/* Notification Details Block */}
      <Paper elevation={1} sx={{ borderRadius: 0, p: 3, mt: 3 }}>
        <Box sx={{ textAlign: 'left' }}>
          <Typography variant="h6" sx={{ mb: 1, fontWeight: 'bold', color: 'black' }}>
            Реквізити для повідомлень
          </Typography>
          <Typography variant="body2" sx={{ mb: 3, color: 'text.secondary' }}>
            Ми надсилатимемо сповіщення про ваші оголошення та важливі події на ці контактні дані. Вони не будуть видимі
            іншим користувачам
          </Typography>

          <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
            <Box sx={{ minWidth: 120 }}>
              <Stack spacing={2} sx={{ height: '100%', justifyContent: 'space-around' }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={notificationSettings.telegram.enabled}
                      onChange={() => handleNotificationToggle('telegram')}
                    />
                  }
                  label="Telegram"
                  sx={{ height: '40px', display: 'flex', alignItems: 'center' }}
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={notificationSettings.sms.enabled}
                      onChange={() => handleNotificationToggle('sms')}
                    />
                  }
                  label="SMS"
                  sx={{ height: '40px', display: 'flex', alignItems: 'center' }}
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={notificationSettings.email.enabled}
                      onChange={() => handleNotificationToggle('email')}
                    />
                  }
                  label="E-mail"
                  sx={{ height: '40px', display: 'flex', alignItems: 'center' }}
                />
              </Stack>
            </Box>

            <Box sx={{ flex: 1, maxWidth: 300, ml: 4 }}>
              <Stack spacing={2}>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="@username"
                  value={notificationSettings.telegram.value}
                  onChange={(e) => handleNotificationInputChange('telegram', e.target.value)}
                  disabled={!notificationSettings.telegram.enabled}
                  sx={{ borderRadius: 0 }}
                />
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Номер телефону"
                  value={notificationSettings.sms.value}
                  onChange={(e) => handleNotificationInputChange('sms', e.target.value)}
                  disabled={!notificationSettings.sms.enabled}
                  sx={{ borderRadius: 0 }}
                />
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Email адреса"
                  type="email"
                  value={notificationSettings.email.value}
                  onChange={(e) => handleNotificationInputChange('email', e.target.value)}
                  disabled={!notificationSettings.email.enabled}
                  sx={{ borderRadius: 0 }}
                />
              </Stack>
            </Box>
          </Box>
        </Box>
      </Paper>

      {/* Mailing Block */}
      <Paper elevation={1} sx={{ borderRadius: 0, p: 3, mt: 3 }}>
        <Box sx={{ textAlign: 'left' }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: 'black' }}>
            Розсилки
          </Typography>

          <Stack spacing={3}>
            <Box>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={mailingSettings.informational}
                    onChange={() => handleMailingToggle('informational')}
                    sx={{
                      '& .MuiSvgIcon-root': {
                        fontSize: 20,
                        transform: 'scale(1.5)',
                      },
                    }}
                  />
                }
                label="Інформаційні сповіщення"
                sx={{ alignItems: 'flex-start' }}
              />
              <Typography variant="body2" sx={{ ml: 7, mt: 0.2, color: 'text.secondary' }}>
                Про акції, нові сервіси та зміни в їх роботі
              </Typography>
            </Box>

            <Box>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={mailingSettings.purchaseHelp}
                    onChange={() => handleMailingToggle('purchaseHelp')}
                    sx={{
                      '& .MuiSvgIcon-root': {
                        fontSize: 20,
                        transform: 'scale(1.5)',
                      },
                    }}
                  />
                }
                label="Допомога при купівлі"
                sx={{ alignItems: 'flex-start' }}
              />
              <Typography variant="body2" sx={{ ml: 7, mt: 0.2, color: 'text.secondary' }}>
                Повідомлення про зниження ціни, відповіді на коментарі, торг та обмін. А також інформація по заявкам на
                замовлення авто, trade-in та тест-драйв
              </Typography>
            </Box>

            <Box>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={mailingSettings.autoNews}
                    onChange={() => handleMailingToggle('autoNews')}
                    sx={{
                      '& .MuiSvgIcon-root': {
                        fontSize: 20,
                        transform: 'scale(1.5)',
                      },
                    }}
                  />
                }
                label="Автоновини"
                sx={{ alignItems: 'flex-start' }}
              />
              <Typography variant="body2" sx={{ ml: 7, mt: 0.2, color: 'text.secondary' }}>
                Онлайн-журнал, новини, поради автомобілям, дослідження Аналітичного центру
              </Typography>
            </Box>

            <Box>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={mailingSettings.newOffers}
                    onChange={() => handleMailingToggle('newOffers')}
                    sx={{
                      '& .MuiSvgIcon-root': {
                        fontSize: 20,
                        transform: 'scale(1.5)',
                      },
                    }}
                  />
                }
                label="Нові пропозиції авто"
                sx={{ alignItems: 'flex-start' }}
              />
              <Typography variant="body2" sx={{ ml: 7, mt: 0.2, color: 'text.secondary' }}>
                Свіжододані авто з пробігом за заданими вами параметрами
              </Typography>
            </Box>

            <Box>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={mailingSettings.carReviews}
                    onChange={() => handleMailingToggle('carReviews')}
                    sx={{
                      '& .MuiSvgIcon-root': {
                        fontSize: 20,
                        transform: 'scale(1.5)',
                      },
                    }}
                  />
                }
                label="Відгуки про автомобіль"
                sx={{ alignItems: 'flex-start' }}
              />
              <Typography variant="body2" sx={{ ml: 7, mt: 0.2, color: 'text.secondary' }}>
                Відгуки власників про марки/моделі, що вас цікавлять
              </Typography>
            </Box>
          </Stack>
        </Box>
      </Paper>
    </>
  );
};

export default ProfileSettingsForm;
