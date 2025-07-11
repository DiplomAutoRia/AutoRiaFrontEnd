import { useState } from 'react';
import { loginSchema } from '../../common/utils/zod-validation';
import { Link } from 'react-router-dom';

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false, 
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validate = (fieldValues = formData) => {
    const result = loginSchema.safeParse(fieldValues);
    if (result.success) return {};
    const newErrors: Record<string, string> = {};
    result.error.errors.forEach(err => {
      if (err.path[0]) newErrors[err.path[0] as string] = err.message;
    });
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validate(formData);
    setErrors(newErrors);
    setTouched({ email: true, password: true });
    if (Object.keys(newErrors).length === 0) {
      console.log('Form submitted:', formData);
    }
  };

  const handleGoogleLogin = () => {
    alert('Я хочу піцу!');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-10">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <div className="relative">
              <input
                type="email"
                name="email"
                className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-transparent ${errors.email && touched.email ? 'border-red-500' : 'border-gray-300'}`}
                value={formData.email}
                onChange={handleChange}
                onFocus={handleFocus}
                onBlur={handleFocus}
                autoComplete="off"
                placeholder="Email"
              />
            </div>
            {errors.email && touched.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
          </div>

          <div className="mb-4">
            <div className="relative">
              <input
                type="password"
                name="password"
                className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-transparent ${errors.password && touched.password ? 'border-red-500' : 'border-gray-300'}`}
                value={formData.password}
                onChange={handleChange}
                onFocus={handleFocus}
                onBlur={handleFocus}
                autoComplete="off"
                placeholder="Password"
              />
            </div>
            {errors.password && touched.password && <p className="text-red-600 text-sm mt-1">{errors.password}</p>}
          </div>

          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              id="rememberMe"
              name="rememberMe"
              checked={formData.rememberMe}
              onChange={handleChange}
              className="mr-2"
            />
            <label htmlFor="rememberMe" className="text-gray-700 cursor-pointer">
              Запам'ятати мене
            </label>
          </div>

          <button type="submit" className="w-full py-2 mb-2 bg-indigo-600 text-white font-semibold rounded hover:bg-indigo-700 transition">
            Login
          </button>

          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full py-2 mb-4 bg-white border border-gray-300 text-gray-800 font-semibold rounded flex items-center justify-center gap-2 hover:bg-gray-50 transition"
          >
            <img src="https://developers.google.com/identity/images/g-logo.png" alt="Google" className="w-5 h-5" />
            Увійти через Google
          </button>

          <div className="flex justify-between mt-4 text-sm">
            <Link to="/register" className="text-indigo-600 hover:underline">
              Зареєструватися
            </Link>
            <Link to="/register" className="text-indigo-600 hover:underline">
              Забули пароль?
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}