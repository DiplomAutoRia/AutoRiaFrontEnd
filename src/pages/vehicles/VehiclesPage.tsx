import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';

import { Search } from '@mui/icons-material';
import { Box, Button, Container, Paper, Stack, TextField, Typography } from '@mui/material';

import { getErrorMessage } from '../../common/utils/errorUtils';
import VehicleFilters from '../../components/vehicles/VehicleFilters';
import VehicleList from '../../components/vehicles/VehicleList';
import { useDebounce } from '../../hooks/useDebounce';
import type { VehicleFilters as VehicleFiltersType } from '../../models/vehicle';
import { useGetFavoritesQuery } from '../../redux/api/favoritesApi';
import { useGetVehiclesQuery, useSearchVehiclesQuery } from '../../redux/api/vehiclesApi';
import type { RootState } from '../../redux/store';

const VehiclesPage: React.FC = () => {
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

    if (brand) initialFilters.brand = brand;
    if (priceFrom) initialFilters.price_min = parseInt(priceFrom);
    if (priceTo) initialFilters.price_max = parseInt(priceTo);

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
      acc[fav.vehicle] = fav.id;
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
    if (currentPage > 1) {
      params.set('page', currentPage.toString());
    }
    setSearchParams(params);
  }, [searchQuery, currentPage, filters.brand, filters.price_min, filters.price_max, setSearchParams]);

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

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Пошук транспорту
      </Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <TextField
            fullWidth
            placeholder="Пошук за маркою, моделлю, описом..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            InputProps={{
              startAdornment: <Search sx={{ color: 'text.secondary', mr: 1 }} />,
            }}
          />
          <Button variant="contained" onClick={handleSearch} startIcon={<Search />} sx={{ minWidth: 120 }}>
            Пошук
          </Button>
        </Stack>
      </Paper>

      {!shouldUseSearch && (
        <VehicleFilters filters={filters} onFiltersChange={handleFiltersChange} onReset={handleFiltersReset} />
      )}

      <Box>
        {shouldUseSearch && (
          <Typography variant="h6" gutterBottom>
            Результати пошуку для "{debouncedSearchQuery}"
          </Typography>
        )}

        <VehicleList
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
    </Container>
  );
};

export default VehiclesPage;
