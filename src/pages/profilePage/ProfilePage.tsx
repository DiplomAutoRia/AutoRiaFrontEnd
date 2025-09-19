import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';

import EditIcon from '@mui/icons-material/Edit';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ArchiveIcon from '@mui/icons-material/Archive';
import DeleteIcon from '@mui/icons-material/Delete';
import MarkAsReadIcon from '@mui/icons-material/MarkEmailRead';
import FavoriteIcon from '@mui/icons-material/Favorite';
import {
  Avatar,
  Box,
  Button,
  Card,
  Checkbox,
  Chip,
  Grid,
  IconButton,
  MenuItem,
  Paper,
  Select,
  Stack,
  Typography,
} from '@mui/material';

import ProfileLayout from '../../components/profile/ProfileLayout';
import UserListingsGrid from '../../components/vehicles/UserListingsGrid';
import UserListingCard from '../../components/vehicles/UserListingCard';
import ProfileSettingsForm from '../../components/profile/ProfileSettingsForm';
import ProfileChat from '../../components/profile/ProfileChat';
import type { RootState } from '../../redux/store';
import { useGetMyVehiclesQuery } from '../../redux/api/vehiclesApi';
import { useGetFavoritesQuery, useRemoveFromFavoritesMutation } from '../../redux/api/favoritesApi';
import { useDeleteVehicleMutation } from '../../redux/api/vehiclesApi';

interface Favorite {
  id: number;
  vehicle: any; // This can be a Vehicle object or a number (ID)
}

interface FavoriteVehicleCardProps {
  favorite: Favorite;
  onRemove: (favoriteId: number) => void;
  onNavigate: (vehicleId: number) => void;
}

const FavoriteVehicleCard: React.FC<FavoriteVehicleCardProps> = ({ favorite, onRemove, onNavigate }) => {
  // The favorite object already contains the full vehicle data
  const vehicle = favorite.vehicle;

  if (!vehicle) {
    return (
      <Paper elevation={0} sx={{ p: 2, border: '1px solid #e0e0e0' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
              Помилка завантаження оголошення
            </Typography>
            <Typography variant="body2" color="text.secondary">
              ID: {favorite.id}
            </Typography>
          </Box>
          <IconButton 
            size="small" 
            onClick={() => onRemove(favorite.id)}
            color="error"
          >
            <FavoriteIcon />
          </IconButton>
        </Box>
      </Paper>
    );
  }

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('uk-UA', {
      style: 'currency',
      currency: currency === 'USD' ? 'USD' : 'UAH',
    }).format(price);
  };

  return (
    <Card 
      sx={{ 
        display: 'flex',
        position: 'relative',
        borderRadius: 0,
        transition: 'all 0.3s ease',
        cursor: 'pointer',
        height: 200,
        '&:hover': {
          boxShadow: 3,
          transform: 'translateY(-2px)'
        }
      }}
      onClick={() => onNavigate(vehicle.id)}
    >
      {/* Remove from favorites icon */}
      <IconButton
        sx={{
          position: 'absolute',
          top: 8,
          right: 8,
          zIndex: 2,
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          '&:hover': {
            backgroundColor: 'white'
          }
        }}
        onClick={(e) => {
          e.stopPropagation();
          onRemove(favorite.id);
        }}
        size="small"
      >
        <FavoriteIcon fontSize="small" />
      </IconButton>

      {/* Image */}
      <Box
        component="img"
        sx={{
          width: 280,
          height: '100%',
          objectFit: 'cover',
          backgroundColor: '#f5f5f5',
          flexShrink: 0
        }}
        src={vehicle.images && vehicle.images.length > 0 
          ? vehicle.images[0].image 
          : '/locales/images/car.png'}
        alt={`${vehicle.brand} ${vehicle.model}`}
      />

      {/* Content */}
      <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, p: 2, gap: 1 }}>
        {/* Brand, model and year in one line */}
        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, flexWrap: 'wrap' }}>
          <Typography 
            variant="h6" 
            component="h3"
            sx={{ 
              fontSize: '1.2rem',
              fontWeight: 'bold',
              lineHeight: 1.2
            }}
          >
            {vehicle.brand} {vehicle.model}
          </Typography>
          <Typography 
            variant="body1" 
            color="text.secondary"
            sx={{ fontSize: '1rem' }}
          >
            {vehicle.year} рік
          </Typography>
        </Box>

        {/* Price */}
        {vehicle.price && (
          <Typography 
            variant="h6" 
            color="primary"
            sx={{ 
              fontSize: '1.3rem',
              fontWeight: 'bold'
            }}
          >
            {formatPrice(vehicle.price, vehicle.currency)}
          </Typography>
        )}

        {/* Details in column */}
        <Stack spacing={0.5}>
          {vehicle.mileage && (
            <Typography variant="body2" sx={{ fontSize: '0.95rem' }}>
              Пробіг: {vehicle.mileage.toLocaleString()} км
            </Typography>
          )}

          {vehicle.fuel_type && (
            <Typography variant="body2" sx={{ fontSize: '0.95rem' }}>
              Паливо: {vehicle.fuel_type}
            </Typography>
          )}

          {vehicle.transmission && (
            <Typography variant="body2" sx={{ fontSize: '0.95rem' }}>
              КП: {vehicle.transmission}
            </Typography>
          )}

          {vehicle.location && (
            <Typography variant="body2" sx={{ fontSize: '0.95rem' }}>
              Місто: {vehicle.location}
            </Typography>
          )}
        </Stack>
      </Box>
    </Card>
  );
};

