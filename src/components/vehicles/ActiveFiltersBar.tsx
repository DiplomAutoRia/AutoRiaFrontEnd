import React from 'react';
import {
  Box,
  Chip,
  Typography,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import type { VehicleFilters } from '../../models/vehicle';

interface ActiveFiltersBarProps {
  filters: VehicleFilters;
  onFilterRemove: (key: keyof VehicleFilters, value?: string) => void;
}

const ActiveFiltersBar: React.FC<ActiveFiltersBarProps> = ({ filters, onFilterRemove }) => {
  const activeFilters: { key: keyof VehicleFilters; label: string; value: string }[] = [];

  // Add brand filter
  if (filters.brand) {
    activeFilters.push({
      key: 'brand',
      label: `Марка: ${filters.brand}`,
      value: filters.brand
    });
  }

  // Add model filter
  if (filters.model && filters.model.length > 0) {
    activeFilters.push({
      key: 'model',
      label: `Модель: ${filters.model[0]}`,
      value: filters.model[0]
    });
  }

  // Add year range filters
  if (filters.year_min) {
    activeFilters.push({
      key: 'year_min',
      label: `Рік від: ${filters.year_min}`,
      value: filters.year_min.toString()
    });
  }

  if (filters.year_max) {
    activeFilters.push({
      key: 'year_max',
      label: `Рік до: ${filters.year_max}`,
      value: filters.year_max.toString()
    });
  }

  // Add price range filters
  if (filters.price_min) {
    activeFilters.push({
      key: 'price_min',
      label: `Ціна від: ${filters.price_min.toLocaleString()} грн`,
      value: filters.price_min.toString()
    });
  }

  if (filters.price_max) {
    activeFilters.push({
      key: 'price_max',
      label: `Ціна до: ${filters.price_max.toLocaleString()} грн`,
      value: filters.price_max.toString()
    });
  }

  // Add location filter
  if (filters.location) {
    activeFilters.push({
      key: 'location',
      label: `Регіон: ${filters.location}`,
      value: filters.location
    });
  }

  // Add vehicle type filter
  if (filters.vehicle_type) {
    activeFilters.push({
      key: 'vehicle_type',
      label: `Тип: ${filters.vehicle_type}`,
      value: filters.vehicle_type
    });
  }

  // Add body type filters
  if (filters.body_type && filters.body_type.length > 0) {
    filters.body_type.forEach(bodyType => {
      activeFilters.push({
        key: 'body_type',
        label: `Кузов: ${bodyType}`,
        value: bodyType
      });
    });
  }

  // Add fuel type filters
  if (filters.fuel_type && filters.fuel_type.length > 0) {
    filters.fuel_type.forEach(fuelType => {
      activeFilters.push({
        key: 'fuel_type',
        label: `Паливо: ${fuelType}`,
        value: fuelType
      });
    });
  }

  // Add transmission filters
  if (filters.transmission && filters.transmission.length > 0) {
    filters.transmission.forEach(transmission => {
      activeFilters.push({
        key: 'transmission',
        label: `КПП: ${transmission}`,
        value: transmission
      });
    });
  }

  // Add color filters
  if (filters.color && filters.color.length > 0) {
    filters.color.forEach(color => {
      activeFilters.push({
        key: 'color',
        label: `Колір: ${color}`,
        value: color
      });
    });
  }

  // Add drive type filter
  if (filters.drive_type) {
    activeFilters.push({
      key: 'drive_type',
      label: `Привід: ${filters.drive_type}`,
      value: filters.drive_type
    });
  }

  // Add technical condition filter
  if (filters.technical_condition) {
    activeFilters.push({
      key: 'technical_condition',
      label: `Стан: ${filters.technical_condition}`,
      value: filters.technical_condition
    });
  }

  // Add custom cleared filter
  if (filters.is_custom_cleared) {
    activeFilters.push({
      key: 'is_custom_cleared',
      label: 'Розмитнена',
      value: 'true'
    });
  }


  const handleChipDelete = (filterKey: keyof VehicleFilters, filterValue?: string) => {
    onFilterRemove(filterKey, filterValue);
  };

  return (
    <Box sx={{ mb: 3, ml: 2 }}>
      <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1, color: 'text.primary' }}>
        Активні фільтри:
      </Typography>
      {activeFilters.length > 0 ? (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {activeFilters.map((filter, index) => (
            <Chip
              key={`${filter.key}-${filter.value}-${index}`}
              label={filter.label}
              onDelete={() => handleChipDelete(filter.key, filter.value)}
              deleteIcon={<CloseIcon />}
              variant="outlined"
              sx={{
                borderRadius: 0,
                borderColor: 'primary.main',
                color: 'primary.main',
                '& .MuiChip-deleteIcon': {
                  color: 'primary.main',
                  '&:hover': {
                    color: 'primary.dark',
                  },
                },
              }}
            />
          ))}
        </Box>
      ) : (
        <Typography variant="body2" color="text.secondary">
          Немає активних фільтрів
        </Typography>
      )}
    </Box>
  );
};

export default ActiveFiltersBar;
