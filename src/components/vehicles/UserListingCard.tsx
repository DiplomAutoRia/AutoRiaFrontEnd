import React from 'react';
import { useNavigate } from 'react-router-dom';

import { ConfirmationNumber, DirectionsCar, Favorite, LocationOn, Settings, Speed } from '@mui/icons-material';
import { Box, Button, Card, CardMedia, IconButton, Stack, Typography, useMediaQuery, useTheme } from '@mui/material';

import type { Vehicle } from '../../models/vehicle';

interface UserListingCardProps {
  vehicle: Vehicle;
  onSettingsClick: (_vehicleId: number) => void;
  onDelete?: (_vehicleId: number) => void; // Додаємо проп
  showFavoriteIcon?: boolean; // Показувати іконку сердечка замість налаштувань
  onFavoriteClick?: (_vehicleId: number) => void; // Обробник кліку на сердечко
}

const UserListingCard: React.FC<UserListingCardProps> = ({
  vehicle,
  onSettingsClick,
  onDelete,
  showFavoriteIcon = false,
  onFavoriteClick,
}) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const formatPrice = (price: number, currency: string) => {
    if (currency === 'UAH') {
      return new Intl.NumberFormat('uk-UA').format(price);
    }
    return new Intl.NumberFormat('uk-UA', {
      style: 'currency',
      currency: currency === 'USD' ? 'USD' : 'EUR',
    }).format(price);
  };

  return (
    <Card
      sx={{
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        position: 'relative',
        borderRadius: 0,
        transition: 'all 0.3s ease',
        cursor: 'pointer',
        height: isMobile ? 'auto' : 200,
        '&:hover': {
          boxShadow: 3,
          transform: 'translateY(-2px)',
        },
      }}
      onClick={() => navigate(`/vehicles/${vehicle.id}`)}
    >
      {/* Іконка налаштувань або сердечка */}
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
          if (showFavoriteIcon && onFavoriteClick) {
            // Pass the favorite ID instead of vehicle ID for favorites
            onFavoriteClick(vehicle.id);
          } else {
            onSettingsClick(vehicle.id);
          }
        }}
        size="small"
        color={showFavoriteIcon ? 'primary' : 'default'}
      >
        {showFavoriteIcon ? <Favorite fontSize="small" /> : <Settings fontSize="small" />}
      </IconButton>

      {/* Зображення */}
      <Box sx={{ position: 'relative', width: 280, flexShrink: 0 }}>
        {vehicle.is_new && (
          <Box
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              zIndex: 2,
              backgroundColor: '#1976d2',
              color: 'white',
              fontWeight: 'bold',
              padding: '4px 8px',
              borderRadius: '4px',
              fontSize: '12px',
              lineHeight: 1,
            }}
          >
            Нова
          </Box>
        )}
        <CardMedia
          component="img"
          sx={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            backgroundColor: '#f5f5f5',
          }}
          image={vehicle.images && vehicle.images.length > 0 ? vehicle.images[0].image : '/assets/images/car.png'}
          alt={`${vehicle.brand} ${vehicle.model}`}
        />
        {vehicle.vin_code && (
          <Box
            sx={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              color: 'white',
              padding: '4px 8px',
              textAlign: 'center',
              fontSize: '12px',
              fontWeight: 'bold',
            }}
          >
            {vehicle.vin_code}
          </Box>
        )}
      </Box>

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
            {vehicle.brand} {vehicle.model} {vehicle.year}
          </Typography>
        </Box>

        {/* Engine specifications under title */}
        {(vehicle.engine_volume || vehicle.engine_power || vehicle.fuel_type) && (
          <Stack direction="row" spacing={1}>
            {vehicle.engine_volume && (
              <Typography variant="body2" color="text.secondary">
                {vehicle.engine_volume} л
              </Typography>
            )}
            {vehicle.engine_power && (
              <Typography variant="body2" color="text.secondary">
                {vehicle.engine_power} к.с.
              </Typography>
            )}
            {vehicle.fuel_type && (
              <Typography variant="body2" color="text.secondary" sx={{ textTransform: 'capitalize' }}>
                {vehicle.fuel_type}
              </Typography>
            )}
          </Stack>
        )}

        {/* Price display with UAH conversion */}
        <Box sx={{ mb: 1, mt: 0.5, textAlign: 'left' }}>
          <Typography variant="h6" color="primary" component="span" sx={{ fontWeight: 'bold' }}>
            {formatPrice(vehicle.price, vehicle.currency)}
          </Typography>
          {vehicle.currency !== 'UAH' && (
            <>
              <Typography variant="body2" color="text.secondary" component="span" sx={{ mx: 0.5 }}>
                |
              </Typography>
              <Typography variant="body2" color="text.secondary" component="span" sx={{ fontSize: '0.9rem' }}>
                {formatPrice(vehicle.price * (vehicle.currency === 'USD' ? 40 : 43), 'UAH')} грн
              </Typography>
            </>
          )}
        </Box>

        {/* Information in columns */}
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
          {/* First column */}
          <Stack spacing={0.5}>
            {vehicle.mileage && (
              <Stack direction="row" alignItems="center" spacing={0.5}>
                <Speed fontSize="small" color="action" />
                <Typography variant="body2">{vehicle.mileage.toLocaleString()} км</Typography>
              </Stack>
            )}
            {vehicle.transmission && (
              <Stack direction="row" alignItems="center" spacing={0.5}>
                <DirectionsCar fontSize="small" color="action" />
                <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
                  {vehicle.transmission}
                </Typography>
              </Stack>
            )}
            {vehicle.plate_number && (
              <Stack direction="row" alignItems="center" spacing={0.5}>
                <ConfirmationNumber fontSize="small" color="action" />
                <Typography variant="body2">{vehicle.plate_number}</Typography>
              </Stack>
            )}
          </Stack>

          {/* Second column */}
          <Stack spacing={0.5}>
            {vehicle.location && (
              <Stack direction="row" alignItems="center" spacing={0.5}>
                <LocationOn fontSize="small" color="action" />
                <Typography variant="body2">
                  {vehicle.location
                    .split(',')
                    .map((part) => part.trim())
                    .slice(0, 2)
                    .join(', ')}
                </Typography>
              </Stack>
            )}
          </Stack>
        </Box>

        {/* Action buttons */}
        <Box sx={{ display: 'flex', gap: 1 }}>
          {onDelete && (
            <Button
              variant="outlined"
              color="error"
              size="small"
              onClick={(e) => {
                e.stopPropagation(); // Зупиняє пробивання події
                onDelete?.(vehicle.id);
              }}
            >
              Видалити
            </Button>
          )}
        </Box>
      </Box>
    </Card>
  );
};

export default UserListingCard;
