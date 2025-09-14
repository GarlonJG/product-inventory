import { memo } from 'react';
import { useForm } from 'react-hook-form';
import { Box, Stack } from '@mui/material';
import FormInput from './FormInput';

const Form = memo(({ form, handleSubmit: onSubmit, formRef }) => {
  const { 
    control, 
    handleSubmit, 
    formState: { errors }
  } = useForm({
    defaultValues: form,
    mode: 'onChange'
  });

  const onSubmitHandler = (data) => {
    const formattedData = {
      ...data,
      sku: String(data.sku).padStart(6, '0'),
      stock: Number(data.stock) || 0,
      price: Number(data.price) || 0
    };

    onSubmit(formattedData);
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmitHandler)} noValidate ref={formRef}>
      <FormInput
        name="name"
        control={control}
        rules={{ required: 'Name is required' }}
        error={errors.name}
      />
      
      <FormInput
        name="sku"
        control={control}
        rules={{
          required: 'SKU is required',
          pattern: {
            value: /^\d{6}$/,
            message: 'SKU must be exactly 6 digits'
          },
          minLength: {
            value: 6,
            message: 'SKU must be exactly 6 digits'
          },
          maxLength: {
            value: 6,
            message: 'SKU must be exactly 6 digits'
          }
        }}
        error={errors.sku}
        inputProps={{
          maxLength: 6,
          inputMode: 'numeric',
          pattern: '[0-9]*',
          placeholder: '000000'
        }}
      />
      
      <FormInput
        name="description"
        control={control}
        error={errors.description}
        multiline
        rows={3}
      />
      
      <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
        <FormInput
          name="price"
          control={control}
          rules={{
            required: 'Price is required',
            min: {
              value: 0,
              message: 'Price must be a positive number'
            }
          }}
          error={errors.price}
          type="number"
          inputProps={{
            min: 0,
            step: '0.01'
          }}
        />
        
        <FormInput
          name="stock"
          control={control}
          rules={{
            required: 'Stock is required',
            min: {
              value: 0,
              message: 'Stock cannot be negative'
            },
            valueAsNumber: true
          }}
          error={errors.stock}
          type="number"
          inputProps={{
            min: 0,
            step: 1
          }}
        />
      </Stack>
    </Box>
  );
});

export default Form;