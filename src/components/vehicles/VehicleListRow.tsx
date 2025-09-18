import React from 'react';
import { useNavigate } from 'react-router-dom';

import { Box, Card, CardMedia, CircularProgress, Pagination, Stack, Typography } from '@mui/material';

import type { Vehicle } from '../../models/vehicle';

interface VehicleListRowProps {
  vehicles: Vehicle[];
  isLoading?: boolean;
  error?: { message?: string } | null;
  totalCount?: number;
  currentPage?: number;
  pageSize?: number;
  onPageChange?: (_page: number) => void;
  favoriteIds?: Record<number, number>;
}

const VehicleListRow: React.FC<VehicleListRowProps> = ({
  vehicles,
  isLoading = false,
  error,
  totalCount = 0,
  currentPage = 1,
  pageSize = 10,
  onPageChange,
  favoriteIds: _favoriteIds = {},
}) => {
  const navigate = useNavigate();

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('uk-UA', {
      style: 'currency',
      currency: currency === 'USD' ? 'USD' : 'UAH',
    }).format(price);
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" py={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" py={4}>
        <Typography color="error">Помилка завантаження: {error.message || 'Невідома помилка'}</Typography>
      </Box>
    );
  }

  if (vehicles.length === 0) {
    return (
      <Box display="flex" justifyContent="center" py={4}>
        <Typography variant="h6" color="text.secondary">
          Оголошення не знайдено
        </Typography>
      </Box>
    );
  }

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <Box>
      {/* Список оголошень у ряд */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {vehicles.map((vehicle) => (
          <Card
            key={vehicle.id}
            elevation={0}
            sx={{
              display: 'flex',
              position: 'relative',
              borderRadius: 0,
              transition: 'all 0.3s ease',
              cursor: 'pointer',
              height: 200,
              backgroundColor: 'transparent',
              border: 'none',
              boxShadow: 'none',
              '&:hover': {
                transform: 'translateY(-2px)',
              },
            }}
            onClick={() => navigate(`/vehicles/${vehicle.id}`)}
          >
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
              image={vehicle.images && vehicle.images.length > 0 ? vehicle.images[0].image : '/locales/images/car.png'}
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

      {/* Пагінація */}
      {totalPages > 1 && onPageChange && (
        <Box display="flex" justifyContent="center" mt={4}>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={(_, page) => onPageChange(page)}
            color="primary"
            size="large"
          />
        </Box>
      )}
    </Box>
  );
};

export default VehicleListRow;
