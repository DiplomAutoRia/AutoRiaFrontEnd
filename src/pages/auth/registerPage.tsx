import { useState } from 'react';
import { registerSchema } from '../../common/utils/zod-validation';
import { Link } from 'react-router-dom';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    contact: '',
    acceptTerms: false,
  });

  const [step, setStep] = useState<'main' | 'confirm'>('main');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submitted, setSubmitted] = useState(false);

  const [confirmData, setConfirmData] = useState({
    code: '',
    password: '',
    repeatPassword: '',
  });
  const [confirmErrors, setConfirmErrors] = useState<Record<string, string>>({});
  const [confirmTouched, setConfirmTouched] = useState<Record<string, boolean>>({});
  const [confirmSubmitted, setConfirmSubmitted] = useState(false);

  const validate = (fieldValues = formData) => {
    const result = registerSchema.safeParse(fieldValues);
    if (result.success) return {};
    const newErrors: Record<string, string> = {};
    result.error.errors.forEach(err => {
      if (err.path[0]) newErrors[err.path[0] as string] = err.message;
    });
    return newErrors;
  };

  const validateConfirm = (fields = confirmData) => {
    const newErrors: Record<string, string> = {};
    if (!fields.code.trim()) newErrors.code = 'Введіть код підтвердження';
    if (!fields.password.trim()) newErrors.password = 'Введіть пароль';
    else if (fields.password.length < 6) newErrors.password = 'Пароль має бути не менше 6 символів';
    if (!fields.repeatPassword.trim()) newErrors.repeatPassword = 'Повторіть пароль';
    else if (fields.password !== fields.repeatPassword) newErrors.repeatPassword = 'Паролі не співпадають';
    return newErrors;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => {
      const updated = {
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      };
      setErrors(validate(updated));
      return updated;
    });
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
  };

  const handleConfirmChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setConfirmData(prev => {
      const updated = { ...prev, [name]: value };
      setConfirmErrors(validateConfirm(updated));
      return updated;
    });
  };

  const handleConfirmFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target;
    setConfirmTouched(prev => ({ ...prev, [name]: true }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    const newErrors = validate(formData);
    setErrors(newErrors);
    setTouched({ firstName: true, lastName: true, contact: true });
    if (Object.keys(newErrors).length === 0 && formData.acceptTerms) {
      setStep('confirm');
    }
  };

  const handleConfirmSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setConfirmSubmitted(true);
    const newErrors = validateConfirm(confirmData);
    setConfirmErrors(newErrors);
    setConfirmTouched({ code: true, password: true, repeatPassword: true });
    if (Object.keys(newErrors).length === 0) {
      alert('Реєстрація завершена!');
    }
  };

  const handleGoogleLogin = () => {
    if (!formData.acceptTerms) return;
    alert('not found');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-10">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-6">Реєстрація</h2>
        {step === 'main' ? (
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <div className="relative">
                <input
                  type="text"
                  name="firstName"
                  className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-transparent ${errors.firstName && (touched.firstName || formData.firstName) ? 'border-red-500' : 'border-gray-300'}`}
                  value={formData.firstName}
                  onChange={handleChange}
                  onFocus={handleFocus}
                  onBlur={handleFocus}
                  autoComplete="off"
                  placeholder="Імʼя"
                />
              </div>
              {errors.firstName && (touched.firstName || formData.firstName) && <p className="text-red-600 text-sm mt-1">{errors.firstName}</p>}
            </div>

            <div className="mb-4">
              <div className="relative">
                <input
                  type="text"
                  name="lastName"
                  className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-transparent ${errors.lastName && (touched.lastName || formData.lastName) ? 'border-red-500' : 'border-gray-300'}`}
                  value={formData.lastName}
                  onChange={handleChange}
                  onFocus={handleFocus}
                  onBlur={handleFocus}
                  autoComplete="off"
                  placeholder="Прізвище"
                />
              </div>
              {errors.lastName && (touched.lastName || formData.lastName) && <p className="text-red-600 text-sm mt-1">{errors.lastName}</p>}
            </div>

            <div className="mb-4">
              <div className="relative">
                <input
                  type="text"
                  name="contact"
                  className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-transparent ${errors.contact && (touched.contact || formData.contact) ? 'border-red-500' : 'border-gray-300'}`}
                  value={formData.contact}
                  onChange={handleChange}
                  onFocus={handleFocus}
                  onBlur={handleFocus}
                  autoComplete="off"
                  placeholder="Пошта або номер телефону"
                />
              </div>
              {errors.contact && (touched.contact || formData.contact) && <p className="text-red-600 text-sm mt-1">{errors.contact}</p>}
            </div>

            <div className="flex items-center mb-4">
              <input
                type="checkbox"
                id="acceptTerms"
                name="acceptTerms"
                checked={formData.acceptTerms}
                onChange={handleChange}
                className="mr-2"
              />
              <label htmlFor="acceptTerms" className="text-gray-700 cursor-pointer">
                Я приймаю умови
              </label>
            </div>

            <button
              type="submit"
              className="w-full py-2 mb-2 bg-indigo-600 text-white font-semibold rounded hover:bg-indigo-700 transition disabled:bg-indigo-300"
              disabled={!formData.acceptTerms}
            >
              Продовжити
            </button>

            <button
              type="button"
              className="w-full py-2 mb-4 bg-white border border-gray-300 text-gray-800 font-semibold rounded flex items-center justify-center gap-2 hover:bg-gray-50 transition disabled:bg-gray-100 disabled:text-gray-400"
              onClick={handleGoogleLogin}
              disabled={!formData.acceptTerms}
            >
              <img src="https://developers.google.com/identity/images/g-logo.png" alt="Google" className="w-5 h-5" />
              Увійти через Google
            </button>

            <div className="flex justify-end">
              <Link to="/login" className="text-indigo-600 hover:underline text-sm">
                Вже зареєстровані?
              </Link>
            </div>
          </form>
        ) : (
          <form onSubmit={handleConfirmSubmit}>
            <div className="mb-4">
              <div className="relative">
                <input
                  type="text"
                  name="code"
                  className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-transparent ${confirmErrors.code && (confirmTouched.code || confirmData.code) ? 'border-red-500' : 'border-gray-300'}`}
                  value={confirmData.code}
                  onChange={handleConfirmChange}
                  onFocus={handleConfirmFocus}
                  onBlur={handleConfirmFocus}
                  autoComplete="off"
                  placeholder="Код підтвердження"
                />
              </div>
              {confirmErrors.code && (confirmTouched.code || confirmData.code) && <p className="text-red-600 text-sm mt-1">{confirmErrors.code}</p>}
            </div>

            <div className="mb-4">
              <div className="relative">
                <input
                  type="password"
                  name="password"
                  className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-transparent ${confirmErrors.password && (confirmTouched.password || confirmData.password) ? 'border-red-500' : 'border-gray-300'}`}
                  value={confirmData.password}
                  onChange={handleConfirmChange}
                  onFocus={handleConfirmFocus}
                  onBlur={handleConfirmFocus}
                  autoComplete="off"
                  placeholder="Пароль"
                />
              </div>
              {confirmErrors.password && (confirmTouched.password || confirmData.password) && <p className="text-red-600 text-sm mt-1">{confirmErrors.password}</p>}
            </div>

            <div className="mb-4">
              <div className="relative">
                <input
                  type="password"
                  name="repeatPassword"
                  className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-transparent ${confirmErrors.repeatPassword && (confirmTouched.repeatPassword || confirmData.repeatPassword) ? 'border-red-500' : 'border-gray-300'}`}
                  value={confirmData.repeatPassword}
                  onChange={handleConfirmChange}
                  onFocus={handleConfirmFocus}
                  onBlur={handleConfirmFocus}
                  autoComplete="off"
                  placeholder="Повторіть пароль"
                />
              </div>
              {confirmErrors.repeatPassword && (confirmTouched.repeatPassword || confirmData.repeatPassword) && <p className="text-red-600 text-sm mt-1">{confirmErrors.repeatPassword}</p>}
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-indigo-600 text-white font-semibold rounded hover:bg-indigo-700 transition"
            >
              Завершити реєстрацію
            </button>

            <div className="flex justify-between mt-4">
              <Link to="/login" className="text-indigo-600 hover:underline text-sm">
                Вже зареєстровані
              </Link>
              <button
                type="button"
                className="text-indigo-600 hover:underline text-sm bg-transparent border-none cursor-pointer"
                onClick={() => setStep('main')}
              >
                Вказати інші дані
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
