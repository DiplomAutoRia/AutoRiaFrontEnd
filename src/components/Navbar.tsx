import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { 
  MessageCircle, 
  Heart, 
  Bell, 
  User, 
  Menu,
  X
} from 'lucide-react';

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
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const open = Boolean(anchorEl);

  const { data: unreadData } = useGetUnreadCountQuery(undefined, {
    skip: !user,
    pollingInterval: 10000,
    skipPollingIfUnfocused: true,
  });
  const unreadCount = unreadData?.unread_count || 0;

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleProfile = () => {
    navigate(routes.PROFILE);
    handleClose();
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate(routes.HOME);
    handleClose();
  };

  const getUserInitials = () => {
    if (!user) return '';
    return `${user.first_name?.[0]?.toUpperCase() || ''}${user.last_name?.[0]?.toUpperCase() || ''}`;
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ mr: 4 }}>
          <Link to={routes.HOME} style={{ color: 'inherit', textDecoration: 'none' }}>
            {t('navbar.home')}
          </Link>
        </div>

        <Box sx={{ flexGrow: 1, display: 'flex', gap: 2 }}>
          <Button color="inherit" component={Link} to={routes.VEHICLES}>
            {t('navbar.catalog')}
          </Button>
          {user && (
            <>
              <Button color="inherit" component={Link} to={routes.MY_VEHICLES}>
                {t('navbar.myListings')}
              </Button>
              <Button color="inherit" component={Link} to={routes.FAVORITES}>
                {t('navbar.favorites')}
              </Button>
              <Badge badgeContent={unreadCount} color="error">
                <Button color="inherit" component={Link} to={routes.MESSAGES}>
                  {t('navbar.messages')}
                </Button>
              </Badge>
              <Button color="inherit" component={Link} to={routes.VEHICLE_CREATE}>
                {t('navbar.addListing')}
              </Button>
            </>
          )}
        </Box>

        <LanguageSwitcher />

        {user ? (
          <>
            <Avatar
              onClick={handleClick}
              sx={{
                cursor: 'pointer',
                bgcolor: 'secondary.main',
                width: 40,
                height: 40,
                fontSize: '1rem',
              }}
            >
              Вживані авто
            </Link>
            <Link 
              to="#" 
              className="block py-2 hover:bg-blue-600 rounded px-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              <MenuItem onClick={handleProfile}>{t('navbar.profile')}</MenuItem>
              <MenuItem
                onClick={() => {
                  navigate(routes.MY_VEHICLES);
                  handleClose();
                }}
              >
                {t('navbar.myListings')}
              </MenuItem>
              <MenuItem
                onClick={() => {
                  navigate(routes.FAVORITES);
                  handleClose();
                }}
              >
                {t('navbar.favorites')}
              </MenuItem>
              <MenuItem onClick={handleLogout}>{t('navbar.logout')}</MenuItem>
            </Menu>
          </>
        ) : (
          <>
            <Button color="inherit" component={Link} to={routes.LOGIN}>
              {t('navbar.login')}
            </Button>
            <Button color="inherit" component={Link} to={routes.REGISTER}>
              {t('navbar.register')}
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
