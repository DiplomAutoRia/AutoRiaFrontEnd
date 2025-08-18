export const POPULAR_BRANDS = [
  'BMW',
  'Mercedes-Benz',
  'Audi',
  'Volkswagen',
  'Toyota',
  'Honda',
  'Ford',
  'Chevrolet',
  'Nissan',
  'Hyundai',
  'Kia',
  'Mazda',
  'Subaru',
  'Volvo',
  'Peugeot',
  'Renault',
  'Skoda',
  'Opel',
  'Mitsubishi',
  'Lexus',
] as const;

export type Brand = (typeof POPULAR_BRANDS)[number];
