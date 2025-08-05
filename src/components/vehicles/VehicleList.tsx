import React from 'react';

import { Box, CircularProgress, Grid, Pagination, Typography } from '@mui/material';

import type { Vehicle } from '../../models/vehicle';
import VehicleCard from './VehicleCard';

interface VehicleListProps {
  vehicles: Vehicle[];
  isLoading?: boolean;
  error?: { message?: string } | null;
  totalCount?: number;
  currentPage?: number;
  pageSize?: number;
  onPageChange?: (_page: number) => void;
  showUserActions?: boolean;
  onEdit?: (_vehicle: Vehicle) => void;
  onDelete?: (_vehicleId: number) => void;
  favoriteIds?: Record<number, number>;
}

const VehicleList: React.FC<VehicleListProps> = ({
  vehicles,
  isLoading = false,
  error,
  totalCount = 0,
  currentPage = 1,
  pageSize = 10,
  onPageChange,
  showUserActions = false,
  onEdit,
  onDelete,
  favoriteIds = {},
}) => {
  const totalPages = Math.ceil(totalCount / pageSize);

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" py={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" py={4}>
        <Typography color="error">Помилка завантаження: {error.message || 'Невідома помилка'}</Typography>
      </Box>
    );
  }

  if (vehicles.length === 0) {
    return (
      <Box display="flex" justifyContent="center" py={4}>
        <Typography variant="h6" color="text.secondary">
          Транспортні засоби не знайдено
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Grid container spacing={3}>
        {vehicles.map((vehicle) => (
          <Grid item xs={12} sm={6} md={4} key={vehicle.id}>
            <VehicleCard
              vehicle={vehicle}
              isFavorite={!!favoriteIds[vehicle.id]}
              favoriteId={favoriteIds[vehicle.id]}
              showUserActions={showUserActions}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          </Grid>
        ))}
      </Grid>

      {totalPages > 1 && onPageChange && (
        <Box display="flex" justifyContent="center" mt={4}>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={(_, page) => onPageChange(page)}
            color="primary"
            size="large"
          />
        </Box>
      )}
    </Box>
  );
};

export default VehicleList;
