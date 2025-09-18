import { useState, useCallback } from 'react';
import { Outlet } from "react-router-dom";
import Container from '@mui/material/Container';
import { useGetItemsQuery, useAddItemMutation, useUpdateItemMutation, useDeleteItemMutation } from './items/api';
import InventoryGrid from './components/InventoryGrid';
import { useToast } from '../../app/providers/ToastProvider';

function InventoryPage() {
  //const [form, setForm] = useState(INITIAL_ITEM_FORM);
  const [apiError, setApiError] = useState(null);
  const { notify } = useToast();

  // hooks
  const { data: items = [], isLoading, isError } = useGetItemsQuery();
  const [addItem] = useAddItemMutation();
  const [updateItem] = useUpdateItemMutation();
  const [deleteItem] = useDeleteItemMutation();

  const handleClose = useCallback(() => {
    setApiError(null);
    //resetInitialState();
  }, []);

  /* const resetInitialState = useCallback(() => {
    setForm(INITIAL_ITEM_FORM);
  }, []); */

  const handleSubmit = useCallback(async (formData) => {
    try {
      setApiError(null);
      
      if (formData.id) {
        // For updates, only send changed fields
        const originalItem = items.find(item => item.id === formData.id);
        const updatedFields = {};
        
        // Compare each field and only include changed ones
        Object.keys(formData).forEach(key => {
          if (formData[key] !== originalItem[key]) {
            updatedFields[key] = formData[key];
          }
        });
  
        if (Object.keys(updatedFields).length > 0) {
          await updateItem({ id: formData.id, ...updatedFields }).unwrap();
          notify({ message: 'Item updated', severity: 'success' });
          //resetInitialState();
          handleClose();
        } else {
          console.log("No fields were changed");
          notify({ message: 'No fields were changed', severity: 'info' });
          handleClose();
        }
      } else {
        // For new items, send all fields
        await addItem(formData).unwrap();
        notify({ message: 'Item created', severity: 'success' });
        //resetInitialState();
        handleClose();
      }
    } catch (error) {
      console.error('Error saving item:', error);
      // Set the error state to be handled by the ItemModal
      setApiError(error);
      // Don't close the modal on error - let the user see and fix the issues
    }
  }, [addItem, updateItem, handleClose, items, notify]);

  const handleDelete = useCallback(async (e, id) => {
    e.preventDefault();
    try {
      await deleteItem(id).unwrap();
      notify({ message: 'Item deleted', severity: 'success' });
    } catch (error) {
      console.error('Error deleting item:', error);
      notify({ message: 'Error deleting item', severity: 'error' });
    }
  }, [deleteItem, notify]);

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading items</div>;

  return (
    <>
      <Container 
        sx={{ 
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          pt: 2, 
          pb: 4 
        }}>
        <InventoryGrid 
          items={items}
          deleteItem={handleDelete}
        />
      </Container>
      <Outlet />
    </>
  );
}

export default InventoryPage;