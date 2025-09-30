import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

import { AppBar, Toolbar, useMediaQuery, useTheme } from '@mui/material';
import { Bell, Heart, Menu as MenuIcon, MessageCircle, User, X } from 'lucide-react';

import { useGetUnreadCountQuery } from '../redux/api/messagesApi';
import { logout } from '../redux/auth/authSlice';
import type { RootState } from '../redux/store';
import { routes } from '../routes';
import { NotificationBell } from './notifications/NotificationSystem';

const Navbar = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const { data: unreadData } = useGetUnreadCountQuery(undefined, {
    skip: !user,
    pollingInterval: 10000,
    skipPollingIfUnfocused: true,
  });
  const unreadCount = unreadData?.unread_count || 0;

  const handleProfile = () => {
    navigate(routes.PROFILE);
  };

  const handleMessages = () => {
    navigate(routes.PROFILE, { state: { activeSection: 'messages' } });
  };

  const handleFavorites = () => {
    navigate(routes.PROFILE, { state: { activeSection: 'favorites' } });
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate(routes.HOME);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const getUserInitials = () => {
    if (!user) return '';
    return `${user.first_name?.[0]?.toUpperCase() || ''}${user.last_name?.[0]?.toUpperCase() || ''}`;
  };

  if (isMobile) {
    return (
      <AppBar position="static" sx={{ backgroundColor: '#3b82f6' }}>
        <Toolbar sx={{ justifyContent: 'space-between', px: 2 }}>
          {/* Logo */}
          <Link to={routes.HOME} style={{ textDecoration: 'none' }}>
            <img src="/assets/images/logo.png" alt="AutoRia Logo" style={{ height: '32px', width: 'auto' }} />
          </Link>

          {/* Icons */}
          <div className="flex items-center space-x-3">
            {user ? (
              <>
                <button
                  onClick={handleMessages}
                  className="relative p-1 hover:bg-blue-700 rounded-full transition-colors"
                >
                  <MessageCircle size={20} />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </button>

                <button onClick={handleFavorites} className="p-1 hover:bg-blue-700 rounded-full transition-colors">
                  <Heart size={20} />
                </button>

                <NotificationBell />

                <button onClick={toggleMobileMenu} className="p-1 hover:bg-blue-700 rounded-full transition-colors">
                  {mobileMenuOpen ? <X size={20} /> : <MenuIcon size={20} />}
                </button>
              </>
            ) : (
              <>
                <button className="p-1 hover:bg-blue-700 rounded-full transition-colors">
                  <MessageCircle size={20} />
                </button>

                <button className="p-1 hover:bg-blue-700 rounded-full transition-colors">
                  <Heart size={20} />
                </button>

                <button className="p-1 hover:bg-blue-700 rounded-full transition-colors">
                  <Bell size={20} />
                </button>

                <button onClick={toggleMobileMenu} className="p-1 hover:bg-blue-700 rounded-full transition-colors">
                  {mobileMenuOpen ? <X size={20} /> : <MenuIcon size={20} />}
                </button>
              </>
            )}
          </div>
        </Toolbar>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="bg-blue-700 p-4">
            <div className="space-y-3">
              {user ? (
                <>
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
            </div>
          </div>
        )}
      </AppBar>
    );
  }

  return (
    <AppBar position="static">
      <Toolbar className="container mx-auto px-4 max-w-7xl justify-between">
        <Link to={routes.HOME} className="flex items-center">
          <img src="/assets/images/logo.png" alt="AutoRia Logo" className="h-8 w-auto" />
        </Link>

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
              <button
                onClick={handleMessages}
                className="relative p-2 hover:bg-blue-700 rounded-full transition-colors"
              >
                <MessageCircle size={20} />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>

              <button onClick={handleFavorites} className="p-2 hover:bg-blue-700 rounded-full transition-colors">
                <Heart size={20} />
              </button>

              <NotificationBell />

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
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
