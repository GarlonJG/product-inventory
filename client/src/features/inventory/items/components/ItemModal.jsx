import React from 'react'
import { useRef, useState, useEffect } from 'react';
import { Modal } from '@mui/material';
import ItemForm from './ItemForm';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';

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

const ItemModal = ({ open, form, handleClose, handleSubmit, isSubmitting, error: propError }) => {
  console.log("ItemModal rendered");
  const [error, setError] = useState(null);
  const formRef = useRef();

  // Reset error when modal is opened/closed
  useEffect(() => {
    if (open) {
      setError(propError);
    } else {
      setError(null);
    }
  }, [open, propError]);

  const handleSave = (e) => {
    e.preventDefault();
    if (formRef.current) {
      formRef.current.submit();
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="item-modal-title"
      aria-describedby="item-modal-description">
      <Box sx={modal_box}>
        <DialogTitle>{form.id ? 'Edit Item' : 'Add Item'}</DialogTitle>
        <ItemForm
          form={form} 
          handleSubmit={handleSubmit} 
          ref={formRef}
          error={error}
          isEditing={form.id}
          resetError={() => setError(null)} />
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
            onClick={handleSave}
            disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save'}
          </Button>
        </DialogActions>
      </Box>
    </Modal>
  );
};

export default ItemModal;
