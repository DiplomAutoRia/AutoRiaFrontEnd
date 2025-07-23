import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

import { AppBar, Avatar, Button, Menu, MenuItem, Toolbar, Typography } from '@mui/material';

import { logout } from '../redux/auth/authSlice';
import type { RootState } from '../redux/store';
import { routes } from '../routes';

const Navbar = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

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
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          <Link to={routes.HOME} style={{ color: 'inherit', textDecoration: 'none' }}>
            Auto Ria 2
          </Link>
        </Typography>

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
            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              onClick={handleClose}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
              <MenuItem onClick={handleProfile}>Профіль</MenuItem>
              <MenuItem onClick={handleLogout}>Вийти</MenuItem>
            </Menu>
          </>
        ) : (
          <>
            <Button color="inherit" component={Link} to={routes.LOGIN}>
              Login
            </Button>
            <Button color="inherit" component={Link} to={routes.REGISTER}>
              Register
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
