import React from 'react';

import { TextField, TextFieldProps } from '@mui/material';

export interface InputProps extends TextFieldProps {}

const Input: React.FC<InputProps> = (props) => {
  return <TextField {...props} />;
};

export default Input;
