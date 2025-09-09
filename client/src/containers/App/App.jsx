import { useState, useCallback } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import { useGetItemsQuery, useAddItemMutation, useUpdateItemMutation, useDeleteItemMutation } from '../../services/api';
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

  // RTK Query hooks
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
    <Box
      sx={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        background: `
          linear-gradient(127deg, rgb(255 255 255 / 1), transparent 80%),
          linear-gradient(217deg, rgb(0 247 218 / 0.8), transparent 80.71%),
          linear-gradient(336deg, rgb(206 0 247 / 0.8), transparent 80.71%)
        `,
        backgroundAttachment: 'fixed',
        padding: 2,
      }}
    >
      <CssBaseline />
      <Container 
        maxWidth="xl" 
        sx={{ 
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          pt: 2, 
          pb: 4 
        }}
      >
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
    </Box>
  );
}

export default App;
