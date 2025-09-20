import React, { memo } from 'react';
import { Box, Stack } from '@mui/material';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import FormInput from '../../../../shared/ui/Form/FormInput';
import { useFormContext } from 'react-hook-form';

const ItemForm = memo(({ handleClose }) => {
  const { formState: { isSubmitting } } = useFormContext();
  return (
    <Box>
      <FormInput name="name"/>
      <FormInput
        name="sku"
        onlyNumbers
        slotProps={{
          htmlInput: {
            maxLength: 6,
            inputMode: 'numeric',
            placeholder: '000000',
            pattern: '[0-9]*'
          }
        }}/>
      <FormInput name="description" multiline rows={3}/>
      <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
        <FormInput
          name="price"
          type="number"
          onlyNumbers
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
          type="number"
          onlyNumbers
          slotProps={{
            htmlInput: {
              min: 0,
              step: 1,
              inputMode: 'numeric',
              placeholder: '0'
            }
          }}/>
      </Stack>
      <DialogActions sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
        <Button 
          variant="outlined" 
          onClick={handleClose}
          disabled={isSubmitting}>
          Cancel
        </Button>
        <Button 
          type="submit" 
          variant="contained"
          disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save'}
        </Button>
      </DialogActions>
    </Box>
  );
});

export default ItemForm;