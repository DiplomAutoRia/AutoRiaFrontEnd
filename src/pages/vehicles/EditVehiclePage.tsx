import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { Alert, Box, CircularProgress, Container } from '@mui/material';

import VehicleForm from '../../components/vehicles/VehicleForm';
import type { VehicleCreateRequest } from '../../models/vehicle';
import { useGetVehicleQuery, useUpdateVehicleMutation } from '../../redux/api/vehiclesApi';

const EditVehiclePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: vehicle, isLoading: isLoadingVehicle, error: loadError } = useGetVehicleQuery(Number(id));
  const [updateVehicle, { isLoading: isUpdating, error: updateError }] = useUpdateVehicleMutation();

  const handleSubmit = async (data: VehicleCreateRequest & { uploaded_images?: File[] }) => {
    try {
      const result = await updateVehicle({ id: Number(id), data }).unwrap();
      navigate(`/vehicles/${result.id}`);
    } catch {}
  };

  const handleCancel = () => {
    navigate(-1);
  };

  if (isLoadingVehicle) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Box display="flex" justifyContent="center">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (loadError || !vehicle) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error">Помилка завантаження оголошення або оголошення не знайдено.</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {updateError && (
        <Alert severity="error" sx={{ mb: 3 }}>
          Помилка оновлення оголошення. Спробуйте ще раз.
        </Alert>
      )}

      <VehicleForm vehicle={vehicle} onSubmit={handleSubmit} onCancel={handleCancel} isLoading={isUpdating} />
    </Container>
  );
};

export default EditVehiclePage;
