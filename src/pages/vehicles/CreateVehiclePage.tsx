import React from 'react';
import { useNavigate } from 'react-router-dom';

import { Alert, Container } from '@mui/material';

import VehicleForm from '../../components/vehicles/VehicleForm';
import type { VehicleCreateRequest } from '../../models/vehicle';
import { useCreateVehicleMutation } from '../../redux/api/vehiclesApi';

const CreateVehiclePage: React.FC = () => {
  const navigate = useNavigate();
  const [createVehicle, { isLoading, error }] = useCreateVehicleMutation();

  const handleSubmit = async (data: VehicleCreateRequest & { uploaded_images?: File[] }) => {
    try {
      const result = await createVehicle(data).unwrap();
      navigate(`/vehicles/${result.id}`);
    } catch {}
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          Помилка створення оголошення. Спробуйте ще раз.
        </Alert>
      )}

      <VehicleForm onSubmit={handleSubmit} onCancel={handleCancel} isLoading={isLoading} />
    </Container>
  );
};

export default CreateVehiclePage;
