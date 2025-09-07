import { useState, useEffect, useCallback, useMemo } from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import {
  GridRowModes,
  DataGrid,
  gridDensitySelector,
  GridActionsCellItem,
  GridRowEditStopReasons,
  Toolbar,
  ToolbarButton,
} from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import ItemModal from '../../components/Modal/ItemModal';
import InventoryGrid from '../../components/Grid/InventoryGrid';
import '../../styles/App.css';

const initialFormState = { 
  id: '', 
  name: '', 
  stock: 0, 
  sku: '' 
};

const dataGridStyle = {
  height: 500,
  width: '100%'
};

const boxStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  mb: 3
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

  const columns = useMemo(() => [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'name', headerName: 'Name', width: 200 },
    { field: 'stock', headerName: 'Stock', width: 120 },
    { field: 'sku', headerName: 'SKU', width: 150 },
    {
      field: 'actions',
      headerName: 'Actions',
      sortable: false,
      width: 150,
      renderCell: (params) => (
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button
            size="small"
            startIcon={<EditIcon />}
            onClick={() => changeItem(params.row)}>
            Edit
          </Button>
          <Button
            size="small"
            color="error"
            startIcon={<DeleteOutlinedIcon />}
            onClick={(e) => deleteItem(e, params.row.id)}>
            Delete
          </Button>
        </div>
      ),
    },
  ], []);

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
      <Container maxWidth="lg" sx={{ py: 4 }}>
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
