import { useState, useCallback } from 'react';
import Container from '@mui/material/Container';
import { useGetItemsQuery, useAddItemMutation, useUpdateItemMutation, useDeleteItemMutation } from '../../features/items/api';
import ItemModal from '../../components/Modal/ItemModal';
import InventoryGrid from '../../components/Grid/InventoryGrid';
import '../../styles/App.css';

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

  // hooks
  const { data: items = [], isLoading, isError } = useGetItemsQuery();
  const [addItem] = useAddItemMutation();
  const [updateItem] = useUpdateItemMutation();
  const [deleteItem] = useDeleteItemMutation();

  const handleOpen = useCallback(() => setOpen(true), []);
  const handleClose = useCallback(() => {
    setOpen(false);
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
        } else {
          console.log("No fields were changed");
          handleClose();
          return;
        }
      } else {
        // For new items, send all fields
        await addItem(formData).unwrap();
      }
      resetInitialState();
      handleClose();
    } catch (error) {
      console.error('Error saving item:', error);
    }
  }, [addItem, updateItem, handleClose, items]);

  const handleDelete = useCallback(async (e, id) => {
    e.preventDefault();
    try {
      await deleteItem(id).unwrap();
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  }, [deleteItem]);

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
      />
    </>
  );
}

export default App;
