import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { RestartAlt as RestartAltIcon } from '@mui/icons-material';
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from '@mui/material';

import { POPULAR_BRANDS } from '../../models/brands';
import {
  CAR_BODY_TYPES,
  COLOR_TYPES,
  DRIVE_TYPES,
  FUEL_TYPES,
  TECHNICAL_CONDITIONS,
  TRANSMISSION_TYPES,
  VEHICLE_TYPES,
} from '../../models/vehicle';
import type { VehicleFilters } from '../../models/vehicle';

interface VehicleFiltersProps {
  filters: VehicleFilters;
  onFiltersChange: (_filters: VehicleFilters) => void;
  onReset: () => void;
  resultsCount?: number;
}

const VehicleFiltersComponent: React.FC<VehicleFiltersProps> = ({
  filters,
  onFiltersChange,
  onReset,
  resultsCount = 0,
}) => {
  const { t } = useTranslation();
  const [showAllBodyTypes, setShowAllBodyTypes] = useState(false);

  const handleFilterChange = (key: keyof VehicleFilters, value: string | number | string[] | boolean | undefined) => {
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

  const displayedBodyTypes = showAllBodyTypes ? CAR_BODY_TYPES : CAR_BODY_TYPES.slice(0, 5);

  return (
    <Paper sx={{ p: 2, mb: 3, boxShadow: 'none', border: 'none', backgroundColor: 'transparent' }}>
      <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'black', mb: 3 }}>
        Фільтри
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {/* Б/У/Нова */}
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'black', mb: 1 }}>
            Стан
          </Typography>
          <FormControl fullWidth size="small">
            <InputLabel>Б/У/Нова</InputLabel>
            <Select
              value={filters.is_new !== undefined ? (filters.is_new ? 'new' : 'used') : ''}
              onChange={(e) => {
                if (e.target.value === 'new') {
                  handleFilterChange('is_new', true);
                } else if (e.target.value === 'used') {
                  handleFilterChange('is_new', false);
                } else {
                  handleFilterChange('is_new', undefined);
                }
              }}
              sx={{
                backgroundColor: 'transparent'
              }}
            >
              <MenuItem value="">Всі</MenuItem>
              <MenuItem value="new">Нова</MenuItem>
              <MenuItem value="used">Б/У</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {/* Тип транспорту */}
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'black', mb: 1 }}>
            Тип транспорту
          </Typography>
          <FormControl fullWidth size="small">
            <InputLabel>{t('vehicles.vehicleType')}</InputLabel>
            <Select
              value={filters.vehicle_type || ''}
              onChange={(e) => handleFilterChange('vehicle_type', e.target.value || undefined)}
              sx={{
                backgroundColor: 'transparent',
              }}
            >
              <MenuItem value="">{t('vehicles.filters.allTypes')}</MenuItem>
              {VEHICLE_TYPES.map((type) => (
                <MenuItem key={type} value={type} sx={{ textTransform: 'capitalize' }}>
                  {type}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {/* Тип кузова */}
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'black', mb: 1 }}>
            Тип кузова
          </Typography>
          <FormGroup>
            {displayedBodyTypes.map((bodyType) => (
              <FormControlLabel
                key={bodyType}
                control={
                  <Checkbox
                    checked={(filters.body_type || []).includes(bodyType)}
                    onChange={(e) => handleArrayFilterChange('body_type', bodyType, e.target.checked)}
                    size="small"
                    sx={{
                      '& .MuiSvgIcon-root': {
                        fontSize: 20,
                      },
                      color: 'rgba(0, 0, 0, 0.6)',
                      '&.Mui-checked': {
                        color: '#156ff5',
                      },
                    }}
                  />
                }
                label={
                  <Typography variant="body1" sx={{ textTransform: 'capitalize', fontSize: '1rem' }}>
                    {bodyType}
                  </Typography>
                }
              />
            ))}
            {CAR_BODY_TYPES.length > 5 && (
              <Button
                size="medium"
                onClick={() => setShowAllBodyTypes(!showAllBodyTypes)}
                sx={{ mt: 1, justifyContent: 'flex-start', fontSize: '1rem' }}
              >
                {showAllBodyTypes ? 'Сховати' : 'Показати все'}
              </Button>
            )}
          </FormGroup>
        </Box>

        {/* Марка */}
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'black', mb: 1 }}>
            Марка
          </Typography>
          <FormControl fullWidth size="small">
            <InputLabel>{t('vehicles.make')}</InputLabel>
            <Select
              value={filters.brand || ''}
              onChange={(e) => handleFilterChange('brand', e.target.value || undefined)}
              sx={{
                backgroundColor: 'transparent',
              }}
            >
              <MenuItem value="">{t('vehicles.filters.allMakes')}</MenuItem>
              {POPULAR_BRANDS.map((brand) => (
                <MenuItem key={brand} value={brand}>
                  {brand}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {/* Модель */}
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'black', mb: 1 }}>
            Модель
          </Typography>
          <FormControl fullWidth size="small">
            <InputLabel>Модель</InputLabel>
            <Select
              value={filters.model?.[0] || ''}
              onChange={(e) => handleFilterChange('model', e.target.value ? [e.target.value] : undefined)}
              disabled={!filters.brand}
              sx={{
                backgroundColor: 'transparent',
              }}
            >
              <MenuItem value="">Всі моделі</MenuItem>
              {/* Моделі будуть динамічно завантажуватись на основі обраної марки */}
            </Select>
          </FormControl>
        </Box>

        {/* Рік */}
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'black', mb: 1 }}>
            Рік
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField
              fullWidth
              size="small"
              type="number"
              label="Від"
              value={filters.year_min || ''}
              onChange={(e) => handleFilterChange('year_min', e.target.value ? parseInt(e.target.value) : undefined)}
              sx={{
                backgroundColor: 'transparent',
              }}
            />
            <TextField
              fullWidth
              size="small"
              type="number"
              label="До"
              value={filters.year_max || ''}
              onChange={(e) => handleFilterChange('year_max', e.target.value ? parseInt(e.target.value) : undefined)}
              sx={{
                backgroundColor: 'transparent',
              }}
            />
          </Box>
        </Box>

        {/* Ціна */}
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'black', mb: 1 }}>
            Ціна
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField
              fullWidth
              size="small"
              type="number"
              label="Від"
              value={filters.price_min || ''}
              onChange={(e) => handleFilterChange('price_min', e.target.value ? parseInt(e.target.value) : undefined)}
              sx={{
                backgroundColor: 'transparent',
              }}
            />
            <TextField
              fullWidth
              size="small"
              type="number"
              label="До"
              value={filters.price_max || ''}
              onChange={(e) => handleFilterChange('price_max', e.target.value ? parseInt(e.target.value) : undefined)}
              sx={{
                backgroundColor: 'transparent',
              }}
            />
          </Box>
        </Box>

        {/* Регіон */}
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'black', mb: 1 }}>
            Регіон
          </Typography>
          <FormControl fullWidth size="small">
            <InputLabel>Регіон</InputLabel>
            <Select
              value={filters.location || ''}
              onChange={(e) => handleFilterChange('location', e.target.value || undefined)}
              sx={{
                backgroundColor: 'transparent',
              }}
            >
              <MenuItem value="">Всі регіони</MenuItem>
              {/* Тут мають бути регіони з бекенду */}
            </Select>
          </FormControl>
        </Box>

        {/* Інші фільтри чекбоксами */}
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'black', mb: 2 }}>
            Додаткові фільтри
          </Typography>

          {/* Тип палива */}
          <Box mb={2}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'black', mb: 1 }}>
              Тип палива
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
                      sx={{
                        '& .MuiSvgIcon-root': {
                          fontSize: 20,
                        },
                        color: 'rgba(0, 0, 0, 0.6)',
                        '&.Mui-checked': {
                          color: '#156ff5',
                        },
                      }}
                    />
                  }
                  label={
                    <Typography variant="body1" sx={{ textTransform: 'capitalize', fontSize: '1rem' }}>
                      {fuel}
                    </Typography>
                  }
                />
              ))}
            </FormGroup>
          </Box>

          {/* Коробка передач */}
          <Box mb={2}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'black', mb: 1 }}>
              Коробка передач
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
                      sx={{
                        '& .MuiSvgIcon-root': {
                          fontSize: 20,
                        },
                        color: 'rgba(0, 0, 0, 0.6)',
                        '&.Mui-checked': {
                          color: '#156ff5',
                        },
                      }}
                    />
                  }
                  label={
                    <Typography variant="body1" sx={{ textTransform: 'capitalize', fontSize: '1rem' }}>
                      {transmission}
                    </Typography>
                  }
                />
              ))}
            </FormGroup>
          </Box>

          {/* Колір */}
          <Box mb={2}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'black', mb: 1 }}>
              Колір
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
                      sx={{
                        '& .MuiSvgIcon-root': {
                          fontSize: 20,
                        },
                        color: 'rgba(0, 0, 0, 0.6)',
                        '&.Mui-checked': {
                          color: '#156ff5',
                        },
                      }}
                    />
                  }
                  label={
                    <Typography variant="body1" sx={{ textTransform: 'capitalize', fontSize: '1rem' }}>
                      {color}
                    </Typography>
                  }
                />
              ))}
            </FormGroup>
          </Box>

          {/* Тип приводу */}
          <Box mb={2}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'black', mb: 1 }}>
              Тип приводу
            </Typography>
            <FormGroup>
              {DRIVE_TYPES.map((driveType) => (
                <FormControlLabel
                  key={driveType}
                  control={
                    <Checkbox
                      checked={filters.drive_type === driveType}
                      onChange={(e) => handleFilterChange('drive_type', e.target.checked ? driveType : undefined)}
                      size="small"
                      sx={{
                        '& .MuiSvgIcon-root': {
                          fontSize: 20,
                        },
                        color: 'rgba(0, 0, 0, 0.6)',
                        '&.Mui-checked': {
                          color: '#156ff5',
                        },
                      }}
                    />
                  }
                  label={
                    <Typography variant="body1" sx={{ textTransform: 'capitalize', fontSize: '1rem' }}>
                      {driveType}
                    </Typography>
                  }
                />
              ))}
            </FormGroup>
          </Box>

          {/* Технічний стан */}
          <Box mb={2}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'black', mb: 1 }}>
              Технічний стан
            </Typography>
            <FormGroup>
              {TECHNICAL_CONDITIONS.map((condition) => (
                <FormControlLabel
                  key={condition}
                  control={
                    <Checkbox
                      checked={filters.technical_condition === condition}
                      onChange={(e) =>
                        handleFilterChange('technical_condition', e.target.checked ? condition : undefined)
                      }
                      size="small"
                      sx={{
                        '& .MuiSvgIcon-root': {
                          fontSize: 20,
                        },
                        color: 'rgba(0, 0, 0, 0.6)',
                        '&.Mui-checked': {
                          color: '#156ff5',
                        },
                      }}
                    />
                  }
                  label={
                    <Typography variant="body1" sx={{ textTransform: 'capitalize', fontSize: '1rem' }}>
                      {condition}
                    </Typography>
                  }
                />
              ))}
            </FormGroup>
          </Box>

          {/* Розмитнення */}
          <Box>
            <FormControlLabel
              control={
                <Checkbox
                  checked={filters.is_custom_cleared || false}
                  onChange={(e) => handleFilterChange('is_custom_cleared', e.target.checked || undefined)}
                  size="small"
                  sx={{
                    '& .MuiSvgIcon-root': {
                      fontSize: 20,
                    },
                    color: 'rgba(0, 0, 0, 0.6)',
                    '&.Mui-checked': {
                      color: '#156ff5',
                    },
                  }}
                />
              }
              label={
                <Typography variant="body1" sx={{ fontSize: '1rem' }}>
                  Розмитнена
                </Typography>
              }
            />
          </Box>
        </Box>

        {/* Кнопки внизу фільтрів */}
        <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Typography
            onClick={onReset}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              cursor: 'pointer',
              color: 'text.secondary',
              fontSize: '0.875rem',
              '&:hover': {
                color: 'primary.main',
                textDecoration: 'underline',
              },
            }}
          >
            <RestartAltIcon fontSize="small" />
            Скинути фільтри
          </Typography>

          <Button
            variant="contained"
            onClick={() => onFiltersChange(filters)}
            size="small"
            sx={{
              borderRadius: 0,
              fontWeight: 'bold',
              fontSize: '0.875rem',
              py: 1,
              bgcolor: '#156ff5',
              '&:hover': {
                bgcolor: '#115cc9',
              },
            }}
          >
            Підібрати ({resultsCount})
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

export default VehicleFiltersComponent;
