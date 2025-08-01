import React from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../../redux/store';
import vehiclesAPI from '../../api/vehiclesAPI';
import { CircularProgress } from '@mui/material';
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


interface Vehicle {
  id: string;
  brand: string;
  model: string;
  images: Array<{ image: string }>;
  price: number;
  currency: string;
  year: number;
  mileage: number;
  fuel_type: string;
  transmission: string;
  location: string;
  description?: string;
}

const CarDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const vehicles = useSelector((state: RootState) => state.vehicles.vehicles);

  const [vehicle, setVehicle] = React.useState<Vehicle | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchVehicle = async () => {
      try {
        setLoading(true);
        const response = await vehiclesAPI.getById(id!);
        setVehicle(response.data);
      } catch (err) {
        setError('Не вдалося завантажити дані автомобіля');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchVehicle();
    }
  }, [id]);

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 2 }}>Завантаження...</Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" align="center" color="error">
          {error}
        </Typography>
        <Button 
          variant="contained" 
          sx={{ mt: 2, mx: 'auto', display: 'block' }}
          onClick={() => navigate('/')}
        >
          На головну
        </Button>
      </Container>
    );
  }

  if (!vehicle) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" align="center">
          Автомобіль не знайдено
        </Typography>
        <Button 
          variant="contained" 
          sx={{ mt: 2, mx: 'auto', display: 'block' }}
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
            {vehicle.brand} {vehicle.model}
          </Typography>
          
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Box sx={{ 
                width: '100%', 
                backgroundColor: '#e0e0e0',
                borderRadius: 2,
                overflow: 'hidden'
              }}>
                {vehicle.images && vehicle.images.length > 0 ? (
<Grid container spacing={1}>
  <Grid item xs={12}>
    <Box sx={{ 
      height: '500px', 
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      overflow: 'hidden'
    }}>
      <img
        src={vehicle.images[0].image}
        alt={`${vehicle.brand} ${vehicle.model}`}
        style={{ 
          width: '100%', 
          height: '100%',
          objectFit: 'cover' 
        }}
      />
    </Box>
  </Grid>
  <Grid item xs={12}>
    <Grid container spacing={1}>
      {vehicle.images.slice(1, 5).map((image: { image: string }, index: number) => (
        <Grid item xs={6} sm={3} key={index}>
          <Box sx={{ 
            height: '200px', 
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            overflow: 'hidden'
          }}>
            <img
              src={image.image}
              alt={`${vehicle.brand} ${vehicle.model} ${index + 1}`}
              style={{ 
                width: '100%', 
                height: '100%',
                objectFit: 'cover' 
              }}
            />
          </Box>
        </Grid>
      ))}
    </Grid>
  </Grid>
</Grid>
                ) : (
                  <Box sx={{ 
                    width: '100%', 
                    height: '400px', 
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                    <Typography variant="h6" color="textSecondary">
                      Зображення відсутні
                    </Typography>
                  </Box>
                )}
              </Box>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Typography variant="h4" color="primary" gutterBottom>
                {vehicle.currency === 'USD' ? '$' : 
                 vehicle.currency === 'EUR' ? '€' : 
                 vehicle.currency === 'UAH' ? '₴' : ''}
                {vehicle.price.toLocaleString()}
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
                  <Typography variant="body1"><strong>Паливо:</strong> {vehicle.fuel_type}</Typography>
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
                {vehicle.description ? (
                  <Typography>{vehicle.description}</Typography>
                ) : (
                  <Typography>
                    Продавець не надав додатковий опис. Ви можете зв'язатися з продавцем для отримання більше інформації.
                  </Typography>
                )}
              </Paper>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </Box>
  );
};

export default CarDetailsPage;
