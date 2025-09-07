import { useMemo } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import EditToolBar from './EditToolBar';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';

const boxStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  mb: 2,
};

const dataGridStyle = {
  height: 500,
  width: '100%'
};

const InventoryGrid = ({ items, handleOpen, resetInitialState, changeItem, deleteItem }) => {

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

    return (
        <>
            {/* <Box sx={boxStyle}> */}
                <Typography variant="h4" component="h1">
                    Inventory
                </Typography>
            {/* </Box> */}
        
            <div sx={dataGridStyle}>
            <DataGrid
                rows={items}
                columns={columns}
                pageSize={10}
                rowsPerPageOptions={[10, 25, 50]}
                disableExtendRowFullWidth
                disableSelectionOnClick
                slots={{ toolbar: EditToolBar }}
                slotProps={{
                  toolbar: { handleOpen, resetInitialState }
                }}
                showToolbar/>
            </div>
        </>
    );
};

export default InventoryGrid;