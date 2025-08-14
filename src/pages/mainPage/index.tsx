import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { Search } from '@mui/icons-material';
import {
  Box,
  Button,
  Chip,
  Container,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';

import VehicleCard from '../../components/vehicles/VehicleCard';
import { POPULAR_BRANDS } from '../../models/brands';
import { useGetFavoritesQuery } from '../../redux/api/favoritesApi';
import { useGetVehiclesQuery } from '../../redux/api/vehiclesApi';
import type { RootState } from '../../redux/store';

const MainPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [brand, setBrand] = React.useState('');
  const [priceFrom, setPriceFrom] = React.useState('');
  const [priceTo, setPriceTo] = React.useState('');

  const user = useSelector((state: RootState) => state.auth.user);
  const { data: vehiclesData } = useGetVehiclesQuery({ limit: 6 });
  const { data: favorites = [] } = useGetFavoritesQuery(undefined, { skip: !user });

  const favoriteIds = favorites.reduce(
    (acc, fav) => {
      acc[fav.vehicle] = fav.id;
      return acc;
    },
    {} as Record<number, number>,
  );

  const handleSearch = () => {
    const searchParams = new URLSearchParams();
    if (searchQuery) searchParams.set('search', searchQuery);
    if (brand) searchParams.set('brand', brand);
    if (priceFrom) searchParams.set('price_from', priceFrom);
    if (priceTo) searchParams.set('price_to', priceTo);
    navigate(`/vehicles?${searchParams.toString()}`);
  };

  const handleBrandClick = (brandName: string) => {
    navigate(`/vehicles?brand=${brandName}`);
  };

  return (
    <Box sx={{ backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <Box
        sx={{
          background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
          color: 'white',
          py: 6,
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="h2" component="h1" gutterBottom align="center">
            AutoRia
          </Typography>
          <Typography variant="h5" component="p" gutterBottom align="center" sx={{ mb: 4 }}>
            Найкращі автомобілі України
          </Typography>

          <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Пошук автомобіля"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  InputProps={{
                    startAdornment: <Search sx={{ color: 'text.secondary', mr: 1 }} />,
                  }}
                />
              </Grid>
              <Grid item xs={12} md={2}>
                <FormControl fullWidth>
                  <InputLabel>Марка</InputLabel>
                  <Select value={brand} onChange={(e) => setBrand(e.target.value)}>
                    {POPULAR_BRANDS.map((brandName) => (
                      <MenuItem key={brandName} value={brandName}>
                        {brandName}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={2}>
                <TextField
                  fullWidth
                  label="Ціна від"
                  type="number"
                  value={priceFrom}
                  onChange={(e) => setPriceFrom(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={2}>
                <TextField
                  fullWidth
                  label="Ціна до"
                  type="number"
                  value={priceTo}
                  onChange={(e) => setPriceTo(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={2}>
                <Button
                  variant="contained"
                  fullWidth
                  size="large"
                  startIcon={<Search />}
                  sx={{ py: 1.5 }}
                  onClick={handleSearch}
                >
                  Пошук
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom>
          Популярні марки
        </Typography>
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          {POPULAR_BRANDS.map((brandName) => (
            <Chip
              key={brandName}
              label={brandName}
              variant="outlined"
              clickable
              sx={{ mb: 1 }}
              onClick={() => handleBrandClick(brandName)}
            />
          ))}
        </Stack>
      </Container>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4" gutterBottom>
            Рекомендовані автомобілі
          </Typography>
          <Button variant="outlined" onClick={() => navigate('/vehicles')}>
            Переглянути всі
          </Button>
        </Box>

        <Grid container spacing={3}>
          {vehiclesData?.results?.slice(0, 6).map((vehicle) => (
            <Grid item xs={12} sm={6} md={4} key={vehicle.id}>
              <VehicleCard
                vehicle={vehicle}
                isFavorite={user ? !!favoriteIds[vehicle.id] : false}
                favoriteId={user ? favoriteIds[vehicle.id] : undefined}
              />
            </Grid>
          ))}
        </Grid>

        {!vehiclesData?.results?.length && (
          <Box textAlign="center" py={8}>
            <Typography variant="h6" color="text.secondary">
              Завантаження оголошень...
            </Typography>
          </Box>
        )}
      </Container>

      <Box sx={{ backgroundColor: 'white', py: 6 }}>
        <Container maxWidth="lg">
          <Grid container spacing={4} textAlign="center">
            <Grid item xs={12} md={3}>
              <Typography variant="h3" color="primary">
                10,000+
              </Typography>
              <Typography variant="h6">Автомобілів</Typography>
            </Grid>
            <Grid item xs={12} md={3}>
              <Typography variant="h3" color="primary">
                5,000+
              </Typography>
              <Typography variant="h6">Довірених продавців</Typography>
            </Grid>
            <Grid item xs={12} md={3}>
              <Typography variant="h3" color="primary">
                15,000+
              </Typography>
              <Typography variant="h6">Задоволених клієнтів</Typography>
            </Grid>
            <Grid item xs={12} md={3}>
              <Typography variant="h3" color="primary">
                24/7
              </Typography>
              <Typography variant="h6">Підтримка</Typography>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default MainPage;
