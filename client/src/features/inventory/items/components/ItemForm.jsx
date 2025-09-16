import { memo, forwardRef, useEffect } from 'react';
import { Box, Stack } from '@mui/material';
import Form from '../../../../shared/ui/Form/Form';
import FormInput from '../../../../shared/ui/Form/FormInput';
import { useToast } from '../../../../app/providers/ToastProvider';
import { itemSchema } from '../../../../shared/validations/item.schema';

const ItemForm = memo(forwardRef(({ form, handleSubmit, error, resetError }, ref) => {
  const { notify } = useToast();

  // Show error message when error prop changes
  useEffect(() => {
    if (error) {
      const errorMessage = error.data?.message || 'An error occurred while saving the item';
      notify({ message: errorMessage, severity: 'error' });
      
      // Process field-specific errors
      if (Array.isArray(error.data?.errors)) {
        const fieldErrors = error.data.errors.reduce((acc, err) => {
          if (err.field) {
            // If we already have an error for this field, append the new message
            if (acc[err.field]) {
              acc[err.field].message += `, ${err.message}`;
            } else {
              acc[err.field] = { type: 'manual', message: err.message };
            }
          }
          return acc;
        }, {});
        
        if (ref?.current && Object.keys(fieldErrors).length > 0) {
          ref.current.setErrors(fieldErrors);
        }
      }
      
      // Reset the error after showing it
      resetError?.();
    }
  }, [error, notify, ref, resetError]);

  const transformValues = (data) => ({
    ...data,
    sku: String(data.sku).padStart(6, '0'),
    stock: Number(data.stock) || 0,
    price: Number(parseFloat(data.price).toFixed(2)) || 0
  });

  return (
    <Form
      defaultValues={form}
      transformValues={transformValues}
      externalOnSubmit={handleSubmit}
      ref={ref}
      schema={itemSchema}
    >
      {({ control, errors }) => (
        <Box>
          <FormInput
            name="name"
            control={control}
            rules={{ required: 'Name is required' }}
            error={errors.name}/>
          
          <FormInput
            name="sku"
            control={control}
            error={errors.sku}
            onlyNumbers
            slotProps={{
              htmlInput: {
                maxLength: 6,
                inputMode: 'numeric',
                placeholder: '000000',
                pattern: '[0-9]*'
              }
            }}/>
          
          <FormInput
            name="description"
            control={control}
            error={errors.description}
            multiline
            rows={3}/>
          
          <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
            <FormInput
              name="price"
              control={control}
              type="number"
              onlyNumbers
              error={errors.price}
              slotProps={{
                htmlInput: {
                  min: 0,
                  step: '0.01',
                  inputMode: 'decimal',
                  placeholder: '0.00'
                }
              }}/>
            
            <FormInput
              name="stock"
              control={control}
              type="number"
              onlyNumbers
              error={errors.stock}
              slotProps={{
                htmlInput: {
                  min: 0,
                  step: 1,
                  inputMode: 'numeric',
                  placeholder: '0'
                }
              }}/>
          </Stack>
        </Box>
      )}
    </Form>
  );
}));

export default ItemForm;