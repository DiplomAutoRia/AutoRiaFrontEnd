import { z } from 'zod';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^\+?\d{10,15}$/;

export const passwordSchema = z
  .string()
  .min(6, 'Пароль має бути не менше 6 символів')
  .refine((val) => /[a-zA-Z]/.test(val), {
    message: 'Пароль має містити принаймні одну літеру',
  })
  .refine((val) => /\d/.test(val), {
    message: 'Пароль має містити принаймні одну цифру',
  });

export const userSchema = z
  .object({
    username: z.string().min(1, 'Введіть імʼя'),
    email: z.string().email('Введіть коректну пошту'),
    password: passwordSchema,
    confirmPassword: z.string().min(6, 'Пароль має бути не менше 6 символів'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Паролі не співпадають',
    path: ['confirmPassword'],
  });

export const loginSchema = z.object({
  contact: z
    .string()
    .min(1, 'Введіть пошту або номер телефону')
    .refine(
      (val) => {
        if (emailRegex.test(val)) return true;
        if (phoneRegex.test(val)) return true;
        return false;
      },
      { message: 'Введіть коректну пошту (наприклад user@gmail.com) або номер телефону (наприклад +380123456789)' },
    ),
  password: passwordSchema,
});

export const registerSchema = z.object({
  firstName: z.string().min(1, 'Введіть імʼя'),
  lastName: z.string().min(1, 'Введіть прізвище'),
  contact: z
    .string()
    .min(1, 'Введіть пошту або номер телефону')
    .refine(
      (val) => {
        if (emailRegex.test(val)) return true;
        if (phoneRegex.test(val)) return true;
        return false;
      },
      { message: 'Введіть коректну пошту (наприклад user@gmail.com) або номер телефону (наприклад +380123456789)' },
    ),
  acceptTerms: z.literal(true, { errorMap: () => ({ message: 'Потрібно прийняти умови' }) }),
});

export const confirmSchema = z
  .object({
    code: z.string().min(6, 'Код має бути 6 символів'),
    password: passwordSchema,
    repeatPassword: z.string().min(6, 'Пароль має бути не менше 6 символів'),
  })
  .refine((data) => data.password === data.repeatPassword, {
    message: 'Паролі не співпадають',
    path: ['repeatPassword'],
  });

export const carListingSchema = z.object({
  // Required fields
  brand: z.string().min(1, 'Оберіть марку'),
  model: z.string().min(1, 'Введіть модель'),
  price: z.coerce
    .number()
    .positive('Ціна має бути більше нуля')
    .refine((val) => {
      const stringValue = val.toString();
      const parts = stringValue.split('.');
      const integerPart = parts[0];
      return integerPart.length <= 8;
    }, 'Ціна не може мати більше 8 цифр перед десятковим роздільником'),
  currency: z.enum(['USD', 'EUR', 'UAH'], {
    message: 'Оберіть валюту зі списку'
  }),
  year: z.coerce
    .number()
    .min(1900, 'Рік випуску має бути не менше 1900')
    .max(new Date().getFullYear() + 1, 'Рік випуску не може бути в майбутньому'),
  location: z.string().min(1, 'Введіть місцезнаходження'),
  description: z.string().min(1, 'Введіть опис'),
  
  // Optional fields with validation
  mileage: z.coerce
    .number()
    .nonnegative('Пробіг не може бути відʼємним')
    .max(1000000, 'Пробіг не може перевищувати 1 000 000 км')
    .optional(),
  fuel_type: z.enum(['petrol', 'diesel', 'electric', 'hybrid', 'gas', 'other'], {
    message: 'Оберіть тип палива зі списку'
  }).optional(),
  transmission: z.enum(['manual', 'automatic', 'cvt', 'robotic', 'other'], {
    message: 'Оберіть коробку передач зі списку'
  }).optional(),
  body_type: z.enum(['sedan', 'hatchback', 'suv', 'wagon', 'coupe', 'convertible', 'pickup', 'van', 'minivan'], {
    message: 'Оберіть тип кузова зі списку'
  }).optional(),
  drive_type: z.enum(['front', 'rear', 'all', 'full'], {
    message: 'Оберіть тип приводу зі списку'
  }).optional(),
  is_new: z.boolean().default(true),
  plate_number: z.string()
    .max(20, 'Номер авто не може перевищувати 20 символів')
    .regex(/^[A-Z0-9\s-]*$/, 'Номер авто може містити тільки літери, цифри, пробіли та дефіси')
    .optional(),
  color: z.enum(['black', 'white', 'gray', 'red', 'blue', 'green', 'other'], {
    message: 'Оберіть колір зі списку'
  }).optional(),
  engine_volume: z.coerce
    .number()
    .positive('Обʼєм двигуна має бути більше нуля')
    .max(10, 'Обʼєм двигуна не може перевищувати 10 літрів')
    .optional(),
  engine_power: z.coerce
    .number()
    .nonnegative('Потужність двигуна не може бути відʼємною')
    .max(2000, 'Потужність двигуна не може перевищувати 2000 к.с.')
    .optional(),
  vin_code: z.string()
    .max(17, 'VIN-код має містити 17 символів')
    .regex(/^[A-HJ-NPR-Z0-9]{17}$/, 'Невірний формат VIN-коду')
    .optional(),
  registration_country: z.string()
    .max(50, 'Країна реєстрації не може перевищувати 50 символів')
    .optional(),
  is_custom_cleared: z.boolean().optional(),
  number_of_owners: z.coerce
    .number()
    .int('Кількість власників має бути цілим числом')
    .min(1, 'Кількість власників має бути не менше 1')
    .max(20, 'Кількість власників не може перевищувати 20')
    .optional(),
  technical_condition: z.enum(['excellent', 'good', 'satisfactory', 'needs_repair', 'not_running'], {
    message: 'Оберіть технічний стан зі списку'
  }).optional(),
  seats: z.coerce
    .number()
    .int('Кількість місць має бути цілим числом')
    .min(1, 'Кількість місць має бути не менше 1')
    .max(100, 'Кількість місць не може перевищувати 100')
    .optional(),
  doors_count: z.coerce
    .number()
    .int('Кількість дверей має бути цілим числом')
    .min(1, 'Кількість дверей має бути не менше 1')
    .max(10, 'Кількість дверей не може перевищувати 10')
    .optional(),
  
  // Image field
  image: z.any(),
});
