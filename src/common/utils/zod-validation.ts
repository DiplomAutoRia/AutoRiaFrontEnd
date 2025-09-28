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
  acceptTerms: z.boolean().refine((val) => val === true, { message: 'Потрібно прийняти умови' }),
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
    message: 'Оберіть валюту зі списку',
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
  fuel_type: z
    .enum(['petrol', 'diesel', 'electric', 'hybrid', 'gas', 'other'], {
      message: 'Оберіть тип палива зі списку',
    })
    .optional(),
  transmission: z
    .enum(['manual', 'automatic', 'cvt', 'robotic', 'other'], {
      message: 'Оберіть коробку передач зі списку',
    })
    .optional(),
  body_type: z
    .enum(['sedan', 'hatchback', 'suv', 'wagon', 'coupe', 'convertible', 'pickup', 'van', 'minivan'], {
      message: 'Оберіть тип кузова зі списку',
    })
    .optional(),
  drive_type: z
    .enum(['front', 'rear', 'all', 'full'], {
      message: 'Оберіть тип приводу зі списку',
    })
    .optional(),
  is_new: z.string().optional(),
  plate_number: z
    .string()
    .max(20, 'Номер авто не може перевищувати 20 символів')
    .regex(/^[A-Z0-9\s-]*$/, 'Номер авто може містити тільки літери, цифри, пробіли та дефіси')
    .optional(),
  color: z
    .enum(
      [
        'black',
        'white',
        'gray',
        'red',
        'blue',
        'green',
        'silver',
        'beige',
        'brown',
        'yellow',
        'orange',
        'purple',
        'other',
      ],
      {
        message: 'Оберіть колір зі списку',
      },
    )
    .optional(),
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
  vin_code: z
    .string()
    .max(17, 'VIN-код має містити 17 символів')
    .regex(/^[A-HJ-NPR-Z0-9]{17}$/, 'Невірний формат VIN-коду')
    .optional(),
  registration_country: z.string().max(50, 'Країна реєстрації не може перевищувати 50 символів').optional(),
  is_custom_cleared: z.boolean().optional(),
  number_of_owners: z.coerce
    .number()
    .int('Кількість власників має бути цілим числом')
    .min(1, 'Кількість власників має бути не менше 1')
    .max(20, 'Кількість власників не може перевищувати 20')
    .optional(),
  technical_condition: z
    .enum(['excellent', 'good', 'satisfactory', 'needs_repair', 'not_running'], {
      message: 'Оберіть технічний стан зі списку',
    })
    .optional(),
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

  // Vehicle type field
  vehicle_type: z
    .enum(
      ['car', 'motorcycle', 'truck', 'trailer', 'specialtech', 'bus', 'watertransport', 'airtransport', 'motorhome'],
      {
        message: 'Оберіть тип транспорту',
      },
    )
    .optional(),
});

// Схема для профілю користувача
export const profileSchema = z.object({
  first_name: z.string().min(1, 'Введіть імʼя').max(50, 'Імʼя не може перевищувати 50 символів'),
  last_name: z.string().min(1, 'Введіть прізвище').max(50, 'Прізвище не може перевищувати 50 символів'),
  email: z.string().email('Введіть коректну пошту'),
  phone_number: z.string().regex(phoneRegex, 'Введіть коректний номер телефону').optional().or(z.literal('')),
  location: z.string().max(100, 'Місцезнаходження не може перевищувати 100 символів').optional(),
});

// Схема для зміни пароля
export const changePasswordSchema = z
  .object({
    current_password: passwordSchema,
    new_password: passwordSchema,
    confirm_password: z.string().min(6, 'Пароль має бути не менше 6 символів'),
  })
  .refine((data) => data.new_password === data.confirm_password, {
    message: 'Паролі не співпадають',
    path: ['confirm_password'],
  })
  .refine((data) => data.current_password !== data.new_password, {
    message: 'Новий пароль має відрізнятися від поточного',
    path: ['new_password'],
  });