export default function ProfilePage() {
  const { user } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  const location = useLocation();
  const [activeSection, setActiveSection] = useState('profile');
  const [expandedNotificationId, setExpandedNotificationId] = useState<number | null>(null);
  const [selectedNotifications, setSelectedNotifications] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState(false);

  // Read navigation state to set active section
  React.useEffect(() => {
    if (location.state?.activeSection) {
      setActiveSection(location.state.activeSection);
      // Clear the state to avoid persisting it on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const handleNotificationToggle = (id: number) => {
    setExpandedNotificationId(prevId => prevId === id ? null : id);
  };

  const handleSelectNotification = (id: number) => {
    setSelectedNotifications(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedNotifications([]);
    } else {
      setSelectedNotifications([1, 2, 3]); // IDs of sample notifications
    }
    setSelectAll(!selectAll);
  };

  const handleEditProfile = () => {
    // Will be implemented in ProfileLayout
    alert('Редагування профілю буде доступне незабаром');
  };

  const { data: vehiclesData, isLoading: vehiclesLoading } = useGetMyVehiclesQuery({ 
    page: 1, 
    limit: 3,
  });

  const { data: favoritesData = [], isLoading: favoritesLoading } = useGetFavoritesQuery(undefined, { skip: !user });
  const favorites = favoritesData as Favorite[];
  
  // Debug: log favorites structure to understand the API response
  React.useEffect(() => {
    if (favorites && favorites.length > 0) {
      console.log('Favorites data:', favorites);
      console.log('First favorite structure:', favorites[0]);
      console.log('First favorite vehicle type:', typeof favorites[0].vehicle, favorites[0].vehicle);
    }
  }, [favorites]);
  const [removeFromFavorites] = useRemoveFromFavoritesMutation();
  const [deleteVehicle] = useDeleteVehicleMutation();

  const handleSettingsClick = (vehicleId: number) => {
    navigate(`/vehicles/${vehicleId}/edit`);
  };

  const handleRemoveFavorite = async (favoriteId: number) => {
    try {
      await removeFromFavorites(favoriteId).unwrap();
    } catch (error) {
      console.error('Failed to remove from favorites:', error);
    }
  };

  const handleDeleteVehicle = async (vehicleId: number) => {
    try {
      await deleteVehicle(vehicleId).unwrap();
      // Можна додати оновлення списку або повідомлення
    } catch (error) {
      console.error('Не вдалося видалити оголошення:', error);
    }
  };

  const handleViewAllFavorites = () => {
    setActiveSection('favorites');
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

  const renderProfileContent = () => {
    switch (activeSection) {
      case 'profile':
        return (
          <>
            {/* User info block */}
            <Paper elevation={1} sx={{ borderRadius: 0, p: 3, mb: 3, position: 'relative' }}>
              <IconButton 
                sx={{ position: 'absolute', top: 16, right: 16 }}
                onClick={handleEditProfile}
              >
                <EditIcon />
              </IconButton>
              
              <Grid container spacing={3} alignItems="center">
                <Grid item>
                  <Avatar 
                    sx={{ 
                      width: 80, 
                      height: 80, 
                      bgcolor: 'primary.main',
                      fontSize: '2rem'
                    }}
                  >
                    {user.first_name?.[0]?.toUpperCase()}
                    {user.last_name?.[0]?.toUpperCase()}
                  </Avatar>
                </Grid>
                <Grid item xs={8}>
                  <Stack spacing={1}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                      {user.first_name} {user.last_name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {user.email || user.phone_number}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Рейтинг: 4.8/5
                    </Typography>
                    <Chip
                      label={user.is_verified ? 'Верифікований' : 'Не верифікований'}
                      color={user.is_verified ? 'success' : 'warning'}
                      size="small"
                    />
                  </Stack>
                </Grid>
              </Grid>
            </Paper>

            {/* Active listings block */}
            <Paper elevation={1} sx={{ borderRadius: 0, p: 3, mb: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  Активні оголошення продавця
                </Typography>
                <Stack direction="row" spacing={1}>
                  <Button 
                    variant="outlined" 
                    sx={{ borderRadius: 0 }}
                    onClick={() => setActiveSection('listings')}
                  >
                    Переглянути всі
                  </Button>
                  <Button 
                    variant="contained" 
                    sx={{ borderRadius: 0 }}
                    onClick={() => navigate('/create')}
                  >
                    Створити оголошення
                  </Button>
                </Stack>
              </Box>

              {/* Real user listings */}
              {vehiclesLoading ? (
                <Box sx={{ minHeight: 150, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    Завантаження...
                  </Typography>
                </Box>
              ) : vehiclesData?.results && vehiclesData.results.length > 0 ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {vehiclesData.results.slice(0, 3).map((vehicle) => (
                    <UserListingCard
                      key={vehicle.id}
                      vehicle={vehicle}
                      onSettingsClick={handleSettingsClick}
                    />
                  ))}
                </Box>
              ) : (
                <Box sx={{ minHeight: 150, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    Активних оголошень поки немає
                  </Typography>
                </Box>
              )}
            </Paper>

            {/* Favorites block */}
            <Paper elevation={1} sx={{ borderRadius: 0, p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  Обране
                </Typography>
                <Button 
                  variant="outlined" 
                  sx={{ borderRadius: 0 }}
                  onClick={handleViewAllFavorites}
                >
                  Переглянути всі
                </Button>
              </Box>

              {/* Real favorites */}
              {favoritesLoading ? (
                <Box sx={{ minHeight: 150, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    Завантаження...
                  </Typography>
                </Box>
              ) : favorites.length > 0 ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {favorites.slice(0, 3).map((favorite) => {
                    // Handle case where vehicle might be an ID (number) or an object
                    const vehicle = favorite.vehicle;
                    
                    // If vehicle is a number (ID), we can't display it properly
                    if (typeof vehicle === 'number') {
                      return (
                        <Paper elevation={0} sx={{ p: 2, border: '1px solid #e0e0e0' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Box sx={{ flex: 1 }}>
                              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                                Оголошення завантажується...
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                ID: {vehicle}
                              </Typography>
                            </Box>
                            <IconButton 
                              size="small" 
                              onClick={() => handleRemoveFavorite(favorite.id)}
                              color="error"
                            >
                              <FavoriteIcon />
                            </IconButton>
                          </Box>
                        </Paper>
                      );
                    }
                    
                    // If vehicle is an object with id property, display it
                    if (vehicle && typeof vehicle === 'object' && 'id' in vehicle) {
                      return (
                        <UserListingCard
                          key={vehicle.id}
                          vehicle={vehicle}
                          onSettingsClick={() => {}}
                        />
                      );
                    }
                    
                    // Fallback for invalid vehicle data
                    return (
                      <Paper elevation={0} sx={{ p: 2, border: '1px solid #e0e0e0' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                              Помилка завантаження оголошення
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              ID: {favorite.id}
                            </Typography>
                          </Box>
                          <IconButton 
                            size="small" 
                            onClick={() => handleRemoveFavorite(favorite.id)}
                            color="error"
                          >
                            <FavoriteIcon />
                          </IconButton>
                        </Box>
                      </Paper>
                    );
                  })}
                </Box>
              ) : (
                <Box sx={{ minHeight: 150, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    Улюблених оголошень поки немає
                  </Typography>
                </Box>
              )}
            </Paper>
          </>
        );

      case 'listings':
        return <UserListingsGrid />;

      case 'messages':
        return <ProfileChat />;

      case 'notifications':
        return (
          <Paper elevation={1} sx={{ borderRadius: 0, p: 3, mb: 3 }}>
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                Сповіщення
              </Typography>
              <Button 
                variant="outlined" 
                size="small"
                sx={{ borderRadius: 0 }}
              >
                Налаштування
              </Button>
            </Box>

            {/* Filter buttons */}
            <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
              {['Всі', 'Акції', 'Продаж', 'Купівля', 'Обране', 'Інформаційні', 'Архів'].map((label) => (
                <Button
                  key={label}
                  variant="outlined"
                  size="small"
                  sx={{ borderRadius: 0, minWidth: 'auto', px: 1.5 }}
                >
                  {label}
                </Button>
              ))}
            </Box>

            {/* Actions row */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Checkbox 
                  size="small" 
                  checked={selectAll}
                  onChange={handleSelectAll}
                />
                <Typography variant="body2">вибрати все</Typography>
              </Box>
              <Select
                size="small"
                defaultValue=""
                displayEmpty
                sx={{ minWidth: 120, borderRadius: 0 }}
              >
                <MenuItem value="">Дії</MenuItem>
                <MenuItem value="delete">Видалити</MenuItem>
                <MenuItem value="archive">Архівувати</MenuItem>
                <MenuItem value="send">Надіслати</MenuItem>
              </Select>
              <Button variant="contained" size="small" sx={{ borderRadius: 0 }}>
                Застосувати
              </Button>
            </Box>

            {/* Notifications list */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {[
                {
                  id: 1,
                  username: 'John Doe',
                  title: 'Нова пропозиція для вашого авто',
                  date: '12.05.2024',
                  message: 'Доброго дня! Мене цікавить ваше авто BMW X5. Чи можна домовитись про зустріч?',
                  expanded: false
                },
                {
                  id: 2,
                  username: 'AutoRia Team',
                  title: 'Акція на страхування',
                  date: '11.05.2024',
                  message: 'Спеціальна пропозиція: знижка 15% на страхування для власників BMW.',
                  expanded: false
                },
                {
                  id: 3,
                  username: 'CarDealer UA',
                  title: 'Нові надходження',
                  date: '10.05.2024',
                  message: 'У нас з\'явились нові автомобілі марки Audi. Запрошуємо на перегляд.',
                  expanded: false
                }
              ].map((notification) => (
                <Paper 
                  key={notification.id} 
                  elevation={1} 
                  sx={{ 
                    p: 2, 
                    borderRadius: 0,
                    transition: 'all 0.3s ease',
                    height: expandedNotificationId === notification.id ? 'auto' : '60px',
                    minHeight: '60px'
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    {/* Checkbox */}
                    <Checkbox 
                      size="small" 
                      checked={selectedNotifications.includes(notification.id)}
                      onChange={() => handleSelectNotification(notification.id)}
                    />

                    {/* Icon */}
                    <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                      {notification.username[0]}
                    </Avatar>

                    {/* User info and title */}
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                        {notification.username}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {notification.title}
                      </Typography>
                    </Box>

                    {/* Date and expand button */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="caption" color="text.secondary">
                        {notification.date}
                      </Typography>
                      <IconButton 
                        size="small"
                        onClick={() => handleNotificationToggle(notification.id)}
                      >
                        {expandedNotificationId === notification.id ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                      </IconButton>
                    </Box>
                  </Box>

                  {/* Expanded content */}
                  {expandedNotificationId === notification.id && (
                    <Box sx={{ mt: 2, pl: 6 }}>
                      <Typography variant="body2" sx={{ mb: 2 }}>
                        {notification.message}
                      </Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Button variant="outlined" size="small" sx={{ borderRadius: 0 }}>
                          Дивитись
                        </Button>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <IconButton size="small" title="Архівувати">
                            <ArchiveIcon />
                          </IconButton>
                          <IconButton size="small" title="Видалити">
                            <DeleteIcon />
                          </IconButton>
                          <IconButton size="small" title="Позначити як прочитане">
                            <MarkAsReadIcon />
                          </IconButton>
                          <IconButton 
                            size="small" 
                            title="Згорнути"
                            onClick={() => handleNotificationToggle(notification.id)}
                          >
                            <ExpandLessIcon />
                          </IconButton>
                        </Box>
                      </Box>
                    </Box>
                  )}
                </Paper>
              ))}
            </Box>
          </Paper>
        );

      case 'favorites':
        return (
          <Paper elevation={1} sx={{ borderRadius: 0, p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>
              Обране
            </Typography>
            
            {favoritesLoading ? (
              <Box sx={{ minHeight: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  Завантаження улюблених оголошень...
                </Typography>
              </Box>
            ) : favorites.length > 0 ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {favorites.map((favorite) => (
                  <FavoriteVehicleCard
                    key={favorite.id}
                    favorite={favorite}
                    onRemove={handleRemoveFavorite}
                    onNavigate={(vehicleId) => navigate(`/vehicles/${vehicleId}`)}
                  />
                ))}
              </Box>
            ) : (
              <Box sx={{ minHeight: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  Улюблених оголошень поки немає
                </Typography>
              </Box>
            )}
          </Paper>
        );

      case 'settings':
        return <ProfileSettingsForm />;

      default:
        return (
          <Paper elevation={1} sx={{ borderRadius: 0, p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>
              Особистий кабінет
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
              Оберіть розділ з меню зліва
            </Typography>
          </Paper>
        );
    }
  };

  return (
    <ProfileLayout 
      title={getSectionTitle(activeSection)}
      activeSection={activeSection}
      onSectionChange={setActiveSection}
    >
      {renderProfileContent()}
    </ProfileLayout>
  );
}

function getSectionTitle(section: string): string {
  const titles: Record<string, string> = {
    'profile': 'Особистий кабінет',
    'listings': 'Мої оголошення', 
    'notifications': 'Повідомлення',
    'messages': 'Чат',
    'favorites': 'Обране',
    'settings': 'Налаштування'
  };
  return titles[section] || 'Особистий кабінет';
}
