import React from 'react';

import type { Vehicle } from '../../models/vehicle';
import { useNavigate } from 'react-router-dom';

interface CarListingsGridProps {
  cars: Vehicle[];
  title?: string;
}

const CarListingsGrid: React.FC<CarListingsGridProps> = ({ cars, title = 'Переглянуте раніше' }) => {
  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('uk-UA').format(price) + ' $';
  };
  const navigate = useNavigate();

  const formatMileage = (mileage: number | undefined): string => {
    return mileage ? new Intl.NumberFormat('uk-UA').format(mileage) + ' км' : 'N/A';
  };

  const getFuelTypeLabel = (fuelType: string | undefined): string => {
    const fuelTypeMap: Record<string, string> = {
      petrol: 'Бензин',
      diesel: 'Дизель',
      electric: 'Електрика',
      hybrid: 'Гібрид',
      gas: 'Газ',
      other: 'Інше',
    };
    return fuelType ? fuelTypeMap[fuelType] || fuelType : 'N/A';
  };

  const getFirstImage = (images: any[] | undefined): string | null => {
    return images && images.length > 0 ? images[0].image : null;
  };

  const firstRowCars = cars.slice(0, 4);
  const secondRowCars = cars.slice(4, 9);

  return (
    <div className="container mx-auto px-4 max-w-7xl py-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">{title}</h2>

      {cars.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-lg text-gray-600">Оголошень не знайдено</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {firstRowCars.map((car) => {
              const imageUrl = getFirstImage(car.images);
              return (
                <div 
                  key={car.id} 
                  className="bg-white overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => navigate(`/vehicles/${car.id}`)}
                >
                  {imageUrl && (
                    <img src={imageUrl} alt={`${car.brand} ${car.model}`} className="w-full h-48 object-cover" />
                  )}
                  <div className="p-4 pl-0">
                    <h3 className="text-lg font-bold text-gray-900">
                      {car.brand} {car.model}
                    </h3>
                    <p className="text-green-600 text-xl font-bold mt-2">{formatPrice(car.price)}</p>
                    <p className="text-gray-600 text-sm mt-2">
                      {formatMileage(car.mileage)} | {getFuelTypeLabel(car.fuel_type)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {secondRowCars.length > 0 && (
            <div className="grid grid-cols-4 grid-rows-2 gap-6">
              {secondRowCars[0] && (() => {
                const imageUrl = getFirstImage(secondRowCars[0].images);
                return (
                  <div 
                    className="col-span-2 row-span-2 bg-white overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                    onClick={() => navigate(`/vehicles/${secondRowCars[0].id}`)}
                  >
                    {imageUrl && (
                      <img 
                        src={imageUrl} 
                        alt={`${secondRowCars[0].brand} ${secondRowCars[0].model}`}
                        className="w-full h-80 object-cover"
                      />
                    )}
                    <div className="p-4 pl-0">
                      <h3 className="text-xl font-bold text-gray-900">
                        {secondRowCars[0].brand} {secondRowCars[0].model}
                      </h3>
                      <p className="text-green-600 text-2xl font-bold mt-2">
                        {formatPrice(secondRowCars[0].price)}
                      </p>
                      <p className="text-gray-600 text-sm mt-2">
                        {formatMileage(secondRowCars[0].mileage)} | {getFuelTypeLabel(secondRowCars[0].fuel_type)}
                      </p>
                    </div>
                  </div>
                );
              })()}

              {secondRowCars.slice(1, 5).map((car) => {
                const imageUrl = getFirstImage(car.images);
                return (
                  <div 
                    key={car.id} 
                    className="bg-white overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                    onClick={() => navigate(`/vehicles/${car.id}`)}
                  >
                    {imageUrl && (
                      <img src={imageUrl} alt={`${car.brand} ${car.model}`} className="w-full h-32 object-cover" />
                    )}
                    <div className="p-3 pl-0">
                      <h3 className="text-md font-bold text-gray-900">
                        {car.brand} {car.model}
                      </h3>
                      <p className="text-green-600 text-lg font-bold mt-1">{formatPrice(car.price)}</p>
                      <p className="text-gray-600 text-xs mt-1">
                        {formatMileage(car.mileage)} | {getFuelTypeLabel(car.fuel_type)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

        <div className="flex justify-center mt-6">
          <button
            onClick={() => navigate('/vehicles')}
            className="bg-white border border-blue-600 text-blue-600 hover:bg-blue-50 px-9 py-2 text-sm font-medium transition-colors"
          >
            Дивитись більше
          </button>
        </div>
        </>
      )}
    </div>
  );
};

export default CarListingsGrid;
