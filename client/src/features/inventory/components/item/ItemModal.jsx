import React from 'react'
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from 'react-redux';

import { Modal } from '@mui/material';
import Box from '@mui/material/Box';
import DialogTitle from '@mui/material/DialogTitle';

import ItemForm from './ItemForm';
import Form from '../../../../shared/ui/Form/Form';
import { useInventoryActions } from '../../hooks/useInventoryActions';
import { INITIAL_ITEM_FORM } from '../../constants/items';
import { createItemSchema, itemSchema } from '../../../../shared/validations/item.schema';

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

const ItemModal = () => {
  console.log("ItemModal rendered");
  const { id } = useParams();
  const isNew = !id;
  const navigate = useNavigate();
  
  //COMING FROM URL: Use item from already-loaded list
  const itemsArray = useSelector(state => state.api.queries['getItems(undefined)']?.data || []);
  const itemsMap = React.useMemo(() => {
    return new Map(itemsArray.map(item => [item.id, item]));
  }, [itemsArray]);

  const item = itemsMap.get(Number(id));
  const { handleSave } = useInventoryActions(item);

  // Will use item found from URL if it exists, otherwise use clean item
  const itemData = isNew ? INITIAL_ITEM_FORM : item;
  const isEditing = itemData.id;

  const handleClose = () => {
    navigate('..', { relative: 'route' });
  };

  return (
    <Modal
      open={true}
      onClose={handleClose}
      aria-labelledby="item-modal-title"
      aria-describedby="item-modal-description">
      <Box sx={modal_box}>
        <DialogTitle>{itemData.id ? 'Edit Item' : 'Add Item'}</DialogTitle>
        <Form 
          defaultValues={item} 
          onSubmit={handleSave}
          schema={isEditing ? itemSchema : createItemSchema}
          id="item-form">
            <ItemForm handleClose={handleClose}/>
        </Form>
      </Box>
    </Modal>
  );
};

export default ItemModal;
