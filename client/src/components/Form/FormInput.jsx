import { memo } from 'react';
import { TextField } from '@mui/material';

const FormInput = memo(({ name, value, onChange, type = 'text' }) => {
    const label = name.charAt(0).toUpperCase() + name.slice(1);
    
    return (
        <TextField
            label={label}
            name={name}
            value={value}
            onChange={onChange}
            type={type}
            fullWidth
            margin="normal"
        />
    );
}, (prevProps, nextProps) => {
    return prevProps.value === nextProps.value;
});

export default FormInput;