import React from 'react';

import { Button as MuiButton, type ButtonProps as MuiButtonProps } from '@mui/material';

export interface ButtonProps extends MuiButtonProps {
  loading?: boolean;
}

const Button: React.FC<ButtonProps> = ({ loading, disabled, children, ...props }) => {
  return (
    <MuiButton {...props} disabled={disabled || loading}>
      {loading ? 'Loading...' : children}
    </MuiButton>
  );
};

export default Button;
