import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { NavigateNext as NavigateNextIcon, Search } from '@mui/icons-material';
import { Box, Breadcrumbs, Button, Container, Paper, Stack, TextField, Typography } from '@mui/material';

import { getErrorMessage } from '../../common/utils/errorUtils';
import ActiveFiltersBar from '../../components/vehicles/ActiveFiltersBar';
import VehicleFilters from '../../components/vehicles/VehicleFilters';
import VehicleListRow from '../../components/vehicles/VehicleListRow';
import { useDebounce } from '../../hooks/useDebounce';
import type { VehicleFilters as VehicleFiltersType } from '../../models/vehicle';
import { useGetFavoritesQuery } from '../../redux/api/favoritesApi';
import { useGetVehiclesQuery, useSearchVehiclesQuery } from '../../redux/api/vehiclesApi';
import type { RootState } from '../../redux/store';

const VehiclesPage: React.FC = () => {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page') || '1'));
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
        setFilters(prevFilters => ({
          ...prevFilters,
          is_new: isNewValue,
          page: 1 // Reset to first page when changing filter
        }));
        setCurrentPage(1);
      }
    } else if (filters.is_new !== undefined) {
      // If is_new parameter is removed from URL, remove the filter
      setFilters(prevFilters => {
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

  const navigate = useNavigate();

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
