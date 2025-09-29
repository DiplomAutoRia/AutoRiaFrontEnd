import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { FilterList, NavigateNext as NavigateNextIcon, Search } from '@mui/icons-material';
import {
  Box,
  Breadcrumbs,
  Button,
  Checkbox,
  Container,
  Divider,
  FormControl,
  FormControlLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';

import { getErrorMessage } from '../../common/utils/errorUtils';
import ActiveFiltersBar from '../../components/vehicles/ActiveFiltersBar';
import VehicleFilters from '../../components/vehicles/VehicleFilters';
import VehicleListRow from '../../components/vehicles/VehicleListRow';
import { useDebounce } from '../../hooks/useDebounce';
import { POPULAR_BRANDS } from '../../models/brands';
import { CAR_BODY_TYPES, FUEL_TYPES } from '../../models/vehicle';
import type { VehicleFilters as VehicleFiltersType } from '../../models/vehicle';
import { useGetFavoritesQuery } from '../../redux/api/favoritesApi';
import { useGetVehiclesQuery, useSearchVehiclesQuery } from '../../redux/api/vehiclesApi';
import type { RootState } from '../../redux/store';

const UKRAINIAN_REGIONS = [
  'Київ',
  'Харків',
  'Одеса',
  'Дніпро',
  'Донецьк',
  'Запоріжжя',
  'Львів',
  'Кривий Ріг',
  'Миколаїв',
  'Маріуполь',
  'Луганськ',
  'Вінниця',
  'Макіївка',
  'Севастополь',
  'Сімферополь',
  'Херсон',
  'Полтава',
  'Чернігів',
  'Черкаси',
  'Горлівка',
  'Житомир',
  'Суми',
  'Хмельницький',
  'Чернівці',
  'Івано-Франківськ',
  'Тернопіль',
  'Кременчук',
  'Біла Церква',
  'Краматорськ',
  'Мелітополь',
  'Рівне',
  'Ужгород',
  'Луцьк',
  'Бердянськ',
  'Алчевськ',
  'Павлоград',
  'Сєвєродонецьк',
  "Слов'янськ",
  "Кам'янець-Подільський",
  'Лисичанськ',
  'Олександрія',
  'Бровари',
  'Дрогобич',
  'Конотоп',
  'Батумі',
] as const;

const VehiclesPage: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page') || '1'));
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [mobileActiveTab, setMobileActiveTab] = useState(0);
  const [filters, setFilters] = useState<VehicleFiltersType>(() => {
    const initialFilters: VehicleFiltersType = {
      page: currentPage,
      limit: 10,
    };

    const brand = searchParams.get('brand');
    const priceFrom = searchParams.get('price_from');
    const priceTo = searchParams.get('price_to');
    const isNew = searchParams.get('is_new');

    if (brand) initialFilters.brand = brand;
    if (priceFrom) initialFilters.price_min = parseInt(priceFrom);
    if (priceTo) initialFilters.price_max = parseInt(priceTo);
    if (isNew !== null) {
      initialFilters.is_new = isNew === 'true';
    }

    return initialFilters;
  });

  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  const shouldUseSearch = debouncedSearchQuery.trim().length > 0;

  const searchResult = useSearchVehiclesQuery(
    { q: debouncedSearchQuery, page: currentPage, limit: 10 },
    { skip: !shouldUseSearch },
  );

  const listResult = useGetVehiclesQuery({ ...filters, page: currentPage, limit: 10 }, { skip: shouldUseSearch });

  const { data, isLoading, error } = shouldUseSearch ? searchResult : listResult;

  const user = useSelector((state: RootState) => state.auth.user);
  const { data: favorites = [] } = useGetFavoritesQuery(undefined, { skip: !user });

  const favoriteIds = favorites.reduce(
    (acc, fav) => {
      if (fav.vehicle_details?.id) {
        acc[fav.vehicle_details.id] = fav.id;
      }
      return acc;
    },
    {} as Record<number, number>,
  );

  useEffect(() => {
    const params = new URLSearchParams();
    if (searchQuery) {
      params.set('search', searchQuery);
    }
    if (filters.brand) {
      params.set('brand', filters.brand);
    }
    if (filters.price_min) {
      params.set('price_from', filters.price_min.toString());
    }
    if (filters.price_max) {
      params.set('price_to', filters.price_max.toString());
    }
    if (filters.is_new !== undefined) {
      params.set('is_new', filters.is_new.toString());
    }
    if (currentPage > 1) {
      params.set('page', currentPage.toString());
    }
    setSearchParams(params);
  }, [searchQuery, currentPage, filters.brand, filters.price_min, filters.price_max, filters.is_new, setSearchParams]);

  // Effect to handle URL parameter changes when navigating between new/used vehicles
  useEffect(() => {
    const isNewParam = searchParams.get('is_new');

    if (isNewParam !== null) {
      const isNewValue = isNewParam === 'true';
      if (filters.is_new !== isNewValue) {
        setFilters((prevFilters) => ({
          ...prevFilters,
          is_new: isNewValue,
          page: 1, // Reset to first page when changing filter
        }));
        setCurrentPage(1);
      }
    } else if (filters.is_new !== undefined) {
      // If is_new parameter is removed from URL, remove the filter
      setFilters((prevFilters) => {
        const newFilters = { ...prevFilters };
        delete newFilters.is_new;
        return { ...newFilters, page: 1 };
      });
      setCurrentPage(1);
    }
  }, [searchParams.get('is_new')]);

  const handleSearch = () => {
    setCurrentPage(1);
  };

  const handleFiltersChange = (newFilters: VehicleFiltersType) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handleFiltersReset = () => {
    setFilters({ page: 1, limit: 10 });
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleFilterRemove = (key: keyof VehicleFiltersType, value?: string) => {
    setFilters((prevFilters) => {
      const newFilters = { ...prevFilters };

      if (
        key === 'brand' ||
        key === 'location' ||
        key === 'vehicle_type' ||
        key === 'drive_type' ||
        key === 'technical_condition'
      ) {
        delete newFilters[key];
      } else if (key === 'price_min' || key === 'price_max' || key === 'year_min' || key === 'year_max') {
        delete newFilters[key];
      } else if (key === 'body_type' || key === 'fuel_type' || key === 'transmission' || key === 'color') {
        if (newFilters[key] && Array.isArray(newFilters[key])) {
          // Use type assertion to handle the specific array types
          const currentArray = newFilters[key] as unknown as string[];
          const filteredArray = currentArray.filter((item) => item !== value);

          if (filteredArray.length === 0) {
            delete newFilters[key];
          } else {
            newFilters[key] = filteredArray as any;
          }
        }
      } else if (key === 'is_custom_cleared' || key === 'is_new') {
        delete newFilters[key];
      }

      return { ...newFilters, page: 1 };
    });
    setCurrentPage(1);
  };

  const handleMobileTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setMobileActiveTab(newValue);
    let newFilters = { ...filters };

    if (newValue === 0) {
      newFilters.is_new = false;
    } else if (newValue === 1) {
      newFilters.is_new = true;
    } else {
      delete newFilters.is_new;
    }

    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handleMobileInputChange = (field: keyof VehicleFiltersType, value: any) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleMobileArrayChange = (field: keyof VehicleFiltersType, value: string, checked: boolean) => {
    setFilters((prev) => {
      const currentArray = (prev[field] as string[]) || [];
      if (checked) {
        return { ...prev, [field]: [...currentArray, value] };
      } else {
        return { ...prev, [field]: currentArray.filter((item) => item !== value) };
      }
    });
  };

  if (isMobile) {
    return (
      <Container maxWidth="sm" sx={{ py: 2 }}>
        {/* Mobile Filter Interface */}
        <Paper elevation={1} sx={{ borderRadius: 2, overflow: 'hidden', mb: 2 }}>
          {/* Tabs */}
          <Tabs
            value={mobileActiveTab}
            onChange={handleMobileTabChange}
            variant="fullWidth"
            sx={{
              borderBottom: '1px solid #e0e0e0',
              '& .MuiTab-root': {
                fontSize: '14px',
                textTransform: 'none',
                minHeight: '48px',
              },
            }}
          >
            <Tab label="Вживані авто" />
            <Tab label="Нові авто" />
            <Tab label="Всі" />
          </Tabs>

          {/* Search Bar */}
          <Box sx={{ p: 2, borderBottom: '1px solid #e0e0e0' }}>
            <Stack direction="row" spacing={2} alignItems="center">
              <TextField
                fullWidth
                placeholder={t('vehicles.searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                size="small"
                InputProps={{
                  startAdornment: <Search sx={{ color: 'text.secondary', mr: 1 }} />,
                }}
              />
              <Button variant="contained" onClick={handleSearch} size="small" sx={{ minWidth: 80 }}>
                Пошук
              </Button>
            </Stack>
          </Box>

          {/* Toggle Filters Button */}
          <Box sx={{ p: 2 }}>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              startIcon={<FilterList />}
              sx={{
                color: '#3b82f6',
                borderColor: '#3b82f6',
                textTransform: 'none',
              }}
            >
              {showMobileFilters ? 'Сховати фільтри' : 'Показати фільтри'}
            </Button>
          </Box>

          {/* Mobile Filters */}
          {showMobileFilters && (
            <Box sx={{ p: 2, maxHeight: '70vh', overflow: 'auto' }}>
              {/* Brand */}
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>
                  Марка
                </Typography>
                <FormControl fullWidth size="small">
                  <Select
                    value={filters.brand || ''}
                    onChange={(e) => handleMobileInputChange('brand', e.target.value)}
                    displayEmpty
                  >
                    <MenuItem value="">Всі марки</MenuItem>
                    {POPULAR_BRANDS.filter((brand) => brand !== 'More').map((brand) => (
                      <MenuItem key={brand} value={brand.toLowerCase()}>
                        {brand}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>

              {/* Year Range */}
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>
                  Рік випуску
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <TextField
                    placeholder="Від"
                    value={filters.year_min || ''}
                    onChange={(e) =>
                      handleMobileInputChange('year_min', e.target.value ? parseInt(e.target.value) : undefined)
                    }
                    type="number"
                    size="small"
                    sx={{ flex: 1 }}
                  />
                  <TextField
                    placeholder="До"
                    value={filters.year_max || ''}
                    onChange={(e) =>
                      handleMobileInputChange('year_max', e.target.value ? parseInt(e.target.value) : undefined)
                    }
                    type="number"
                    size="small"
                    sx={{ flex: 1 }}
                  />
                </Box>
              </Box>

              {/* Price Range */}
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>
                  Ціна
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                  <TextField
                    placeholder="Від"
                    value={filters.price_min || ''}
                    onChange={(e) =>
                      handleMobileInputChange('price_min', e.target.value ? parseInt(e.target.value) : undefined)
                    }
                    type="number"
                    size="small"
                    sx={{ flex: 1 }}
                  />
                  <TextField
                    placeholder="До"
                    value={filters.price_max || ''}
                    onChange={(e) =>
                      handleMobileInputChange('price_max', e.target.value ? parseInt(e.target.value) : undefined)
                    }
                    type="number"
                    size="small"
                    sx={{ flex: 1 }}
                  />
                </Box>
              </Box>

              {/* Location */}
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>
                  Регіон
                </Typography>
                <FormControl fullWidth size="small">
                  <Select
                    value={filters.location || ''}
                    onChange={(e) => handleMobileInputChange('location', e.target.value)}
                    displayEmpty
                  >
                    <MenuItem value="">Всі регіони</MenuItem>
                    {UKRAINIAN_REGIONS.map((region) => (
                      <MenuItem key={region} value={region.toLowerCase()}>
                        {region}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>

              {/* Body Type */}
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>
                  Тип кузова
                </Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0.5 }}>
                  {CAR_BODY_TYPES.slice(0, 6).map((type) => (
                    <FormControlLabel
                      key={type}
                      control={
                        <Checkbox
                          size="small"
                          checked={(filters.body_type as string[])?.includes(type) || false}
                          onChange={(e) => handleMobileArrayChange('body_type', type, e.target.checked)}
                        />
                      }
                      label={
                        <Typography variant="body2" fontSize="12px">
                          {type === 'sedan'
                            ? 'Седан'
                            : type === 'hatchback'
                              ? 'Хетчбек'
                              : type === 'suv'
                                ? 'SUV'
                                : type === 'wagon'
                                  ? 'Універсал'
                                  : type === 'coupe'
                                    ? 'Купе'
                                    : type === 'convertible'
                                      ? 'Кабріолет'
                                      : type}
                        </Typography>
                      }
                      sx={{ margin: 0, '& .MuiFormControlLabel-label': { fontSize: '12px' } }}
                    />
                  ))}
                </Box>
              </Box>

              {/* Fuel Type */}
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>
                  Паливо
                </Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0.5 }}>
                  {FUEL_TYPES.map((fuel) => (
                    <FormControlLabel
                      key={fuel}
                      control={
                        <Checkbox
                          size="small"
                          checked={(filters.fuel_type as string[])?.includes(fuel) || false}
                          onChange={(e) => handleMobileArrayChange('fuel_type', fuel, e.target.checked)}
                        />
                      }
                      label={
                        <Typography variant="body2" fontSize="12px">
                          {fuel === 'petrol'
                            ? 'Бензин'
                            : fuel === 'diesel'
                              ? 'Дизель'
                              : fuel === 'electric'
                                ? 'Електро'
                                : fuel === 'hybrid'
                                  ? 'Гібрид'
                                  : fuel === 'gas'
                                    ? 'Газ'
                                    : 'Інше'}
                        </Typography>
                      }
                      sx={{ margin: 0, '& .MuiFormControlLabel-label': { fontSize: '12px' } }}
                    />
                  ))}
                </Box>
              </Box>

              <Divider sx={{ my: 2 }} />

              {/* Action Buttons */}
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button variant="outlined" onClick={handleFiltersReset} sx={{ flex: 1, textTransform: 'none' }}>
                  Скинути
                </Button>
                <Button
                  variant="contained"
                  onClick={() => setShowMobileFilters(false)}
                  sx={{ flex: 1, backgroundColor: '#3b82f6', textTransform: 'none' }}
                >
                  Застосувати
                </Button>
              </Box>
            </Box>
          )}
        </Paper>

        {/* Active Filters */}
        {!shouldUseSearch && <ActiveFiltersBar filters={filters} onFilterRemove={handleFilterRemove} />}

        {/* Search Results Header */}
        {shouldUseSearch && (
          <Typography variant="h6" gutterBottom sx={{ mb: 2, px: 1 }}>
            Результати пошуку для "{debouncedSearchQuery}"
          </Typography>
        )}

        {/* Results Count */}
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2, px: 1 }}>
          {data?.count || 0} пропозицій
        </Typography>

        {/* Vehicle List */}
        <VehicleListRow
          vehicles={data?.results || []}
          isLoading={isLoading}
          error={error ? { message: getErrorMessage(error) } : null}
          totalCount={data?.count || 0}
          currentPage={currentPage}
          pageSize={data?.page_size || 10}
          onPageChange={handlePageChange}
          favoriteIds={user ? favoriteIds : {}}
        />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Breadcrumb navigation */}
      <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb" sx={{ mb: 2 }}>
        <Button
          onClick={() => navigate('/')}
          sx={{
            textDecoration: 'none',
            color: 'inherit',
            p: 0,
            minWidth: 'auto',
            '&:hover': { textDecoration: 'underline' },
            cursor: 'pointer',
            textTransform: 'none',
            fontWeight: 'normal',
            fontSize: 'inherit',
          }}
        >
          Turbosell
        </Button>
        <Typography color="text.primary">Вживані авто</Typography>
      </Breadcrumbs>

      {/* Main header with count */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', mb: 1, color: 'text.primary' }}>
          Пошук вживаних авто в Україні
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {data?.count || 0} пропозицій
        </Typography>
      </Box>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <TextField
            fullWidth
            placeholder={t('vehicles.searchPlaceholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            InputProps={{
              startAdornment: <Search sx={{ color: 'text.secondary', mr: 1 }} />,
            }}
          />
          <Button variant="contained" onClick={handleSearch} startIcon={<Search />} sx={{ minWidth: 120 }}>
            {t('common.search')}
          </Button>
        </Stack>
      </Paper>

      <Box sx={{ display: 'flex', gap: 3, mt: 3 }}>
        {/* Ліва колонка - Фільтри */}
        {!shouldUseSearch && (
          <Box sx={{ width: 300, flexShrink: 0 }}>
            <VehicleFilters filters={filters} onFiltersChange={handleFiltersChange} onReset={handleFiltersReset} />
          </Box>
        )}

        {/* Права колонка - Оголошення */}
        <Box sx={{ flexGrow: 1, minWidth: 0 }}>
          {/* Активні фільтри */}
          {!shouldUseSearch && <ActiveFiltersBar filters={filters} onFilterRemove={handleFilterRemove} />}

          {shouldUseSearch && (
            <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
              Результати пошуку для "{debouncedSearchQuery}"
            </Typography>
          )}

          <VehicleListRow
            vehicles={data?.results || []}
            isLoading={isLoading}
            error={error ? { message: getErrorMessage(error) } : null}
            totalCount={data?.count || 0}
            currentPage={currentPage}
            pageSize={data?.page_size || 10}
            onPageChange={handlePageChange}
            favoriteIds={user ? favoriteIds : {}}
          />
        </Box>
      </Box>
    </Container>
  );
};

export default VehiclesPage;
