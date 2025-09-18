import React from 'react';
import { useNavigate } from 'react-router-dom';

import { Settings } from '@mui/icons-material';
import { Box, Card, CardMedia, IconButton, Stack, Typography } from '@mui/material';

import type { Vehicle } from '../../models/vehicle';

interface UserListingCardProps {
  vehicle: Vehicle;
  onSettingsClick: (_vehicleId: number) => void;
}

const UserListingCard: React.FC<UserListingCardProps> = ({ vehicle, onSettingsClick }) => {
  const navigate = useNavigate();

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
          transform: 'translateY(-2px)',
        },
      }}
      onClick={() => navigate(`/vehicles/${vehicle.id}`)}
    >
      {/* Іконка налаштувань */}
      <IconButton
        sx={{
          position: 'absolute',
          top: 8,
          right: 8,
          zIndex: 2,
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          '&:hover': {
            backgroundColor: 'white',
          },
        }}
        onClick={(e) => {
          e.stopPropagation();
          onSettingsClick(vehicle.id);
        }}
        size="small"
      >
        <Settings fontSize="small" />
      </IconButton>

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
  );
};

export default UserListingCard;
