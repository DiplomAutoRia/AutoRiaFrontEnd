import React, { useState } from 'react';
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
} from '@mui/icons-material';
import { Box, Button, Card, CardContent, CardMedia, Chip, IconButton, Stack, Tooltip, Typography } from '@mui/material';

import type { Vehicle } from '../../models/vehicle';
import { useAddToFavoritesMutation, useRemoveFromFavoritesMutation } from '../../redux/api/favoritesApi';

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
  const navigate = useNavigate();
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
    } catch (error) {
    }
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
    return new Intl.NumberFormat('uk-UA', {
      style: 'currency',
      currency: currency === 'USD' ? 'USD' : 'UAH',
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

      <Box sx={{ position: 'absolute', top: 8, right: 8, zIndex: 2 }}>
        <Chip
          icon={<Visibility fontSize="small" />}
          label={vehicle.views_count}
          size="small"
          sx={{ backgroundColor: 'rgba(0,0,0,0.6)', color: 'white' }}
        />
      </Box>

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

      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h6" component="h3" gutterBottom>
          {vehicle.brand} {vehicle.model} {vehicle.year}
        </Typography>

        <Typography variant="h5" color="primary" gutterBottom>
          {formatPrice(vehicle.price, vehicle.currency)}
        </Typography>

        <Stack spacing={1}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <CalendarToday fontSize="small" color="action" />
            <Typography variant="body2">{vehicle.year}</Typography>
          </Stack>

          {vehicle.mileage && (
            <Stack direction="row" alignItems="center" spacing={1}>
              <Speed fontSize="small" color="action" />
              <Typography variant="body2">{vehicle.mileage.toLocaleString()} км</Typography>
            </Stack>
          )}

          {vehicle.fuel_type && (
            <Stack direction="row" alignItems="center" spacing={1}>
              <LocalGasStation fontSize="small" color="action" />
              <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
                {vehicle.fuel_type}
              </Typography>
            </Stack>
          )}

          {vehicle.transmission && (
            <Stack direction="row" alignItems="center" spacing={1}>
              <DirectionsCar fontSize="small" color="action" />
              <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
                {vehicle.transmission}
              </Typography>
            </Stack>
          )}

          <Stack direction="row" alignItems="center" spacing={1}>
            <LocationOn fontSize="small" color="action" />
            <Typography variant="body2">{vehicle.location}</Typography>
          </Stack>
        </Stack>

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
                <Tooltip title={isFavoriteState ? 'Видалити з обраного' : 'Додати до обраного'}>
                  <IconButton size="small" onClick={handleFavoriteToggle}>
                    {isFavoriteState ? <Favorite color="error" /> : <FavoriteBorder />}
                  </IconButton>
                </Tooltip>
                <Tooltip title="Поділитися">
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
