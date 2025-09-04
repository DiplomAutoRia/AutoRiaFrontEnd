import React from 'react';

import { TextField, type TextFieldProps } from '@mui/material';

export type InputProps = TextFieldProps;

const Input: React.FC<InputProps> = (props) => {
  return <TextField {...props} />;
};

export default Input;
