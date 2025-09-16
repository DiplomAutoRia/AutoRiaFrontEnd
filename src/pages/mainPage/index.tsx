import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';

import CarListingsGrid from '../../components/vehicles/CarListingsGrid';
import Filter from '../../components/ui/filter';
import News from '../../components/ui/News';
import { POPULAR_BRANDS } from '../../models/brands';
import { useGetVehiclesQuery } from '../../redux/api/vehiclesApi';
import type { RootState } from '../../redux/store';
import type { VehicleFilters } from '../../models/vehicle';

const MainPage = () => {
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth.user);
  const [filters, setFilters] = useState<VehicleFilters>({ limit: 9 });
  const { data: vehiclesData } = useGetVehiclesQuery(filters);


  const handleSearch = (searchFilters: Partial<VehicleFilters>) => {
    setFilters({ ...searchFilters, limit: 9 });
  };

  const handleBrandClick = (brandName: string) => {
    navigate(`/vehicles?brand=${brandName}`);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-white py-8">
        <div className="container mx-auto px-4 max-w-7xl">
          <h1 className="text-4xl font-bold text-center text-gray-900 mb-2">
            Turbosell
          </h1>
          <p className="text-xl text-center text-gray-600 mb-8">
            Купуйте й продавайте авто онлайн
          </p>

          {/* New Filter Component */}
          <Filter onSearch={handleSearch} />
        </div>
      </div>

      {vehiclesData?.results && vehiclesData.results.length > 0 && (
        <CarListingsGrid 
          cars={vehiclesData.results}
          title="Останні оголошення"
        />
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
                    e.currentTarget.src = '/locales/images/car.png';
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
