import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { Delete, Settings } from '@mui/icons-material';
import { Box, Button, Card, CardMedia, Container, IconButton, Stack, Typography } from '@mui/material';

import type { Vehicle } from '../../models/vehicle';
import type { VehicleFilters } from '../../models/vehicle';
import { useDeleteVehicleMutation, useGetMyVehiclesQuery } from '../../redux/api/vehiclesApi';
import type { RootState } from '../../redux/store';
import Filter from '../ui/filter';

interface UserListingsGridProps {
  title?: string;
  showCreateButton?: boolean;
}

const UserListingsGrid: React.FC<UserListingsGridProps> = ({ title = 'Мої оголошення', showCreateButton = true }) => {
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth.user);
  const [filters, setFilters] = useState<Partial<VehicleFilters>>({});

  const { data, isLoading, error } = useGetMyVehiclesQuery({
    page: 1,
    limit: 12,
    ...filters,
  });
  const [deleteVehicle] = useDeleteVehicleMutation();

  const handleSearch = (searchFilters: Partial<VehicleFilters>) => {
    setFilters(searchFilters);
  };

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('uk-UA', {
      style: 'currency',
      currency: currency === 'USD' ? 'USD' : 'UAH',
    }).format(price);
  };

  const handleSettingsClick = (vehicleId: number) => {
    navigate(`/vehicles/${vehicleId}/edit`);
  };

  const handleDeleteVehicle = async (vehicleId: number) => {
    try {
      await deleteVehicle(vehicleId).unwrap();
      // Можна додати оновлення списку або повідомлення
    } catch (error) {
      console.error('Не вдалося видалити оголошення:', error);
    }
  };

  if (!user) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h6" color="text.secondary" textAlign="center">
          Будь ласка, увійдіть до системи
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Заголовок та кнопка створення */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" component="h1">
          {title}
        </Typography>

        {showCreateButton && (
          <Button variant="contained" onClick={() => navigate('/vehicles/create')} sx={{ borderRadius: 0 }}>
            Створити оголошення
          </Button>
        )}
      </Box>

      {/* Фільтр */}
      <Box mb={4}>
        <Filter onSearch={handleSearch} />
      </Box>

      {/* Статус завантаження */}
      {isLoading && (
        <Box display="flex" justifyContent="center" py={4}>
          <Typography>Завантаження...</Typography>
        </Box>
      )}

      {/* Помилка */}
      {error && (
        <Box display="flex" justifyContent="center" py={4}>
          <Typography color="error">Помилка завантаження оголошень</Typography>
        </Box>
      )}

      {/* Пустий стан */}
      {!isLoading && !error && data?.results && data.results.length === 0 && (
        <Box textAlign="center" py={8}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            У вас поки немає оголошень
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Створіть своє перше оголошення про продаж транспортного засобу
          </Typography>
          <Button variant="contained" onClick={() => navigate('/create')} sx={{ mt: 2, borderRadius: 0 }}>
            Створити оголошення
          </Button>
        </Box>
      )}

      {/* Список оголошень у ряд */}
      {!isLoading && !error && data?.results && data.results.length > 0 && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {data.results.map((vehicle: Vehicle) => (
            <Card
              key={vehicle.id}
              sx={{
                display: 'flex',
                position: 'relative',
                borderRadius: 0,
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                height: 200,
                '&:hover': {
                  boxShadow: 3,
                  transform: 'translateY(-2px)',
                },
              }}
              onClick={() => navigate(`/vehicles/${vehicle.id}`)}
            >
              {/* Іконки дій */}
              <Box sx={{ position: 'absolute', top: 8, right: 8, zIndex: 2, display: 'flex', gap: 0.5 }}>
                {/* Іконка налаштувань */}
                <IconButton
                  sx={{
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    '&:hover': {
                      backgroundColor: 'white',
                    },
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSettingsClick(vehicle.id);
                  }}
                  size="small"
                >
                  <Settings fontSize="small" />
                </IconButton>

                {/* Іконка видалення */}
                <IconButton
                  sx={{
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    '&:hover': {
                      backgroundColor: 'white',
                    },
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteVehicle(vehicle.id);
                  }}
                  size="small"
                  color="error"
                >
                  <Delete fontSize="small" />
                </IconButton>
              </Box>

              {/* Зображення */}
              <CardMedia
                component="img"
                sx={{
                  width: 280,
                  height: '100%',
                  objectFit: 'cover',
                  backgroundColor: '#f5f5f5',
                  flexShrink: 0,
                }}
                image={vehicle.images && vehicle.images.length > 0 ? vehicle.images[0].image : '/assets/images/car.png'}
                alt={`${vehicle.brand} ${vehicle.model}`}
              />

              {/* Контент */}
              <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, p: 2, gap: 1 }}>
                {/* Назва, модель та рік в один рядок */}
                <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, flexWrap: 'wrap' }}>
                  <Typography
                    variant="h6"
                    component="h3"
                    sx={{
                      fontSize: '1.2rem',
                      fontWeight: 'bold',
                      lineHeight: 1.2,
                    }}
                  >
                    {vehicle.brand} {vehicle.model}
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1rem' }}>
                    {vehicle.year} рік
                  </Typography>
                </Box>

                {/* Ціна */}
                <Typography
                  variant="h6"
                  color="primary"
                  sx={{
                    fontSize: '1.3rem',
                    fontWeight: 'bold',
                  }}
                >
                  {formatPrice(vehicle.price, vehicle.currency)}
                </Typography>

                {/* Деталі у стовпчик */}
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
                      КПП: {vehicle.transmission}
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
          ))}
        </Box>
      )}
    </Container>
  );
};

export default UserListingsGrid;
