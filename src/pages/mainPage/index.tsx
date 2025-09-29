import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  FormControl,
  MenuItem,
  Select,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';

import News from '../../components/ui/News';
import Filter from '../../components/ui/filter';
import CarListingsGrid from '../../components/vehicles/CarListingsGrid';
import { POPULAR_BRANDS } from '../../models/brands';
import type { VehicleFilters } from '../../models/vehicle';
import { useGetVehiclesQuery } from '../../redux/api/vehiclesApi';

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

const MainPage = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [filters, setFilters] = useState<VehicleFilters>({ limit: 9 });
  const [mobileFilters, setMobileFilters] = useState({
    brand: '',
    model: '',
    region: '',
    year_min: '',
    year_max: '',
    price_min: '',
    price_max: '',
  });
  const [currentLimit, setCurrentLimit] = useState(5);
  const { data: vehiclesData } = useGetVehiclesQuery({ ...filters, limit: currentLimit });

  const handleSearch = (searchFilters: Partial<VehicleFilters>) => {
    setFilters({ ...searchFilters, limit: 9 });
  };

  const handleMobileSearch = () => {
    const searchFilters: Partial<VehicleFilters> = {};
    if (mobileFilters.brand) searchFilters.brand = mobileFilters.brand;
    if (mobileFilters.year_min) searchFilters.year_min = parseInt(mobileFilters.year_min);
    if (mobileFilters.year_max) searchFilters.year_max = parseInt(mobileFilters.year_max);
    if (mobileFilters.price_min) searchFilters.price_min = parseInt(mobileFilters.price_min);
    if (mobileFilters.price_max) searchFilters.price_max = parseInt(mobileFilters.price_max);
    if (mobileFilters.region) searchFilters.location = mobileFilters.region;

    navigate(`/vehicles?${new URLSearchParams(searchFilters as any).toString()}`);
  };

  const handleShowMore = () => {
    setCurrentLimit((prev) => prev + 5);
  };

  const handleVehicleClick = (vehicleId: number) => {
    navigate(`/vehicles/${vehicleId}`);
  };

  const handleBrandClick = (brandName: string) => {
    navigate(`/vehicles?brand=${brandName}`);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isMobile) {
    return (
      <Box sx={{ minHeight: '100vh', backgroundColor: 'white' }}>
        {/* White Content Area */}
        <Box sx={{ p: 2 }}>
          {/* Tabs */}
          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <Button
              variant="contained"
              sx={{
                backgroundColor: '#3b82f6',
                color: 'white',
                textTransform: 'none',
                fontSize: '14px',
                px: 2,
                py: 1,
              }}
            >
              Нові авто
            </Button>
            <Button
              variant="text"
              sx={{
                color: '#666',
                textTransform: 'none',
                fontSize: '14px',
                px: 2,
                py: 1,
              }}
            >
              Вживані
            </Button>
            <Button
              variant="text"
              sx={{
                color: '#666',
                textTransform: 'none',
                fontSize: '14px',
                px: 2,
                py: 1,
              }}
            >
              Всі
            </Button>
          </Box>

          {/* Search Form */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
            {/* Brand, Model, Region */}
            <FormControl fullWidth>
              <Select
                displayEmpty
                size="small"
                value={mobileFilters.brand}
                onChange={(e) => setMobileFilters((prev) => ({ ...prev, brand: e.target.value }))}
              >
                <MenuItem value="">Марка</MenuItem>
                {POPULAR_BRANDS.filter((brand) => brand !== 'More').map((brand) => (
                  <MenuItem key={brand} value={brand.toLowerCase()}>
                    {brand}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <Select
                displayEmpty
                size="small"
                value={mobileFilters.model}
                onChange={(e) => setMobileFilters((prev) => ({ ...prev, model: e.target.value }))}
              >
                <MenuItem value="">Модель</MenuItem>
                <MenuItem value="x5">X5</MenuItem>
                <MenuItem value="3series">3 Series</MenuItem>
                <MenuItem value="a4">A4</MenuItem>
                <MenuItem value="golf">Golf</MenuItem>
                <MenuItem value="passat">Passat</MenuItem>
                <MenuItem value="camry">Camry</MenuItem>
                <MenuItem value="corolla">Corolla</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <Select
                displayEmpty
                size="small"
                value={mobileFilters.region}
                onChange={(e) => setMobileFilters((prev) => ({ ...prev, region: e.target.value }))}
              >
                <MenuItem value="">Регіон</MenuItem>
                {UKRAINIAN_REGIONS.map((region) => (
                  <MenuItem key={region} value={region.toLowerCase()}>
                    {region}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Year */}
            <Typography variant="body2" sx={{ mb: 1, fontWeight: 'bold' }}>
              Рік
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                placeholder="Від"
                type="number"
                size="small"
                sx={{ flex: 1 }}
                value={mobileFilters.year_min}
                onChange={(e) => setMobileFilters((prev) => ({ ...prev, year_min: e.target.value }))}
              />
              <TextField
                placeholder="До"
                type="number"
                size="small"
                sx={{ flex: 1 }}
                value={mobileFilters.year_max}
                onChange={(e) => setMobileFilters((prev) => ({ ...prev, year_max: e.target.value }))}
              />
            </Box>

            {/* Price */}
            <Typography variant="body2" sx={{ mb: 1, fontWeight: 'bold' }}>
              Ціна
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                placeholder="Від"
                type="number"
                size="small"
                sx={{ flex: 1 }}
                value={mobileFilters.price_min}
                onChange={(e) => setMobileFilters((prev) => ({ ...prev, price_min: e.target.value }))}
              />
              <TextField
                placeholder="До"
                type="number"
                size="small"
                sx={{ flex: 1 }}
                value={mobileFilters.price_max}
                onChange={(e) => setMobileFilters((prev) => ({ ...prev, price_max: e.target.value }))}
              />
            </Box>

            {/* Search Buttons */}
            <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
              <Button
                variant="outlined"
                onClick={() => navigate('/vehicles')}
                sx={{
                  flex: 1,
                  backgroundColor: 'white',
                  border: '1px solid #3b82f6',
                  color: '#3b82f6',
                  py: 1.5,
                  fontSize: '14px',
                  textTransform: 'none',
                }}
              >
                Розширений пошук
              </Button>
              <Button
                variant="contained"
                onClick={handleMobileSearch}
                startIcon={
                  <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                    <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" fill="none" />
                    <path d="M20 20l-6-6" stroke="currentColor" strokeWidth="2" />
                  </svg>
                }
                sx={{
                  flex: 1,
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  py: 1.5,
                  fontSize: '14px',
                  textTransform: 'none',
                }}
              >
                Пошук
              </Button>
            </Box>
          </Box>

          {/* Turbosell рекомендує */}
          <Typography variant="h6" sx={{ mb: 2, fontSize: '18px', fontWeight: 'bold' }}>
            Turbosell рекомендує
          </Typography>

          {/* Cars Grid */}
          {vehiclesData?.results &&
            vehiclesData.results.map((vehicle, index) => (
              <Card
                key={vehicle.id || index}
                sx={{
                  mb: 2,
                  borderRadius: 2,
                  cursor: 'pointer',
                  '&:hover': {
                    boxShadow: 3,
                    transform: 'translateY(-2px)',
                    transition: 'all 0.2s ease-in-out',
                  },
                }}
                onClick={() => handleVehicleClick(vehicle.id)}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={
                    vehicle.images && vehicle.images.length > 0 ? vehicle.images[0].image : '/assets/images/car.png'
                  }
                  alt={`${vehicle.brand} ${vehicle.model}`}
                  sx={{ objectFit: 'cover' }}
                />
                <CardContent sx={{ p: 2 }}>
                  <Typography variant="h6" sx={{ fontSize: '16px', fontWeight: 'bold', mb: 1 }}>
                    {vehicle.brand} {vehicle.model} {vehicle.year}
                  </Typography>
                  <Typography variant="h6" sx={{ color: '#22c55e', fontSize: '18px', fontWeight: 'bold', mb: 1 }}>
                    {vehicle.price} {vehicle.currency}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '12px' }}>
                    {vehicle.location} • {vehicle.mileage} км
                  </Typography>
                </CardContent>
              </Card>
            ))}

          {/* Show More Button */}
          {vehiclesData?.results && vehiclesData.results.length >= currentLimit && (
            <Button
              variant="outlined"
              fullWidth
              onClick={handleShowMore}
              sx={{
                color: '#3b82f6',
                borderColor: '#3b82f6',
                textTransform: 'none',
                py: 1.5,
                mb: 3,
              }}
            >
              Показати більше
            </Button>
          )}

          {/* Car News */}
          <Typography variant="h6" sx={{ mb: 2, fontSize: '18px', fontWeight: 'bold' }}>
            Автомобільні новини
          </Typography>
          <News limit={3} />

          {/* Read More Button */}
          <Button
            variant="outlined"
            fullWidth
            sx={{
              color: '#3b82f6',
              borderColor: '#3b82f6',
              textTransform: 'none',
              py: 1.5,
              mt: 2,
              mb: 4,
            }}
          >
            Читати більше
          </Button>
        </Box>
      </Box>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-white py-8">
        <div className="container mx-auto px-4 max-w-7xl">
          <h1 className="text-4xl font-bold text-center text-gray-900 mb-2">
            TurboSell - купівля та продаж авто в Україні
          </h1>
          <p className="text-xl text-center text-gray-600 mb-8">Купуйте й продавайте авто онлайн</p>

          {/* New Filter Component */}
          <Filter onSearch={handleSearch} />
        </div>
      </div>

      {vehiclesData?.results && vehiclesData.results.length > 0 && (
        <CarListingsGrid cars={vehiclesData.results} title="Останні оголошення" />
      )}

      <div className="container mx-auto px-4 max-w-7xl py-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Популярні марки</h2>
        <div className="grid grid-cols-6 gap-4">
          {POPULAR_BRANDS.map((brandName) => (
            <button
              key={brandName}
              onClick={() => handleBrandClick(brandName)}
              className="flex flex-col items-center p-3 border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            >
              <div className="w-[70px] h-[70px] bg-white flex items-center justify-center mb-2">
                <img
                  src={`/brands/${brandName.toLowerCase().replace(/\s+/g, '-')}.png`}
                  alt={brandName}
                  className="w-[44px] h-[44px] object-contain"
                  onError={(e) => {
                    e.currentTarget.src = '/assets/images/car.png';
                  }}
                />
              </div>
              <span className="text-sm font-medium text-gray-900">{brandName}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Car News Section */}
      <div className="container mx-auto px-4 max-w-7xl py-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Автомобільні новини</h2>
        <News limit={5} />
      </div>

      {/* Back to Top Button */}
      <div className="container mx-auto px-4 max-w-7xl py-6 flex justify-center">
        <button
          onClick={scrollToTop}
          className="bg-white border border-blue-600 text-blue-600 hover:bg-blue-50 px-9 py-2 text-sm font-medium transition-colors"
        >
          На початок сторінки
        </button>
      </div>
    </div>
  );
};

export default MainPage;
