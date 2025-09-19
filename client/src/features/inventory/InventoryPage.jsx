import { useState, useCallback } from 'react';
import { Outlet } from "react-router-dom";
import Container from '@mui/material/Container';
import { useGetItemsQuery, useAddItemMutation, useUpdateItemMutation } from './items/api';
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
  

  const handleClose = useCallback(() => {
    setApiError(null);
  }, []);




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
        />
      </Container>
      <Outlet />
    </>
  );
}

export default InventoryPage;