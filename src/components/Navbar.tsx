import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

import { AppBar, Avatar, Badge, Box, Button, Menu, MenuItem, Toolbar, Typography } from '@mui/material';

import { useGetUnreadCountQuery } from '../redux/api/messagesApi';
import { logout } from '../redux/auth/authSlice';
import type { RootState } from '../redux/store';
import { routes } from '../routes';
import LanguageSwitcher from './LanguageSwitcher';

const Navbar = () => {
  const { t } = useTranslation();
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { data: unreadData } = useGetUnreadCountQuery(undefined, {
    skip: !user,
    pollingInterval: 10000,
    skipPollingIfUnfocused: true,
  });
  const unreadCount = unreadData?.unread_count || 0;

  const handleProfile = () => {
    navigate(routes.PROFILE);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate(routes.HOME);
  };

  const getUserInitials = () => {
    if (!user) return '';
    return `${user.first_name?.[0]?.toUpperCase() || ''}${user.last_name?.[0]?.toUpperCase() || ''}`;
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ mr: 4 }}>
          <Link to={routes.HOME} style={{ color: 'inherit', textDecoration: 'none' }}>
            {t('navbar.home')}
          </Link>
        </Typography>

        <div className="flex items-center space-x-6">
          <Link to={`${routes.VEHICLES}?is_new=false`} className="hover:text-gray-200 transition-colors">
            Вживані авто
          </Link>
          <Link to={`${routes.VEHICLES}?is_new=true`} className="hover:text-gray-200 transition-colors">
            Нові авто
          </Link>
          <Link 
            to={routes.VEHICLE_CREATE} 
            className="hover:text-gray-200 transition-colors"
            onClick={(e) => {
              if (!user) {
                e.preventDefault();
                navigate(routes.LOGIN);
              }
            }}
          >
            Продати авто
          </Link>
          <Link to="#" className="hover:text-gray-200 transition-colors">
            Пошук
          </Link>
        </div>

        <div className="flex items-center space-x-4">
          {user ? (
            <>
              <Link to={routes.MESSAGES} className="relative p-2 hover:bg-blue-700 rounded-full transition-colors">
                <MessageCircle size={20} />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </Link>
              
              <Link to={routes.FAVORITES} className="p-2 hover:bg-blue-700 rounded-full transition-colors">
                <Heart size={20} />
              </Link>
              
              <button className="p-2 hover:bg-blue-700 rounded-full transition-colors">
                <Bell size={20} />
              </button>
              
              <button
                onClick={handleProfile}
                className="flex items-center space-x-2 px-3 py-2 hover:bg-blue-700 rounded-full transition-colors"
              >
                <div className="w-8 h-8 bg-white text-blue-600 rounded-full flex items-center justify-center font-semibold">
                  {getUserInitials()}
                </div>
              </button>
            </>
          ) : (
            <>
              <button className="p-2 hover:bg-blue-700 rounded-full transition-colors">
                <MessageCircle size={20} />
              </button>
              
              <button className="p-2 hover:bg-blue-700 rounded-full transition-colors">
                <Heart size={20} />
              </button>
              
              <button className="p-2 hover:bg-blue-700 rounded-full transition-colors">
                <Bell size={20} />
              </button>
              
              <Link
                to={routes.LOGIN}
                className="flex items-center space-x-2 px-4 py-2 bg-white text-blue-600 rounded-full hover:bg-gray-100 transition-colors"
              >
                <User size={16} />
                <span>Увійти в кабінет</span>
              </Link>
            </>
          )}
        </div>
      </div>

      <div className="md:hidden flex items-center justify-between">

        <div className="flex items-center">
          <Link to={routes.HOME} className="flex items-center">
            <img 
              src="/locales/images/Logo_White.jpg" 
              alt="AutoRia Logo" 
              className="h-8 w-auto mr-4"
            />
          </Link>
        </div>

        <button
          onClick={toggleMobileMenu}
          className="p-2 hover:bg-blue-700 rounded-full transition-colors"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden mt-4 bg-blue-700 rounded-lg p-4">
          <div className="space-y-3">
            <Link 
              to={`${routes.VEHICLES}?is_new=false`} 
              className="block py-2 hover:bg-blue-600 rounded px-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Вживані авто
            </Link>
            <Link 
              to={`${routes.VEHICLES}?is_new=true`} 
              className="block py-2 hover:bg-blue-600 rounded px-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Нові авто
            </Link>
            <Link 
              to={routes.VEHICLE_CREATE} 
              className="block py-2 hover:bg-blue-600 rounded px-2"
              onClick={(e) => {
                if (!user) {
                  e.preventDefault();
                  setMobileMenuOpen(false);
                  navigate(routes.LOGIN);
                } else {
                  setMobileMenuOpen(false);
                }
              }}
            >
              Продати авто
            </Link>
            <Link 
              to="#" 
              className="block py-2 hover:bg-blue-600 rounded px-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Пошук
            </Link>
            
            {user ? (
              <>
                <Link 
                  to={routes.MESSAGES} 
                  className="block py-2 hover:bg-blue-600 rounded px-2 flex items-center space-x-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <MessageCircle size={16} />
                  <span>Повідомлення {unreadCount > 0 && `(${unreadCount})`}</span>
                </Link>
                <Link 
                  to={routes.FAVORITES} 
                  className="block py-2 hover:bg-blue-600 rounded px-2 flex items-center space-x-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Heart size={16} />
                  <span>Обране</span>
                </Link>
                <button 
                  className="block py-2 hover:bg-blue-600 rounded px-2 flex items-center space-x-2 w-full text-left"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Bell size={16} />
                  <span>Сповіщення</span>
                </button>
                <button 
                  className="block py-2 hover:bg-blue-600 rounded px-2 flex items-center space-x-2 w-full text-left"
                  onClick={() => {
                    handleProfile();
                    setMobileMenuOpen(false);
                  }}
                >
                  <div className="w-6 h-6 bg-white text-blue-600 rounded-full flex items-center justify-center font-semibold text-xs">
                    {getUserInitials()}
                  </div>
                  <span>Профіль</span>
                </button>
                <button 
                  className="block py-2 hover:bg-blue-600 rounded px-2 text-left"
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                >
                  Вийти
                </button>
              </>
            ) : (
              <Link 
                to={routes.LOGIN} 
                className="block py-2 hover:bg-blue-600 rounded px-2 flex items-center space-x-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                <User size={16} />
                <span>Увійти в кабінет</span>
              </Link>
            )}
          </div>
        </div>
      )}

    </nav>
  );
};

export default Navbar;
