import { memo, useState, useEffect, useCallback } from 'react';
import { Box, Button } from '@mui/material';
import FormInput from './FormInput';   

const box_style = {
  mt: 2,
  display: 'flex',
  gap: 2,
  justifyContent: 'flex-end'
}

const Form = memo(({ form, handleSubmit, updateItem, handleClose }) => {
  console.log("Form rendered");
  const [localForm, setLocalForm] = useState(form);

  useEffect(() => {
    setLocalForm(form);
  }, [form]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setLocalForm(prev => ({
      ...prev,
      [name]: name === 'stock' ? Number(value) : value
    }));
  }, []);
  
  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (localForm.id) {
      updateItem(localForm);
    } else {
      handleSubmit(localForm);
    }
  };

  // Get all field names except 'id'
  const fieldNames = Object.keys(localForm).filter(key => key !== 'id');

  return (
    <form onSubmit={handleFormSubmit}>
      {fieldNames.map((fieldName) => (
        <FormInput
          key={fieldName}
          name={fieldName}
          value={localForm[fieldName] || ''}
          onChange={handleChange}
          type={fieldName === 'stock' ? 'number' : 'text'}
        />
      ))}
      <Box sx={box_style}>
        <Button variant="outlined" onClick={handleClose}>Cancel</Button>
        <Button type="submit" variant="contained" color="primary">
          {localForm.id ? 'Update' : 'Add'} Item
        </Button>
      </Box>
    </form>
  );
}, (prevProps, nextProps) => {
  return JSON.stringify(prevProps.form) === JSON.stringify(nextProps.form);
});

export default Form;