import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { Delete, Visibility } from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  CircularProgress,
  Container,
  Grid,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';

import { useGetFavoritesQuery, useRemoveFromFavoritesMutation } from '../../redux/api/favoritesApi';

const FavoritesPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { data: favorites = [], isLoading, error } = useGetFavoritesQuery();
  const [removeFromFavorites] = useRemoveFromFavoritesMutation();

  const handleRemoveFavorite = async (favoriteId: number) => {
    console.log('Trying to remove favorite with ID:', favoriteId);
    try {
      await removeFromFavorites(favoriteId).unwrap();
      console.log('Successfully removed favorite');
    } catch (error) {
      console.error('Error removing favorite:', error);
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

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">{t('errors.networkError')}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        {t('favorites.title')}
      </Typography>

      {favorites.length === 0 ? (
        <Box textAlign="center" py={8}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            {t('favorites.empty')}
          </Typography>
          <Typography variant="body1" color="text.secondary" gutterBottom>
            {t('favorites.addToFindEasily')}
          </Typography>
          <Button variant="contained" onClick={() => navigate('/')} sx={{ mt: 2 }}>
            {t('favorites.browseListings')}
          </Button>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {favorites.map((favorite) => (
            <Grid item xs={12} sm={6} md={4} key={favorite.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={
                    favorite.vehicle_details.images && favorite.vehicle_details.images.length > 0
                      ? favorite.vehicle_details.images[0].image
                      : '/api/placeholder/300/200'
                  }
                  alt={`${favorite.vehicle_details.brand} ${favorite.vehicle_details.model}`}
                  sx={{ backgroundColor: '#e0e0e0' }}
                />

                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" component="h3" gutterBottom>
                    {favorite.vehicle_details.brand} {favorite.vehicle_details.model} {favorite.vehicle_details.year}
                  </Typography>

                  <Typography variant="h5" color="primary" gutterBottom>
                    {formatPrice(favorite.vehicle_details.price, favorite.vehicle_details.currency)}
                  </Typography>

                  <Typography variant="body2" color="text.secondary">
                    {favorite.vehicle_details.location}
                  </Typography>

                  <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
                    {t('favorites.addedToFavorites')}: {new Date(favorite.created_at).toLocaleDateString('uk-UA')}
                  </Typography>
                </CardContent>

                <Box sx={{ p: 2, pt: 0 }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Button
                      variant="contained"
                      size="small"
                      startIcon={<Visibility />}
                      onClick={() => navigate(`/vehicles/${favorite.vehicle}`)}
                    >
                      {t('common.view')}
                    </Button>

                    <Tooltip title={t('vehicles.removeFromFavorites')}>
                      <IconButton size="small" color="error" onClick={() => handleRemoveFavorite(favorite.id)}>
                        <Delete />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {favorites.length > 0 && (
        <Box mt={4} textAlign="center">
          <Typography variant="body2" color="text.secondary">
            {t('favorites.totalFavorites')}: {favorites.length}
          </Typography>
        </Box>
      )}
    </Container>
  );
};

export default FavoritesPage;
