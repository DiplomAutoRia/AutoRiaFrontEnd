import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

// import { routes } from '../routes';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import { Box, Button, Fade, Typography } from '@mui/material';

const bounce = {
  animation: 'bounce 1.2s infinite',
};

const styles = `
@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-20px);
  }
  80% {
    transform: translateY(-10px);
  }
}
`;

const NotFound = () => {
  const { t } = useTranslation();

  return (
    <>
      <style>{styles}</style>
      <Fade in timeout={800}>
        <Box
          sx={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: 'background.default',
            color: 'text.primary',
            gap: 3,
            textAlign: 'center',
          }}
        >
          <FitnessCenterIcon sx={{ fontSize: 100, color: 'primary.main', ...bounce }} />
          <Typography variant="h2" fontWeight={700}>
            404
          </Typography>
          <Typography variant="h5" sx={{ mb: 2 }}>
            {t('notFound')}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4, whiteSpace: 'pre-line' }}>
            {t('404')}
          </Typography>
          <Button component={Link} to={''} variant="contained" color="primary" size="large">
            {t('toMain')}
          </Button>
        </Box>
      </Fade>
    </>
  );
};

export default NotFound;
