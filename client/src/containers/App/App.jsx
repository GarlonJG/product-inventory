import { useState, useEffect, useCallback } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import ItemModal from '../../components/Modal/ItemModal';
import InventoryGrid from '../../components/Grid/InventoryGrid';
import '../../styles/App.css';

const initialFormState = { 
  id: '', 
  name: '', 
  stock: 0, 
  sku: '' 
};

function App() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(initialFormState);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetch('http://localhost:5000/api/items')
      .then(response => response.json())
      .then(data => setItems(data))
      .catch(error => console.error('Error fetching items:', error));
  }, []);

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

  const handleSubmit = (formData) => {
    fetch('http://localhost:5000/api/items', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    })
      .then(response => response.json())
      .then(data => {
        setItems(items => [...items, data]);
        handleClose();
      })
      .catch(error => console.error('Error adding item:', error));
  };

  const updateItem = (formData) => {
    const { id: _, ...newData } = formData;
    const originalItem = items.find(item => item.id === formData.id);
    const updatedFields = {};
    
    Object.keys(newData).forEach(key => {
      if (newData[key] !== originalItem[key]) {
        updatedFields[key] =  newData[key];
      }
    });

    if (Object.keys(updatedFields).length === 0) {
      console.log("No fields were changed");
      handleClose();
      return;
    }

    fetch(`http://localhost:5000/api/items/${formData.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updatedFields)
    })
      .then(response => response.json())
      .then(data => {
        setItems(items => items.map(item => item.id === data.id ? data : item));
        handleClose();
      })
      .catch(error => console.error('Error updating item:', error));
  };

  const deleteItem = (e, id) => {
    e.preventDefault();
    fetch(`http://localhost:5000/api/items/${id}`, {
      method: 'DELETE'
    })
      .then(() => {
        setItems(items => items.filter(item => item.id !== id));
      })
      .catch(error => console.error('Error deleting item:', error));
  };

  return (
    <>
      <CssBaseline />
      <Container maxWidth="xl">
        <InventoryGrid 
          items={items}
          handleOpen={handleOpen}
          resetInitialState={resetInitialState}
          changeItem={changeItem}
          deleteItem={deleteItem}/>
      </Container>
      <ItemModal
        open={open}
        handleClose={handleClose}
        handleSubmit={handleSubmit}
        updateItem={updateItem}
        form={form}
      />
    </>
  );
}

export default App;
