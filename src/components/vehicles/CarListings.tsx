import React from 'react';
import { useNavigate } from 'react-router-dom';

export interface Car {
  id: number;
  brand: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  fuelType: string;
  engineSize: string;
  isFeatured?: boolean;
}

interface CarListingsProps {
  cars: Car[];
  title?: string;
}

const CarListings: React.FC<CarListingsProps> = ({ 
  cars, 
  title = "Переглянуте раніше" 
}) => {
  const navigate = useNavigate();
  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('uk-UA').format(price) + ' $';
  };

  const formatMileage = (mileage: number): string => {
    return new Intl.NumberFormat('uk-UA').format(mileage) + ' км';
  };

  return (
    <div className="container mx-auto px-4 max-w-7xl py-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">{title}</h2>

      {cars.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-lg text-gray-600">Оголошень не знайдено</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {cars.map((car) => (
              <div
                key={car.id}
                className="bg-white rounded-lg shadow-md p-5 hover:shadow-lg transition-shadow duration-200"
              >
                {car.isFeatured && (
                  <div className="mb-3">
                    <span className="inline-block bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                      {car.isFeatured ? 'Hosavi' : 'Horavit'}
                    </span>
                  </div>
                )}

                <div className="flex flex-col space-y-3">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      {car.brand} {car.model}
                    </h3>
                    <p className="text-gray-600 text-sm">{car.year} рік</p>
                  </div>

                  <p className="text-2xl font-bold text-gray-900">{formatPrice(car.price)}</p>

                  <div className="space-y-1">
                    <p className="text-gray-600 text-sm">Пробіг: {formatMileage(car.mileage)}</p>
                    <p className="text-gray-600 text-sm">
                      Двигун: {car.fuelType}, {car.engineSize}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

        <div className="flex justify-center mt-6">
          <button
          >
            Дивитись більше
          </button>
        </div>
        </>
      )}
    </div>
  );
};

export default CarListings;
