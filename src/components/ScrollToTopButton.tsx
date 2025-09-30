import { useEffect, useState } from 'react';

import { KeyboardArrowUp } from '@mui/icons-material';
import { Fab } from '@mui/material';

const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);

    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  if (!isVisible) {
    return null;
  }

  return (
    <Fab
      color="primary"
      size="medium"
      aria-label="scroll back to top"
      onClick={scrollToTop}
      sx={{
        position: 'fixed',
        bottom: 20,
        right: 20,
        backgroundColor: '#3b82f6',
        color: 'white',
        '&:hover': {
          backgroundColor: '#2563eb',
        },
        zIndex: 1000,
      }}
    >
      <KeyboardArrowUp />
    </Fab>
  );
};

export default ScrollToTopButton;
