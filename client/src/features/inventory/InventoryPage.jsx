import React from 'react';
import { Outlet } from "react-router-dom";
import Container from '@mui/material/Container';

import { useGetItemsQuery } from './api';
import InventoryGrid from './components/grid/InventoryGrid';

function InventoryPage() {
  const { data: items = [], isLoading, isError } = useGetItemsQuery();

  //TODO: Add better UX for loading and error states
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