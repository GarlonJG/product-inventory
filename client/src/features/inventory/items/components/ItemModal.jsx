import React from 'react'
import { useRef, useState, useEffect } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import { Modal } from '@mui/material';
import ItemForm from './ItemForm';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import { useSelector } from 'react-redux';
import { useInventoryActions } from '../../hooks/useInventoryActions';
import { INITIAL_ITEM_FORM } from '../../constants/items';

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

const ItemModal = ({ error: propError }) => {
  console.log("ItemModal rendered");
  const [error, setError] = useState(null);
  const formRef = useRef();
  const { id } = useParams();
  const isNew = !id;
  const navigate = useNavigate();
  
  //COMING FROM URL: Use item from already-loaded list
  const item = useSelector(state => {
    const itemsMap = new Map(
      state.api.queries['getItems(undefined)']?.data?.map(item => [item.id, item])
    );
    const _item = itemsMap.get(Number(id));
    return _item;
  });

  const { handleSave } = useInventoryActions(item);

  // Will use item found from URL if it exists, otherwise use clean item
  const itemData = isNew ? INITIAL_ITEM_FORM : item;

  const handleClose = () => {
    navigate('..', { relative: 'route' });
  };

  useEffect(() => {
    if (itemData.id) {
      setError(propError);
    } else {
      setError(null);
    }
  }, [itemData.id, propError]);

  const localHandleSave = (e) => {
    e.preventDefault();
    if (formRef.current) {
      formRef.current.submit();
    }
  };

  return (
    <Modal
      open={true}
      onClose={handleClose}
      aria-labelledby="item-modal-title"
      aria-describedby="item-modal-description">
      <Box sx={modal_box}>
        <DialogTitle>{itemData.id ? 'Edit Item' : 'Add Item'}</DialogTitle>
        <ItemForm
          form={itemData} 
          handleSubmit={handleSave} 
          ref={formRef}
          error={error}
          isEditing={itemData.id}
          resetError={() => setError(null)} />
        <DialogActions sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <Button 
            variant="outlined" 
            onClick={handleClose}
            //disabled={isSubmitting}
            >
            Cancel
          </Button>
          <Button 
            type="submit" 
            variant="contained"
            onClick={localHandleSave}
            //disabled={isSubmitting}
            >
            {/* {isSubmitting ? 'Saving...' : 'Save'} */}
            Save
          </Button>
        </DialogActions>
      </Box>
    </Modal>
  );
};

export default ItemModal;
