import { z } from 'zod';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^\+?\d{10,15}$/;

export const passwordSchema = z.string()
  .min(6, 'Пароль має бути не менше 6 символів')
  .refine(val => /[a-zA-Z]/.test(val), {
    message: 'Пароль має містити принаймні одну літеру'
  })
  .refine(val => /\d/.test(val), {
    message: 'Пароль має містити принаймні одну цифру'
  });

export const loginSchema = z.object({
  contact: z.string().min(1, 'Введіть пошту або номер телефону').refine(
    val => {
      if (emailRegex.test(val)) return true;
      if (phoneRegex.test(val)) return true;
      return false;
    },
    { message: 'Введіть коректну пошту (наприклад user@gmail.com) або номер телефону (наприклад +380123456789)' }
  ),
  password: passwordSchema
});

export const registerSchema = z.object({
  firstName: z.string().min(1, 'Введіть імʼя'),
  lastName: z.string().min(1, 'Введіть прізвище'),
  contact: z.string().min(1, 'Введіть пошту або номер телефону').refine(
    val => {
      if (emailRegex.test(val)) return true;
      if (phoneRegex.test(val)) return true;
      return false;
    },
    { message: 'Введіть коректну пошту (наприклад user@gmail.com) або номер телефону (наприклад +380123456789)' }
  ),
  acceptTerms: z.literal(true, { errorMap: () => ({ message: 'Потрібно прийняти умови' }) })
});
