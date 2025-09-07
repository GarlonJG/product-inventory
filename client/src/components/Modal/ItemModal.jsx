import { Modal } from '@mui/material';
import Form from '../Form/Form';
import Box from '@mui/material/Box';
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

const ItemModal = ({ open, form, handleClose, handleSubmit, updateItem }) => {
  console.log("ItemModal rendered");

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={modal_box}>
        <Typography variant="h6" component="h2">
          {form.id ? 'Update Item' : 'Add Item'}
        </Typography>
        <Form form={form} handleSubmit={handleSubmit} updateItem={updateItem} handleClose={handleClose}/>
      </Box>
    </Modal>
  );
};

export default ItemModal;
