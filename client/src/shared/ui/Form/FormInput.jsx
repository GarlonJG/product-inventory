import React from 'react';
import { memo } from 'react';
import { TextField } from '@mui/material';
import { Controller } from 'react-hook-form';

const FormInput = memo(({ 
  name, 
  control, 
  rules = {}, 
  error,
  helperText,
  onlyNumbers,
  ...props 
}) => {
  const label = name.charAt(0).toUpperCase() + name.slice(1);

  const inputMode = props?.slotProps?.htmlInput?.inputMode;
  const isDecimal = inputMode === 'decimal';

  const numberHandlers = onlyNumbers ? {
    onKeyPress: (e) => {
      if (isDecimal ? !/[0-9.]/.test(e.key) : !/[0-9]/.test(e.key)) {
        e.preventDefault();
      }
    },
    onPaste: (e) => {
      const val = (e.clipboardData || window.clipboardData).getData('text');
      const valid = isDecimal ? /^\d*\.?\d*$/.test(val) : /^\d*$/.test(val);
      if (!valid) e.preventDefault();
    }
  } : {};
  
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field }) => (
        <TextField
          {...field}
          label={label}
          fullWidth
          margin="normal"
          error={!!error}
          helperText={error?.message || helperText}
          {...props}
          {...numberHandlers}
        />
      )}
    />
  );
});

export default FormInput;