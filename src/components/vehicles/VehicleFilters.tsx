import React from 'react';
import { useTranslation } from 'react-i18next';

import { ExpandMore } from '@mui/icons-material';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from '@mui/material';

import { POPULAR_BRANDS } from '../../models/brands';
import { COLOR_TYPES, FUEL_TYPES, TRANSMISSION_TYPES, VEHICLE_TYPES } from '../../models/vehicle';
import type { VehicleFilters } from '../../models/vehicle';

interface VehicleFiltersProps {
  filters: VehicleFilters;
  onFiltersChange: (_filters: VehicleFilters) => void;
  onReset: () => void;
}

const VehicleFiltersComponent: React.FC<VehicleFiltersProps> = ({ filters, onFiltersChange, onReset }) => {
  const { t } = useTranslation();
  const handleFilterChange = (key: keyof VehicleFilters, value: string | number | string[] | undefined) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  const handleArrayFilterChange = (key: keyof VehicleFilters, value: string, checked: boolean) => {
    const currentArray = (filters[key] as string[]) || [];
    const newArray = checked ? [...currentArray, value] : currentArray.filter((item) => item !== value);

    handleFilterChange(key, newArray.length > 0 ? newArray : undefined);
  };

  return (
    <Paper sx={{ p: 2, mb: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">{t('common.filter')}</Typography>
        <Button onClick={onReset} size="small">
          {t('vehicles.filters.resetFilters')}
        </Button>
      </Box>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth size="small">
            <InputLabel>{t('vehicles.vehicleType')}</InputLabel>
            <Select
              value={filters.vehicle_type || ''}
              onChange={(e) => handleFilterChange('vehicle_type', e.target.value || undefined)}
            >
              <MenuItem value="">{t('vehicles.filters.allTypes')}</MenuItem>
              {VEHICLE_TYPES.map((type) => (
                <MenuItem key={type} value={type} sx={{ textTransform: 'capitalize' }}>
                  {type}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth size="small">
            <InputLabel>{t('vehicles.make')}</InputLabel>
            <Select
              value={filters.brand || ''}
              onChange={(e) => handleFilterChange('brand', e.target.value || undefined)}
            >
              <MenuItem value="">{t('vehicles.filters.allMakes')}</MenuItem>
              {POPULAR_BRANDS.map((brand) => (
                <MenuItem key={brand} value={brand}>
                  {brand}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <TextField
            fullWidth
            size="small"
            type="number"
            label={t('vehicles.filters.yearFrom')}
            value={filters.year_min || ''}
            onChange={(e) => handleFilterChange('year_min', e.target.value ? parseInt(e.target.value) : undefined)}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <TextField
            fullWidth
            size="small"
            type="number"
            label={t('vehicles.filters.yearTo')}
            value={filters.year_max || ''}
            onChange={(e) => handleFilterChange('year_max', e.target.value ? parseInt(e.target.value) : undefined)}
          />
        </Grid>
      </Grid>

      <Box mt={2}>
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography>{t('vehicles.filters.advancedFilters')}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle2" gutterBottom>
                  {t('vehicles.fuelType')}
                </Typography>
                <FormGroup>
                  {FUEL_TYPES.map((fuel) => (
                    <FormControlLabel
                      key={fuel}
                      control={
                        <Checkbox
                          checked={(filters.fuel_type || []).includes(fuel)}
                          onChange={(e) => handleArrayFilterChange('fuel_type', fuel, e.target.checked)}
                          size="small"
                        />
                      }
                      label={
                        <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
                          {fuel}
                        </Typography>
                      }
                    />
                  ))}
                </FormGroup>
              </Grid>

              <Grid item xs={12} md={4}>
                <Typography variant="subtitle2" gutterBottom>
                  {t('vehicles.transmission')}
                </Typography>
                <FormGroup>
                  {TRANSMISSION_TYPES.map((transmission) => (
                    <FormControlLabel
                      key={transmission}
                      control={
                        <Checkbox
                          checked={(filters.transmission || []).includes(transmission)}
                          onChange={(e) => handleArrayFilterChange('transmission', transmission, e.target.checked)}
                          size="small"
                        />
                      }
                      label={
                        <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
                          {transmission}
                        </Typography>
                      }
                    />
                  ))}
                </FormGroup>
              </Grid>

              <Grid item xs={12} md={4}>
                <Typography variant="subtitle2" gutterBottom>
                  {t('vehicles.color')}
                </Typography>
                <FormGroup>
                  {COLOR_TYPES.map((color) => (
                    <FormControlLabel
                      key={color}
                      control={
                        <Checkbox
                          checked={(filters.color || []).includes(color)}
                          onChange={(e) => handleArrayFilterChange('color', color, e.target.checked)}
                          size="small"
                        />
                      }
                      label={
                        <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
                          {color}
                        </Typography>
                      }
                    />
                  ))}
                </FormGroup>
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>
      </Box>
    </Paper>
  );
};

export default VehicleFiltersComponent;
