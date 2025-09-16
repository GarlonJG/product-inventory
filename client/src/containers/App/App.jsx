import { useState, useCallback } from 'react';
import Container from '@mui/material/Container';
import { useGetItemsQuery, useAddItemMutation, useUpdateItemMutation, useDeleteItemMutation } from '../../features/inventory/items/api';
import ItemModal from '../../features/inventory/items/components/ItemModal';
import InventoryGrid from '../../features/inventory/components/InventoryGrid';
import '../../styles/App.css';
import { useToast } from '../../app/providers/ToastProvider';

const initialFormState = { 
  id: '', 
  name: '', 
  stock: 0, 
  sku: '',
  price: 0.00,
  description: '',
};

function App() {
  const [form, setForm] = useState(initialFormState);
  const [open, setOpen] = useState(false);
  const [apiError, setApiError] = useState(null);
  const { notify } = useToast();

  // hooks
  const { data: items = [], isLoading, isError } = useGetItemsQuery();
  const [addItem] = useAddItemMutation();
  const [updateItem] = useUpdateItemMutation();
  const [deleteItem] = useDeleteItemMutation();

  const handleOpen = useCallback(() => setOpen(true), []);
  const handleClose = useCallback(() => {
    setOpen(false);
    setApiError(null);
    resetInitialState();
  }, []);

  const changeItem = (item) => {
    setForm(item);
    handleOpen();
  };

  const resetInitialState = useCallback(() => {
    setForm(initialFormState);
  }, []);

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
          resetInitialState();
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
        resetInitialState();
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
          handleOpen={handleOpen}
          resetInitialState={resetInitialState}
          changeItem={changeItem}
          deleteItem={handleDelete}
        />
      </Container>
      <ItemModal
        open={open}
        handleClose={handleClose}
        handleSubmit={handleSubmit}
        form={form}
        error={apiError}
        isSubmitting={isLoading}
      />
    </>
  );
}

export default App;
