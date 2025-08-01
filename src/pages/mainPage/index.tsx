import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import type { RootState, AppDispatch } from '../../redux/store';
import { fetchVehicles } from '../../redux/vehicles/vehiclesSlice';

import {
  CalendarToday,
  DirectionsCar,
  FavoriteBorder,
  LocalGasStation,
  LocationOn,
  Search,
  Share,
  Speed,
  AddCircleOutline,
} from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  CircularProgress,
  Container,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';

const MainPage = () => {
  const dispatch: AppDispatch = useDispatch();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [brand, setBrand] = React.useState('');
  const [priceFrom, setPriceFrom] = React.useState('');
  const [priceTo, setPriceTo] = React.useState('');

  const vehicles = useSelector((state: RootState) => state.vehicles.vehicles);
  const status = useSelector((state: RootState) => state.vehicles.status);
  const error = useSelector((state: RootState) => state.vehicles.error);

  useEffect(() => {
    dispatch(fetchVehicles());
  }, [dispatch]);

  const popularBrands = ['BMW', 'Mercedes-Benz', 'Audi', 'Volkswagen', 'Toyota', 'Honda'];

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
                    {popularBrands.map((brandName) => (
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
                <Button variant="contained" fullWidth size="large" startIcon={<Search />} sx={{ py: 1.5 }}>
                  Пошук
                </Button>
              </Grid>
              <Grid item xs={12} md={2}>
                <Button 
                  variant="outlined" 
                  fullWidth 
                  size="large" 
                  component={Link} 
                  to="/create"
                  sx={{ py: 1.5, borderWidth: 2, '&:hover': { borderWidth: 2 } }}
                >
                  Додати авто
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
          {popularBrands.map((brandName) => (
            <Chip key={brandName} label={brandName} variant="outlined" clickable sx={{ mb: 1 }} />
          ))}
        </Stack>
      </Container>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom>
          Рекомендовані автомобілі
        </Typography>

        {status === 'loading' && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress size={60} />
          </Box>
        )}

        {status === 'failed' && (
          <Box sx={{ backgroundColor: '#ffebee', p: 3, borderRadius: 2, textAlign: 'center' }}>
            <Typography variant="h6" color="error">
              Помилка завантаження: {error}
            </Typography>
            <Button 
              variant="outlined" 
              color="error" 
              sx={{ mt: 2 }}
              onClick={() => window.location.reload()}
            >
              Спробувати ще раз
            </Button>
          </Box>
        )}

        {status === 'succeeded' && vehicles.length === 0 && (
          <Box sx={{ backgroundColor: '#e3f2fd', p: 4, borderRadius: 2, textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom>
              Автомобілів не знайдено
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              Станьте першим, хто додасть автомобіль!
            </Typography>
            <Button 
              variant="contained" 
              component={Link} 
              to="/create"
              startIcon={<AddCircleOutline />}
            >
              Додати авто
            </Button>
          </Box>
        )}

        {status === 'succeeded' && vehicles.length > 0 && (
          <>
            <Grid container spacing={3}>
              {vehicles.map((vehicle: any) => (
              <Grid item xs={12} sm={6} md={4} key={vehicle.id}>
                <Card 
                component={Link} 
                to={`/car/${vehicle.id}`}
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  textDecoration: 'none',
                  '&:hover': {
                    boxShadow: 6,
                    transform: 'translateY(-4px)',
                    transition: 'all 0.3s ease',
                  }
                }}
              >
                  <CardMedia
                    component="img"
                    height="200"
                    image={vehicle.images && vehicle.images.length > 0 
                      ? vehicle.images[0].image 
                      : 'https://via.placeholder.com/300x200?text=No+Image'}
                    alt={`${vehicle.brand} ${vehicle.model}`}
                    sx={{ backgroundColor: '#e0e0e0' }}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" component="h3" gutterBottom>
                      {vehicle.brand} {vehicle.model}
                    </Typography>
                    <Typography variant="h5" color="primary" gutterBottom>
                      {vehicle.currency === 'USD' ? '$' : 
                       vehicle.currency === 'EUR' ? '€' : 
                       vehicle.currency === 'UAH' ? '₴' : ''}
                      {vehicle.price.toLocaleString()}
                    </Typography>

                    <Stack spacing={1}>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <CalendarToday fontSize="small" color="action" />
                        <Typography variant="body2">{vehicle.year}</Typography>
                      </Stack>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Speed fontSize="small" color="action" />
                        <Typography variant="body2">{vehicle.mileage?.toLocaleString() || '0'} км</Typography>
                      </Stack>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <LocalGasStation fontSize="small" color="action" />
                        <Typography variant="body2">{vehicle.fuel_type}</Typography>
                      </Stack>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <DirectionsCar fontSize="small" color="action" />
                        <Typography variant="body2">{vehicle.transmission}</Typography>
                      </Stack>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <LocationOn fontSize="small" color="action" />
                        <Typography variant="body2">{vehicle.location}</Typography>
                      </Stack>
                    </Stack>
                </CardContent>
                <Box sx={{ p: 2, pt: 0 }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Button variant="contained" size="small">
                      Детальніше
                    </Button>
                    <Stack direction="row" spacing={1}>
                      <IconButton size="small">
                        <FavoriteBorder />
                      </IconButton>
                      <IconButton size="small">
                        <Share />
                      </IconButton>
                    </Stack>
                  </Stack>
                </Box>
              </Card>
            </Grid>
            ))}
            </Grid>
            
          </>
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
