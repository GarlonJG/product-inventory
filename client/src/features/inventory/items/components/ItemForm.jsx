// client/src/features/inventory/items/components/ItemForm.jsx
import { memo } from 'react';
import { Box, Stack } from '@mui/material';
import Form from '../../../../shared/ui/Form/Form';
import FormInput from '../../../../shared/ui/Form/FormInput';

const ItemForm = memo(({ form, handleSubmit, formRef }) => {
  const transformValues = (data) => ({
    ...data,
    sku: String(data.sku).padStart(6, '0'),
    stock: Number(data.stock) || 0,
    price: Number(data.price) || 0
  });

  return (
    <Form
      defaultValues={form}
      transformValues={transformValues}
      externalOnSubmit={handleSubmit}
      formRef={formRef}>

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
            slotProps={{
              htmlInput: {
                maxLength: 6,
                inputMode: 'numeric',
                pattern: '[0-9]*',
                placeholder: '000000'
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
              rules={{
                required: 'Price is required',
                min: { value: 0, message: 'Price must be positive' },
                pattern: {
                  value: /^\d*\.\d{2}$/,
                  message: 'Price must have 2 decimal places 0.00'
                }
              }}
              error={errors.price}
              slotProps={{
                htmlInput: {
                  min: 0,
                  step: '0.01',
                  inputMode: 'decimal',
                  pattern: '[0-9]*',
                  placeholder: '0.00'
                }
              }}/>
            
            <FormInput
              name="stock"
              control={control}
              type="number"
              rules={{
                required: 'Stock is required',
                min: { value: 0, message: 'Stock cannot be negative' },
                valueAsNumber: true
              }}
              error={errors.stock}
              slotProps={{
                htmlInput: {
                  min: 0,
                  step: 1,
                  inputMode: 'numeric',
                  pattern: '[0-9]*',
                  placeholder: '0'
                }
              }}/>
          </Stack>
        </Box>
      )}
    </Form>
  );
});

export default ItemForm;