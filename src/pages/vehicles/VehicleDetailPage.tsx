import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { ArrowBack, Email, Favorite, FavoriteBorder, Phone, Share, Visibility } from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  Grid,
  IconButton,
  ImageList,
  ImageListItem,
  Paper,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';

import {
  useAddToFavoritesMutation,
  useGetFavoritesQuery,
  useRemoveFromFavoritesMutation,
} from '../../redux/api/favoritesApi';
import { useGetVehicleQuery } from '../../redux/api/vehiclesApi';

const VehicleDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(0);

  const { data: vehicle, isLoading, error } = useGetVehicleQuery(Number(id));
  const { data: favorites = [] } = useGetFavoritesQuery();
  const [addToFavorites] = useAddToFavoritesMutation();
  const [removeFromFavorites] = useRemoveFromFavoritesMutation();

  const favorite = favorites.find((fav) => fav.vehicle === Number(id));
  const isFavorite = !!favorite;

  const handleFavoriteToggle = async () => {
    try {
      if (isFavorite && favorite) {
        await removeFromFavorites(favorite.id).unwrap();
      } else {
        await addToFavorites({ vehicle: Number(id) }).unwrap();
      }
    } catch (error) {
    }
  };

  const handleShare = () => {
    if (navigator.share && vehicle) {
      navigator.share({
        title: `${vehicle.brand} ${vehicle.model} ${vehicle.year}`,
        text: vehicle.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('uk-UA', {
      style: 'currency',
      currency: currency === 'USD' ? 'USD' : 'UAH',
    }).format(price);
  };

  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box display="flex" justifyContent="center">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error || !vehicle) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">Транспортний засіб не знайдено або сталася помилка завантаження</Alert>
        <Box mt={2}>
          <Button onClick={() => navigate('/')} startIcon={<ArrowBack />}>
            Повернутися до головної
          </Button>
        </Box>
      </Container>
    );
  }

  const images = vehicle.images || [];
  const mainImage = images.length > 0 ? images[selectedImage]?.image : '/api/placeholder/600/400';

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      
      <Box mb={3}>
        <Button onClick={() => navigate(-1)} startIcon={<ArrowBack />} sx={{ mb: 2 }}>
          Назад
        </Button>

        <Stack direction="row" justifyContent="space-between" alignItems="center" flexWrap="wrap">
          <Box>
            <Typography variant="h4" component="h1" gutterBottom>
              {vehicle.brand} {vehicle.model} {vehicle.year}
            </Typography>
            <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
              <Chip label={vehicle.vehicle_type?.toUpperCase() || 'UNKNOWN'} color="primary" sx={{ textTransform: 'capitalize' }} />
              <Stack direction="row" alignItems="center" spacing={1}>
                <Visibility fontSize="small" color="action" />
                <Typography variant="body2">{vehicle.views_count} переглядів</Typography>
              </Stack>
            </Stack>
          </Box>

          <Stack direction="row" spacing={1}>
            <Tooltip title={isFavorite ? 'Видалити з обраного' : 'Додати до обраного'}>
              <IconButton onClick={handleFavoriteToggle} color={isFavorite ? 'error' : 'default'}>
                {isFavorite ? <Favorite /> : <FavoriteBorder />}
              </IconButton>
            </Tooltip>
            <Tooltip title="Поділитися">
              <IconButton onClick={handleShare}>
                <Share />
              </IconButton>
            </Tooltip>
          </Stack>
        </Stack>
      </Box>

      <Grid container spacing={4}>
        
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2, mb: 2 }}>
            {images.length > 0 ? (
              <Box>
                <Box
                  component="img"
                  src={mainImage}
                  alt={`${vehicle.brand} ${vehicle.model}`}
                  sx={{
                    width: '100%',
                    height: 400,
                    objectFit: 'cover',
                    borderRadius: 2,
                    mb: 2,
                  }}
                />
                {images.length > 1 && (
                  <ImageList cols={4} rowHeight={100} sx={{ height: 120, overflow: 'hidden' }}>
                    {images.map((image, index) => (
                      <ImageListItem
                        key={index}
                        sx={{
                          cursor: 'pointer',
                          border: selectedImage === index ? '2px solid' : 'none',
                          borderColor: 'primary.main',
                        }}
                        onClick={() => setSelectedImage(index)}
                      >
                        <img
                          src={image.image}
                          alt={`${vehicle.brand} ${vehicle.model} ${index + 1}`}
                          style={{ objectFit: 'cover' }}
                        />
                      </ImageListItem>
                    ))}
                  </ImageList>
                )}
              </Box>
            ) : (
              <Box
                sx={{
                  height: 400,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#f5f5f5',
                  borderRadius: 2,
                }}
              >
                <Typography color="text.secondary">Фото відсутні</Typography>
              </Box>
            )}
          </Paper>

          
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Опис
            </Typography>
            <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
              {vehicle.description}
            </Typography>
          </Paper>
        </Grid>

        
        <Grid item xs={12} md={4}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h4" color="primary" gutterBottom>
                {formatPrice(vehicle.price, vehicle.currency)}
              </Typography>

              <Stack spacing={2}>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2" color="text.secondary">
                    Рік:
                  </Typography>
                  <Typography variant="body2">{vehicle.year}</Typography>
                </Stack>

                {vehicle.mileage && (
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2" color="text.secondary">
                      Пробіг:
                    </Typography>
                    <Typography variant="body2">{vehicle.mileage.toLocaleString()} км</Typography>
                  </Stack>
                )}

                {vehicle.fuel_type && (
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2" color="text.secondary">
                      Паливо:
                    </Typography>
                    <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
                      {vehicle.fuel_type}
                    </Typography>
                  </Stack>
                )}

                {vehicle.transmission && (
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2" color="text.secondary">
                      КПП:
                    </Typography>
                    <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
                      {vehicle.transmission}
                    </Typography>
                  </Stack>
                )}

                {vehicle.engine_volume && (
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2" color="text.secondary">
                      Об'єм двигуна:
                    </Typography>
                    <Typography variant="body2">{vehicle.engine_volume} л</Typography>
                  </Stack>
                )}

                {vehicle.engine_power && (
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2" color="text.secondary">
                      Потужність:
                    </Typography>
                    <Typography variant="body2">{vehicle.engine_power} к.с.</Typography>
                  </Stack>
                )}

                {vehicle.color && (
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2" color="text.secondary">
                      Колір:
                    </Typography>
                    <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
                      {vehicle.color}
                    </Typography>
                  </Stack>
                )}

                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2" color="text.secondary">
                    Місцезнаходження:
                  </Typography>
                  <Typography variant="body2">{vehicle.location}</Typography>
                </Stack>

                {vehicle.vin_code && (
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2" color="text.secondary">
                      VIN:
                    </Typography>
                    <Typography variant="body2" fontFamily="monospace">
                      {vehicle.vin_code}
                    </Typography>
                  </Stack>
                )}
              </Stack>
            </CardContent>
          </Card>

          
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Зв'язатися з продавцем
              </Typography>
              <Stack spacing={2}>
                <Button variant="contained" fullWidth startIcon={<Phone />} size="large">
                  Телефонувати
                </Button>
                <Button variant="outlined" fullWidth startIcon={<Email />} size="large">
                  Написати повідомлення
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default VehicleDetailPage;
