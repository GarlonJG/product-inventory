import { memo } from 'react';
import { TextField } from '@mui/material';
import { Controller } from 'react-hook-form';

const FormInput = memo(({ 
  name, 
  control, 
  rules = {}, 
  error,
  helperText,
  ...props 
}) => {
  const label = name.charAt(0).toUpperCase() + name.slice(1);
  
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
        />
      )}
    />
  );
});

export default FormInput;