import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import LanguageIcon from '@mui/icons-material/Language';
import { Button, Menu, MenuItem } from '@mui/material';

import { Languages } from '../i18n/i18n';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLanguageChange = (language: string) => {
    i18n.changeLanguage(language);
    handleClose();
  };

  const getCurrentLanguageLabel = () => {
    return i18n.language === Languages.UK ? 'УКР' : 'ENG';
  };

  return (
    <>
      <Button color="inherit" onClick={handleClick} startIcon={<LanguageIcon />} sx={{ minWidth: 'auto', mr: 1 }}>
        {getCurrentLanguageLabel()}
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
      >
        <MenuItem onClick={() => handleLanguageChange(Languages.UK)} selected={i18n.language === Languages.UK}>
          Українська
        </MenuItem>
        <MenuItem onClick={() => handleLanguageChange(Languages.EN)} selected={i18n.language === Languages.EN}>
          English
        </MenuItem>
      </Menu>
    </>
  );
};

export default LanguageSwitcher;
