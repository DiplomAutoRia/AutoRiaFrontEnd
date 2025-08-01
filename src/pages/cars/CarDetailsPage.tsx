import React from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../../redux/store';
import type { Vehicle } from '../../redux/vehicles/vehiclesSlice';
import {
  Box,
  Button,
  Container,
  Grid,
  Paper,
  Typography,
  Chip,
  Stack,
  IconButton,
} from '@mui/material';
import {
  CalendarToday,
  DirectionsCar,
  LocalGasStation,
  LocationOn,
  Speed,
  ArrowBack,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const CarDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const vehicles = useSelector((state: RootState) => state.vehicles.vehicles);

  const vehicle: Vehicle | undefined = vehicles.find(v => v.id === id);

  if (!vehicle) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" align="center">
          Автомобіль не знайдено
        </Typography>
        <Button 
          variant="contained" 
          sx={{ mt: 2 }}
          onClick={() => navigate('/')}
        >
          На головну
        </Button>
      </Container>
    );
  }

  return (
    <Box sx={{ backgroundColor: '#f5f5f5', py: 6, minHeight: '100vh' }}>
      <Container maxWidth="lg">
        <Button
          variant="outlined"
          startIcon={<ArrowBack />}
          onClick={() => navigate(-1)}
          sx={{ mb: 3 }}
        >
          Назад
        </Button>
        
        <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
          <Typography variant="h3" gutterBottom>
            {vehicle.title}
          </Typography>
          
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              {vehicle.image ? (
                <Box sx={{ 
                  width: '100%', 
                  height: '400px', 
                  backgroundColor: '#e0e0e0',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  overflow: 'hidden',
                  borderRadius: 2
                }}>
                  <img
                    src={vehicle.image}
                    alt={vehicle.title}
                    style={{ 
                      maxWidth: '100%', 
                      maxHeight: '100%',
                      objectFit: 'contain' 
                    }}
                  />
                </Box>
              ) : (
                <Box sx={{ 
                  width: '100%', 
                  height: '400px', 
                  backgroundColor: '#e0e0e0',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 2
                }}>
                  <Typography variant="h6" color="textSecondary">
                    Зображення відсутнє
                  </Typography>
                </Box>
              )}
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Typography variant="h4" color="primary" gutterBottom>
                ${vehicle.price.toLocaleString()}
              </Typography>
              
              <Stack spacing={2} sx={{ mb: 3 }}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <CalendarToday color="action" />
                  <Typography variant="body1"><strong>Рік:</strong> {vehicle.year}</Typography>
                </Stack>
                
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Speed color="action" />
                  <Typography variant="body1"><strong>Пробіг:</strong> {vehicle.mileage.toLocaleString()} км</Typography>
                </Stack>
                
                <Stack direction="row" alignItems="center" spacing={1}>
                  <LocalGasStation color="action" />
                  <Typography variant="body1"><strong>Паливо:</strong> {vehicle.fuel}</Typography>
                </Stack>
                
                <Stack direction="row" alignItems="center" spacing={1}>
                  <DirectionsCar color="action" />
                  <Typography variant="body1"><strong>Коробка передач:</strong> {vehicle.transmission}</Typography>
                </Stack>
                
                <Stack direction="row" alignItems="center" spacing={1}>
                  <LocationOn color="action" />
                  <Typography variant="body1"><strong>Місцезнаходження:</strong> {vehicle.location}</Typography>
                </Stack>
              </Stack>
              
              <Stack direction="row" spacing={1}>
                <Button variant="contained" size="large">
                  Зателефонувати
                </Button>
                <Button variant="outlined" size="large">
                  Написати
                </Button>
              </Stack>
            </Grid>
            
            <Grid item xs={12}>
              <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
                Додаткова інформація
              </Typography>
              <Paper elevation={0} sx={{ p: 2, backgroundColor: '#f9f9f9', borderRadius: 2 }}>
                <Typography>
                  Додатковий опис автомобіля буде додано тут. Продавець може додати детальний опис стану автомобіля,
                  особливості експлуатації, інформацію про технічне обслуговування та інші важливі деталі.
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </Box>
  );
};

export default CarDetailsPage;
