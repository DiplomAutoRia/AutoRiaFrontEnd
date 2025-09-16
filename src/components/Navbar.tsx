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
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
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

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ mr: 4 }}>
          <Link to={routes.HOME} style={{ color: 'inherit', textDecoration: 'none' }}>
            {t('navbar.home')}
          </Link>
        </Typography>

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
              {getUserInitials()}
            </Avatar>
            <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
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
