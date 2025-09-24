import { type ReactNode } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { Breadcrumbs, Button, Container, Grid, Link, Stack, Typography } from '@mui/material';

import { logout } from '../../redux/auth/authSlice';
import { routes } from '../../routes';

interface ProfileLayoutProps {
  children: ReactNode;
  title: string;
  showBreadcrumb?: boolean;
  activeSection?: string;
  onSectionChange?: (_section: string) => void;
}

export default function ProfileLayout({
  children,
  title,
  showBreadcrumb = true,
  activeSection: _activeSection = 'profile',
  onSectionChange,
}: ProfileLayoutProps) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSectionChange = (_section: string) => {
    if (onSectionChange) {
      onSectionChange(_section);
    } else {
      // Fallback to old navigation for backward compatibility
      switch (_section) {
        case 'profile':
          navigate(routes.PROFILE);
          break;
        case 'listings':
          navigate(routes.MY_LISTINGS);
          break;
        case 'messages':
          navigate(routes.MESSAGES);
          break;
        case 'notifications':
          navigate(routes.PROFILE); // Redirect to profile for notifications as fallback
          break;
        case 'favorites':
          navigate(routes.FAVORITES);
          break;
        case 'settings':
          alert('Налаштування будуть доступні незабаром');
          break;
        default:
          navigate(routes.PROFILE);
      }
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate(routes.HOME);
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4, px: '25%' }}>
      {/* Breadcrumb navigation */}
      {showBreadcrumb && (
        <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb" sx={{ mb: 2 }}>
          <Link
            color="inherit"
            href="/"
            onClick={(e) => {
              e.preventDefault();
              navigate('/');
            }}
            sx={{
              textDecoration: 'none',
              '&:hover': { textDecoration: 'underline' },
              cursor: 'pointer',
            }}
          >
            Turbosell
          </Link>
          <Typography color="text.primary">{title}</Typography>
        </Breadcrumbs>
      )}

      {/* Main header */}
      <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 3, color: 'text.primary' }}>
        {title}
      </Typography>

      <Grid container spacing={2}>
        {/* Navigation sidebar */}
        <Grid item xs={3}>
          <Stack spacing={2}>
            <Button
              fullWidth
              sx={{
                justifyContent: 'flex-start',
                color: 'black',
                textTransform: 'none',
                fontSize: '1rem',
                p: 1.5,
                '&:hover': { backgroundColor: 'rgba(0,0,0,0.04)' },
              }}
              onClick={() => handleSectionChange('profile')}
            >
              <img src="/profile/account.png" alt="account" style={{ width: 24, height: 24, marginRight: 12 }} />
              Особистий кабінет
            </Button>
            <Button
              fullWidth
              sx={{
                justifyContent: 'flex-start',
                color: 'black',
                textTransform: 'none',
                fontSize: '1rem',
                p: 1.5,
                '&:hover': { backgroundColor: 'rgba(0,0,0,0.04)' },
              }}
              onClick={() => handleSectionChange('listings')}
            >
              <img src="/profile/mark.png" alt="listings" style={{ width: 24, height: 24, marginRight: 12 }} />
              Мої оголошення
            </Button>
            <Button
              fullWidth
              sx={{
                justifyContent: 'flex-start',
                color: 'black',
                textTransform: 'none',
                fontSize: '1rem',
                p: 1.5,
                '&:hover': { backgroundColor: 'rgba(0,0,0,0.04)' },
              }}
              onClick={() => handleSectionChange('notifications')}
            >
              <img src="/profile/news.png" alt="notifications" style={{ width: 24, height: 24, marginRight: 12 }} />
              Повідомлення
            </Button>
            <Button
              fullWidth
              sx={{
                justifyContent: 'flex-start',
                color: 'black',
                textTransform: 'none',
                fontSize: '1rem',
                p: 1.5,
                '&:hover': { backgroundColor: 'rgba(0,0,0,0.04)' },
              }}
              onClick={() => handleSectionChange('messages')}
            >
              <img src="/profile/chat.png" alt="chat" style={{ width: 24, height: 24, marginRight: 12 }} />
              Чат
            </Button>
            <Button
              fullWidth
              sx={{
                justifyContent: 'flex-start',
                color: 'black',
                textTransform: 'none',
                fontSize: '1rem',
                p: 1.5,
                '&:hover': { backgroundColor: 'rgba(0,0,0,0.04)' },
              }}
              onClick={() => handleSectionChange('favorites')}
            >
              <img src="/profile/heart.png" alt="favorites" style={{ width: 24, height: 24, marginRight: 12 }} />
              Обране
            </Button>
            <Button
              fullWidth
              sx={{
                justifyContent: 'flex-start',
                color: 'black',
                textTransform: 'none',
                fontSize: '1rem',
                p: 1.5,
                '&:hover': { backgroundColor: 'rgba(0,0,0,0.04)' },
              }}
              onClick={() => handleSectionChange('settings')}
            >
              <img src="/profile/settings.png" alt="settings" style={{ width: 24, height: 24, marginRight: 12 }} />
              Налаштування
            </Button>
            <Button
              fullWidth
              sx={{
                justifyContent: 'flex-start',
                color: 'black',
                textTransform: 'none',
                fontSize: '1rem',
                p: 1.5,
                '&:hover': { backgroundColor: 'rgba(0,0,0,0.04)' },
              }}
              onClick={handleLogout}
            >
              <img src="/profile/exit.png" alt="exit" style={{ width: 24, height: 24, marginRight: 12 }} />
              Вихід
            </Button>
          </Stack>
        </Grid>

        {/* Main content */}
        <Grid item xs={9}>
          {children}
        </Grid>
      </Grid>
    </Container>
  );
}
