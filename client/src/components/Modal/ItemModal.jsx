import { useRef } from 'react';
import { Modal } from '@mui/material';
import Form from '../Form/Form';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

const modal_box = {
  position: 'absolute', 
  top: '50%', 
  left: '50%', 
  transform: 'translate(-50%, -50%)', 
  bgcolor: 'background.paper', 
  boxShadow: 24, 
  p: 4,
  width: 400,
  maxWidth: '90%'
};

const ItemModal = ({ open, form, handleClose, handleSubmit }) => {
  console.log("ItemModal rendered");

  const formRef = useRef();

  const handleSave = (e) => {
    e.preventDefault();
    if (formRef.current) {
      formRef.current.dispatchEvent(
        new Event('submit', { cancelable: true, bubbles: true })
      );
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="item-modal-title"
      aria-describedby="item-modal-description">
      <Box sx={modal_box}>
        <Typography variant="h6" component="h2">
          {form.id ? 'Edit Item' : 'Add Item'}
        </Typography>
        <Form 
          form={form} 
          handleSubmit={handleSubmit} 
          formRef={formRef}/>
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <Button 
            variant="outlined" 
            onClick={handleClose}>
            Cancel
          </Button>
          <Button 
            type="submit" 
            variant="contained"
            onClick={handleSave}>
            Save
          </Button>
      </Box>
      </Box>
    </Modal>
  );
};

export default ItemModal;
