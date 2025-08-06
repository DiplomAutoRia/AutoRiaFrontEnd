import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { requestPasswordReset } from '../../redux/auth/authSlice';
import type { RootState, AppDispatch } from '../../redux/store';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const forgotPasswordSchema = z.object({
  contact_info: z.string().min(1, 'Будь ласка, введіть ваш email або номер телефону'),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state: RootState) => state.auth);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  const { 
    register, 
    handleSubmit, 
    formState: { errors } 
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      const contactType = data.contact_info.includes('@') ? 'email' : 'phone';

      const contactInfo = {
        type: contactType,
        value: data.contact_info
      };
      
      await dispatch(requestPasswordReset(contactInfo)).unwrap();
      setSuccessMessage('Код для відновлення паролю надіслано на вашу контактну інформацію.');
      setTimeout(() => navigate('/reset-password', { state: { contact_info: contactInfo.value } }), 2000);
    } catch (err) {
      console.error('Failed to request password reset:', err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Відновлення паролю
          </h2>
        </div>
        
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}
        
        {successMessage && (
          <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-4">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm text-green-700">{successMessage}</p>
              </div>
            </div>
          </div>
        )}
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <div>
              <label htmlFor="contact_info" className="block text-sm font-medium text-gray-700">
                Email або номер телефону
              </label>
              <input
                id="contact_info"
                type="text"
                className={`mt-1 block w-full px-3 py-2 border ${
                  errors.contact_info ? 'border-red-500' : 'border-gray-300'
                } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                {...register('contact_info')}
              />
              {errors.contact_info && (
                <p className="mt-1 text-sm text-red-600">{errors.contact_info.message}</p>
              )}
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {loading ? 'Відправка...' : 'Надіслати код'}
            </button>
          </div>
          
          <div className="text-center">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="text-sm text-indigo-600 hover:text-indigo-900"
            >
              Повернутися назад
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
