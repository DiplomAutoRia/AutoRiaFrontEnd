import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import type { RootState } from '../../redux/store';

import {
  CalendarToday,
  DirectionsCar,
  FavoriteBorder,
  LocalGasStation,
  LocationOn,
  Search,
  Share,
  Speed,
} from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
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
  const [searchQuery, setSearchQuery] = React.useState('');
  const [brand, setBrand] = React.useState('');
  const [priceFrom, setPriceFrom] = React.useState('');
  const [priceTo, setPriceTo] = React.useState('');

  const vehicles = useSelector((state: RootState) => state.vehicles.vehicles);

  const popularBrands = ['BMW', 'Mercedes-Benz', 'Audi', 'Volkswagen', 'Toyota', 'Honda'];

  return (
    <Box sx={{ backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      {/* Hero Section */}
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

          {/* Search Form */}
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
            </Grid>
          </Paper>
        </Container>
      </Box>

      {/* Popular Brands */}
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

      {/* Featured Vehicles */}
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom>
          Рекомендовані автомобілі
        </Typography>
        <Grid container spacing={3}>
          {vehicles.map((vehicle) => (
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
                  image={vehicle.image}
                  alt={vehicle.title}
                  sx={{ backgroundColor: '#e0e0e0' }}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" component="h3" gutterBottom>
                    {vehicle.title}
                  </Typography>
                  <Typography variant="h5" color="primary" gutterBottom>
                    ${vehicle.price.toLocaleString()}
                  </Typography>

                  <Stack spacing={1}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <CalendarToday fontSize="small" color="action" />
                      <Typography variant="body2">{vehicle.year}</Typography>
                    </Stack>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Speed fontSize="small" color="action" />
                      <Typography variant="body2">{vehicle.mileage.toLocaleString()} км</Typography>
                    </Stack>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <LocalGasStation fontSize="small" color="action" />
                      <Typography variant="body2">{vehicle.fuel}</Typography>
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
      </Container>

      {/* Statistics */}
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