// Схема для коментарів
export const commentSchema = z.object({
  text: z.string().min(1, 'Коментар не може бути порожнім').max(1000, 'Коментар не може перевищувати 1000 символів'),
});

// Схема для скарг
export const reportSchema = z.object({
  reason: z.enum(['spam', 'fraud', 'inappropriate', 'duplicate', 'other'], {
    message: 'Оберіть причину скарги',
  }),
  description: z
    .string()
    .min(10, 'Опис має містити принаймні 10 символів')
    .max(500, 'Опис не може перевищувати 500 символів'),
});

// Схема для фільтрів пошуку
export const vehicleFiltersSchema = z.object({
  page: z.coerce.number().int().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
  vehicle_type: z
    .enum([
      'car',
      'motorcycle',
      'truck',
      'trailer',
      'specialtech',
      'bus',
      'watertransport',
      'airtransport',
      'motorhome',
    ])
    .optional(),
  year_min: z.coerce
    .number()
    .int()
    .min(1900)
    .max(new Date().getFullYear() + 1)
    .optional(),
  year_max: z.coerce
    .number()
    .int()
    .min(1900)
    .max(new Date().getFullYear() + 1)
    .optional(),
  price_min: z.coerce.number().nonnegative().optional(),
  price_max: z.coerce.number().nonnegative().optional(),
  brand: z.string().max(50).optional(),
  model: z.array(z.string()).optional(),
  fuel_type: z.array(z.enum(['petrol', 'diesel', 'electric', 'hybrid', 'gas', 'other'])).optional(),
  transmission: z.array(z.enum(['manual', 'automatic', 'cvt', 'robotic', 'other'])).optional(),
  color: z
    .array(
      z.enum([
        'black',
        'white',
        'gray',
        'red',
        'blue',
        'green',
        'silver',
        'beige',
        'brown',
        'yellow',
        'orange',
        'purple',
        'other',
      ]),
    )
    .optional(),
  body_type: z
    .array(z.enum(['sedan', 'hatchback', 'suv', 'wagon', 'coupe', 'convertible', 'pickup', 'van', 'minivan']))
    .optional(),
  location: z.string().max(100).optional(),
  mileage: z.coerce.number().nonnegative().max(1000000).optional(),
  engine_volume: z.coerce.number().positive().max(10).optional(),
  engine_power: z.coerce.number().nonnegative().max(2000).optional(),
  drive_type: z.enum(['front', 'rear', 'all', 'full']).optional(),
  currency: z.enum(['USD', 'EUR', 'UAH']).optional(),
  technical_condition: z.enum(['excellent', 'good', 'satisfactory', 'needs_repair', 'not_running']).optional(),
  is_custom_cleared: z.boolean().optional(),
  is_new: z.boolean().optional(),
});

// Схема для повідомлень
export const messageSchema = z.object({
  content: z
    .string()
    .min(1, 'Повідомлення не може бути порожнім')
    .max(1000, 'Повідомлення не може перевищувати 1000 символів'),
});

// Схема для відновлення паролю
export const forgotPasswordSchema = z.object({
  email: z.string().email('Введіть коректну пошту'),
});

// Схема для скидання пароля
export const resetPasswordSchema = z
  .object({
    token: z.string().min(1, 'Токен є обовʼязковим'),
    password: passwordSchema,
    confirm_password: z.string().min(6, 'Пароль має бути не менше 6 символів'),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: 'Паролі не співпадають',
    path: ['confirm_password'],
  });

// Export types
export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type ConfirmFormData = z.infer<typeof confirmSchema>;
export type CarListingFormData = z.infer<typeof carListingSchema>;
export type ProfileFormData = z.infer<typeof profileSchema>;
export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;
export type CommentFormData = z.infer<typeof commentSchema>;
export type ReportFormData = z.infer<typeof reportSchema>;
export type VehicleFiltersFormData = z.infer<typeof vehicleFiltersSchema>;
export type MessageFormData = z.infer<typeof messageSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
