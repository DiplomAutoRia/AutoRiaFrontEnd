import { useSelector } from 'react-redux';

import type { RootState } from '../../redux/store';

export default function ProfilePage() {
  const { user } = useSelector((state: RootState) => state.auth);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Профіль недоступний</h1>
          <p className="text-gray-600">Будь ласка, увійдіть до системи</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-8">
            <div className="flex items-center">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-indigo-600 text-3xl font-bold shadow-lg">
                {user.first_name?.[0]?.toUpperCase()}
                {user.last_name?.[0]?.toUpperCase()}
              </div>
              <div className="ml-6 text-white">
                <h1 className="text-3xl font-bold">
                  {user.first_name} {user.last_name}
                </h1>
                <p className="text-indigo-100 mt-1">{user.email || user.phone_number}</p>
                <div className="mt-2">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      user.is_verified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {user.is_verified ? 'Верифікований' : 'Не верифікований'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Особиста інформація</h2>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Ім'я</label>
                      <p className="mt-1 text-sm text-gray-900">{user.first_name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Прізвище</label>
                      <p className="mt-1 text-sm text-gray-900">{user.last_name}</p>
                    </div>
                    {user.email && (
                      <div>
                        <label className="text-sm font-medium text-gray-700">Email</label>
                        <p className="mt-1 text-sm text-gray-900">{user.email}</p>
                      </div>
                    )}
                    {user.phone_number && (
                      <div>
                        <label className="text-sm font-medium text-gray-700">Телефон</label>
                        <p className="mt-1 text-sm text-gray-900">{user.phone_number}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Статистика</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-gray-900">0</div>
                      <div className="text-sm text-gray-600">Оголошень</div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-gray-900">0</div>
                      <div className="text-sm text-gray-600">Улюблених</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Дії</h2>
                  <div className="space-y-3">
                    <button className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors">
                      Редагувати профіль
                    </button>
                    <button className="w-full bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors">
                      Мої оголошення
                    </button>
                    <button className="w-full bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors">
                      Улюблені
                    </button>
                    <button className="w-full bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors">
                      Налаштування
                    </button>
                  </div>
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Безпека</h2>
                  <div className="space-y-3">
                    <button className="w-full bg-yellow-500 text-white py-2 px-4 rounded-lg hover:bg-yellow-600 transition-colors">
                      Змінити пароль
                    </button>
                    <button className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors">
                      Видалити акаунт
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
