import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Add } from '@mui/icons-material';
import { Box, Button, Container, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';

import { getErrorMessage } from '../../common/utils/errorUtils';
import VehicleList from '../../components/vehicles/VehicleList';
import type { Vehicle } from '../../models/vehicle';
import { useDeleteVehicleMutation, useGetMyVehiclesQuery } from '../../redux/api/vehiclesApi';

const MyVehiclesPage: React.FC = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [vehicleToDelete, setVehicleToDelete] = useState<number | null>(null);

  const { data, isLoading, error } = useGetMyVehiclesQuery({ page: currentPage, limit: 10 });
  const [deleteVehicle, { isLoading: isDeleting }] = useDeleteVehicleMutation();

  const handleEdit = (vehicle: Vehicle) => {
    navigate(`/vehicles/${vehicle.id}/edit`);
  };

  const handleDeleteClick = (vehicleId: number) => {
    setVehicleToDelete(vehicleId);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (vehicleToDelete) {
      try {
        await deleteVehicle(vehicleToDelete).unwrap();
        setDeleteConfirmOpen(false);
        setVehicleToDelete(null);
      } catch {}
    }
  };

  const handleDeleteCancel = () => {
    setDeleteConfirmOpen(false);
    setVehicleToDelete(null);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" component="h1">
          Мої оголошення
        </Typography>

        <Button variant="contained" startIcon={<Add />} onClick={() => navigate('/create')}>
          Додати оголошення
        </Button>
      </Box>

      {data?.results && data.results.length === 0 && !isLoading ? (
        <Box textAlign="center" py={8}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            У вас поки немає оголошень
          </Typography>
          <Typography variant="body1" color="text.secondary" gutterBottom>
            Створіть своє перше оголошення про продаж транспортного засобу
          </Typography>
          <Button variant="contained" startIcon={<Add />} onClick={() => navigate('/create')} sx={{ mt: 2 }}>
            Створити оголошення
          </Button>
        </Box>
      ) : (
        <VehicleList
          vehicles={data?.results || []}
          isLoading={isLoading}
          error={error ? { message: getErrorMessage(error) } : null}
          totalCount={data?.count || 0}
          currentPage={currentPage}
          pageSize={data?.page_size || 10}
          onPageChange={handlePageChange}
          showUserActions={true}
          onEdit={handleEdit}
          onDelete={handleDeleteClick}
        />
      )}

      <Dialog open={deleteConfirmOpen} onClose={handleDeleteCancel} maxWidth="sm" fullWidth>
        <DialogTitle>Підтвердження видалення</DialogTitle>
        <DialogContent>
          <Typography>Ви впевнені, що хочете видалити це оголошення? Цю дію неможливо скасувати.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} disabled={isDeleting}>
            Скасувати
          </Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained" disabled={isDeleting}>
            Видалити
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default MyVehiclesPage;
