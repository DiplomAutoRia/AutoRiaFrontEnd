import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import {
  CalendarToday,
  DirectionsCar,
  Favorite,
  FavoriteBorder,
  LocalGasStation,
  LocationOn,
  Share,
  Speed,
  Visibility,
  Directions,
  ConfirmationNumber,
} from '@mui/icons-material';
import { Box, Button, Card, CardContent, CardMedia, Chip, IconButton, Stack, Tooltip, Typography } from '@mui/material';

import type { Vehicle } from '../../models/vehicle';
import { useAddToFavoritesMutation, useRemoveFromFavoritesMutation } from '../../redux/api/favoritesApi';
import type { RootState } from '../../redux/store';

interface VehicleCardProps {
  vehicle: Vehicle;
  isFavorite?: boolean;
  favoriteId?: number;
  showUserActions?: boolean;
  onEdit?: (_vehicle: Vehicle) => void;
  onDelete?: (_vehicleId: number) => void;
}

const VehicleCard: React.FC<VehicleCardProps> = ({
  vehicle,
  isFavorite = false,
  favoriteId,
  showUserActions = false,
  onEdit,
  onDelete,
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth.user);
  const [addToFavorites] = useAddToFavoritesMutation();
  const [removeFromFavorites] = useRemoveFromFavoritesMutation();
  const [isFavoriteState, setIsFavoriteState] = useState(isFavorite);

  const handleFavoriteToggle = async () => {
    try {
      if (isFavoriteState && favoriteId) {
        await removeFromFavorites(favoriteId).unwrap();
        setIsFavoriteState(false);
      } else {
        await addToFavorites({ vehicle: vehicle.id }).unwrap();
        setIsFavoriteState(true);
      }
    } catch {}
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${vehicle.brand} ${vehicle.model} ${vehicle.year}`,
        text: vehicle.description,
        url: window.location.origin + `/vehicles/${vehicle.id}`,
      });
    } else {
      navigator.clipboard.writeText(window.location.origin + `/vehicles/${vehicle.id}`);
    }
  };

  const formatPrice = (price: number, currency: string) => {
    if (currency === 'UAH') {
      return new Intl.NumberFormat('uk-UA').format(price);
    }
    return new Intl.NumberFormat('uk-UA', {
      style: 'currency',
      currency: currency === 'USD' ? 'USD' : 'EUR',
    }).format(price);
  };

  const mainImage = vehicle.images && vehicle.images.length > 0 ? vehicle.images[0].image : '/api/placeholder/300/200';

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      <Chip
        label={vehicle.vehicle_type?.toUpperCase() || 'UNKNOWN'}
        size="small"
        color="primary"
        sx={{
          position: 'absolute',
          top: 8,
          left: 8,
          zIndex: 2,
          textTransform: 'capitalize',
        }}
      />

      <Box sx={{ position: 'absolute', top: 8, right: 8, zIndex: 2, display: 'flex', alignItems: 'center', gap: 0.5 }}>
        {user && (
          <Tooltip title={isFavoriteState ? 'Видалити з обраного' : 'Додати до обраного'}>
            <IconButton
              size="small"
              onClick={handleFavoriteToggle}
              aria-label={isFavoriteState ? 'Видалити з обраного' : 'Додати до обраного'}
              sx={{
                backgroundColor: 'rgba(255,255,255,0.9)',
                '&:hover': { backgroundColor: 'rgba(255,255,255,1)' },
              }}
            >
              {isFavoriteState ? <Favorite color="error" fontSize="small" /> : <FavoriteBorder fontSize="small" />}
            </IconButton>
          </Tooltip>
        )}
        <Chip
          icon={<Visibility fontSize="small" />}
          label={vehicle.views_count}
          size="small"
          sx={{ backgroundColor: 'rgba(0,0,0,0.6)', color: 'white' }}
        />
      </Box>

      <Box sx={{ position: 'relative' }}>
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
          height="200"
          image={mainImage}
          alt={`${vehicle.brand} ${vehicle.model}`}
          sx={{
            backgroundColor: '#e0e0e0',
            cursor: 'pointer',
          }}
          onClick={() => navigate(`/vehicles/${vehicle.id}`)}
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

      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h6" component="h3" gutterBottom>
          {vehicle.brand} {vehicle.model} {vehicle.year}
        </Typography>

        {/* Engine specifications under title */}
        {(vehicle.engine_volume || vehicle.engine_power || vehicle.fuel_type) && (
          <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
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
          <Typography variant="h5" color="primary" component="span">
            {formatPrice(vehicle.price, vehicle.currency)}
          </Typography>
          {vehicle.currency !== 'UAH' && (
            <>
              <Typography variant="body2" color="text.secondary" component="span" sx={{ mx: 0.5 }}>
                |
              </Typography>
              <Typography 
                variant="body2" 
                color="text.secondary" 
                component="span"
                sx={{ fontSize: '0.9rem' }}
              >
                {formatPrice(vehicle.price * (vehicle.currency === 'USD' ? 40 : 43), 'UAH')} грн
              </Typography>
            </>
          )}
        </Box>

        {/* Information in columns */}
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, mb: 2 }}>
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
                  {vehicle.location.split(',').map(part => part.trim()).slice(0, 2).join(', ')}
                </Typography>
              </Stack>
            )}
          </Stack>
        </Box>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mt: 2,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
          }}
        >
          {vehicle.description}
        </Typography>
      </CardContent>

      <Box sx={{ p: 2, pt: 0 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Button variant="contained" size="small" onClick={() => navigate(`/vehicles/${vehicle.id}`)}>
            Детальніше
          </Button>

          <Stack direction="row" spacing={1}>
            {showUserActions ? (
              <>
                <Button size="small" onClick={() => onEdit?.(vehicle)}>
                  Редагувати
                </Button>
                <Button size="small" color="error" onClick={() => onDelete?.(vehicle.id)}>
                  Видалити
                </Button>
              </>
            ) : (
              <>
                {user && (
                  <Tooltip title={isFavoriteState ? 'Видалити з обраного' : 'Додати до обраного'}>
                    <IconButton size="small" onClick={handleFavoriteToggle}>
                      {isFavoriteState ? <Favorite color="error" /> : <FavoriteBorder />}
                    </IconButton>
                  </Tooltip>
                )}
                <Tooltip title={t('vehicles.share')}>
                  <IconButton size="small" onClick={handleShare}>
                    <Share />
                  </IconButton>
                </Tooltip>
              </>
            )}
          </Stack>
        </Stack>
      </Box>
    </Card>
  );
};

export default VehicleCard;
