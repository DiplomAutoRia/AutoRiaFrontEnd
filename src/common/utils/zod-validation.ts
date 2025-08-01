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
  title: z.string().min(1, 'Введіть назву'),
  price: z.coerce.number().positive('Ціна має бути більше нуля'),
  year: z.coerce
    .number()
    .min(1900, 'Рік випуску має бути не менше 1900')
    .max(new Date().getFullYear() + 1, 'Рік випуску не може бути в майбутньому'),
  mileage: z.coerce.number().nonnegative('Пробіг не може бути відʼємним'),
  brand: z.string().min(1, 'Оберіть марку'),
  fuel: z.string().min(1, 'Оберіть тип палива'),
  transmission: z.string().min(1, 'Оберіть коробку передач'),
  location: z.string().min(1, 'Введіть місцезнаходження'),
  image: z.any(), // Will be updated for file validation
});
