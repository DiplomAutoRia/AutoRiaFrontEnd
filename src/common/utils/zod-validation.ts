import { z } from 'zod';

export const userSchema = z.object({
  username: z.string().min(1, 'Введіть імʼя'),
  email: z.string().email('Введіть коректну пошту'),
  password: z.string().min(6, 'Парполь має бути не менше 6 символів'),
  confirmPassword: z.string().min(6, 'Парполь має бути не менше 6 символів'),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export const loginSchema = z.object({
  email: z.string().email('Введіть коректну пошту'),
  password: z.string().min(6, 'Парполь має бути не менше 6 символів'),
});

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^\+?\d{10,15}$/;

export const registerSchema = z.object({
  firstName: z.string().min(1, 'Введіть імʼя'),
  lastName: z.string().min(1, 'Введіть прізвище'),
  contact: z.string().min(1, 'Введіть пошту або номер телефону').refine(
    val => emailRegex.test(val) || phoneRegex.test(val),
    { message: 'Введіть коректну пошту або номер телефону' }
  ),
  acceptTerms: z.literal(true, { errorMap: () => ({ message: 'Потрібно прийняти умови' }) }),
});