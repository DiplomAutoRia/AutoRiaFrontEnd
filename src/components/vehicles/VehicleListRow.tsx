import React from 'react';
import { useNavigate } from 'react-router-dom';

import { ConfirmationNumber, DirectionsCar, Favorite, FavoriteBorder, LocationOn, Speed } from '@mui/icons-material';
import {
  Box,
  Card,
  CardMedia,
  CircularProgress,
  IconButton,
  Pagination,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';

import type { Vehicle } from '../../models/vehicle';
import { useAddToFavoritesMutation, useRemoveFromFavoritesMutation } from '../../redux/api/favoritesApi';

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
  favoriteIds = {},
}) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [addToFavorites] = useAddToFavoritesMutation();
  const [removeFromFavorites] = useRemoveFromFavoritesMutation();

  const formatPrice = (price: number, currency: string) => {
    if (currency === 'UAH') {
      return new Intl.NumberFormat('uk-UA').format(price);
    }
    return new Intl.NumberFormat('uk-UA', {
      style: 'currency',
      currency: currency === 'USD' ? 'USD' : 'EUR',
    }).format(price);
  };

  const handleFavoriteClick = async (e: React.MouseEvent, vehicleId: number) => {
    e.stopPropagation();

    const favoriteId = favoriteIds[vehicleId];
    if (favoriteId) {
      await removeFromFavorites(favoriteId);
    } else {
      await addToFavorites({ vehicle: vehicleId });
    }
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
      {/* Список оголошень */}
      <Box
        sx={{
          display: 'grid',
          gap: 2,
          gridTemplateColumns: '1fr',
        }}
      >
        {vehicles.map((vehicle) => (
          <Card
            key={vehicle.id}
            elevation={1}
            sx={{
              display: 'flex',
              flexDirection: isMobile ? 'column' : 'row',
              position: 'relative',
              borderRadius: 2,
              transition: 'all 0.3s ease',
              cursor: 'pointer',
              height: isMobile ? 'auto' : 200,
              backgroundColor: 'white',
              border: '1px solid #e0e0e0',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: 3,
              },
            }}
            onClick={() => navigate(`/vehicles/${vehicle.id}`)}
          >
            {/* Зображення */}
            <Box
              sx={{
                position: 'relative',
                width: isMobile ? '100%' : 280,
                height: isMobile ? 200 : '100%',
                flexShrink: 0,
              }}
            >
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

              {/* Heart Icon for Favorites */}
              <IconButton
                sx={{
                  position: 'absolute',
                  top: 8,
                  left: 8,
                  zIndex: 2,
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 1)',
                  },
                  padding: '6px',
                }}
                onClick={(e) => handleFavoriteClick(e, vehicle.id)}
              >
                {favoriteIds[vehicle.id] ? (
                  <Favorite sx={{ color: '#f44336', fontSize: 20 }} />
                ) : (
                  <FavoriteBorder sx={{ color: '#666', fontSize: 20 }} />
                )}
              </IconButton>

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
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                flexGrow: 1,
                p: isMobile ? 1.5 : 2,
                gap: isMobile ? 0.5 : 1,
              }}
            >
              {/* Назва, модель та рік */}
              <Typography
                variant="h6"
                component="h3"
                sx={{
                  fontSize: isMobile ? '1rem' : '1.2rem',
                  fontWeight: 'bold',
                  lineHeight: 1.2,
                  mb: isMobile ? 0.5 : 0,
                }}
              >
                {vehicle.brand} {vehicle.model} {vehicle.year}
              </Typography>

              {/* Price display */}
              <Box sx={{ mb: isMobile ? 0.5 : 1 }}>
                <Typography
                  variant={isMobile ? 'h6' : 'h6'}
                  color="primary"
                  sx={{
                    fontWeight: 'bold',
                    fontSize: isMobile ? '1.1rem' : '1.25rem',
                  }}
                >
                  {formatPrice(vehicle.price, vehicle.currency)}
                </Typography>
                {vehicle.currency !== 'UAH' && (
                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: isMobile ? '0.8rem' : '0.9rem' }}>
                    ≈ {formatPrice(vehicle.price * (vehicle.currency === 'USD' ? 40 : 43), 'UAH')} грн
                  </Typography>
                )}
              </Box>

              {/* Compact specs for mobile, detailed for desktop */}
              {isMobile ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                  {vehicle.mileage && (
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.85rem' }}>
                      {vehicle.mileage.toLocaleString()} км
                    </Typography>
                  )}
                  {vehicle.location && (
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.85rem' }}>
                      {vehicle.location}
                    </Typography>
                  )}
                </Box>
              ) : (
                <>
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
                </>
              )}

              {/* Desktop detailed info */}
              {!isMobile && (
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
              )}
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
