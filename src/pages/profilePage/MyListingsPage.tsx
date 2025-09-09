import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { ArrowBack } from '@mui/icons-material';
import { Box, Button, Card, CardContent, CardMedia, Container, Grid, Typography } from '@mui/material';

import ConfirmDialog from '../../componetns/ConfirmDialog';
import type { AppDispatch, RootState } from '../../redux/store';
import { deleteVehicle, fetchUserVehicles } from '../../redux/vehicles/vehiclesSlice';
import { routes } from '../../routes';

const MyListingsPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { userVehicles, status, error } = useSelector((state: RootState) => state.vehicles);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [vehicleToDelete, setVehicleToDelete] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchUserVehicles());
  }, [dispatch]);

  const handleDelete = (vehicleId: string) => {
    setVehicleToDelete(vehicleId);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (vehicleToDelete) {
      dispatch(deleteVehicle(vehicleToDelete));
      setConfirmOpen(false);
      setVehicleToDelete(null);
    }
  };

  const handleEdit = (vehicleId: string) => {
    navigate(routes.EDIT_LISTING.replace(':id', vehicleId));
  };

  if (status === 'loading') {
    return (
      <Container maxWidth="lg" sx={{ py: 4, textAlign: 'center' }}>
        <Typography variant="h6">Завантаження ваших оголошень...</Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h6" color="error" align="center">
          Помилка: {error}
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Button variant="outlined" startIcon={<ArrowBack />} onClick={() => navigate(-1)} sx={{ mb: 3 }}>
        Назад
      </Button>

      <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
        Мої оголошення
      </Typography>

      {userVehicles.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            У вас ще немає оголошень
          </Typography>
          <Button variant="contained" onClick={() => navigate(routes.CREATE)}>
            Створити оголошення
          </Button>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {userVehicles.map((vehicle: any) => (
            <Grid item xs={12} sm={6} md={4} key={vehicle.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                {vehicle.images && vehicle.images.length > 0 ? (
                  <CardMedia
                    component="img"
                    height="200"
                    image={vehicle.images[0].image}
                    alt={`${vehicle.brand} ${vehicle.model}`}
                  />
                ) : (
                  <Box
                    sx={{
                      height: 200,
                      bgcolor: '#e0e0e0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Typography variant="body2" color="textSecondary">
                      Зображення відсутнє
                    </Typography>
                  </Box>
                )}
                <CardContent>
                  <Typography gutterBottom variant="h6">
                    {vehicle.brand} {vehicle.model}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Рік: {vehicle.year}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Пробіг: {vehicle.mileage.toLocaleString()} км
                  </Typography>
                  <Typography variant="h6" color="primary" sx={{ mt: 1 }}>
                    {vehicle.currency === 'USD'
                      ? '$'
                      : vehicle.currency === 'EUR'
                        ? '€'
                        : vehicle.currency === 'UAH'
                          ? '₴'
                          : ''}
                    {vehicle.price.toLocaleString()}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                    <Button variant="outlined" fullWidth onClick={() => handleEdit(vehicle.id)}>
                      Редагувати
                    </Button>
                    <Button variant="outlined" color="error" fullWidth onClick={() => handleDelete(vehicle.id)}>
                      Видалити
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <ConfirmDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Підтвердження видалення"
        message="Ви впевнені, що хочете видалити це оголошення? Ця дія незворотня."
      />
    </Container>
  );
};

export default MyListingsPage;
