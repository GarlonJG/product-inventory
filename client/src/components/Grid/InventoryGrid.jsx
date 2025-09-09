import { useMemo, useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import EditToolBar, { getInitialSettings, SETTINGS_STORAGE_KEY } from './EditToolBar';
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';

const boxStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  mb: 2,
};

const dataGridStyle = {
  height: '500px'
};

const InventoryGrid = ({ items, handleOpen, resetInitialState, changeItem, deleteItem }) => {

  const [settings, setSettings] = useState(getInitialSettings());

  useEffect(() => {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

    const columns = useMemo(() => [
        { field: 'name', headerName: 'Name', flex:1, minWidth: 200 },
        { field: 'stock', headerName: 'Stock', width: 100 },
        { field: 'sku', headerName: 'SKU', width: 100, maxLength: 6, align: 'center', truncateText: true },
        { 
          field: 'price', 
          headerName: 'Price', 
          width: 100,
          valueFormatter: (params) => {
            if (params == null) {
              return '';
            }
            return `$${parseFloat(params).toFixed(2)}`;
          } 
        },
        { field: 'description', headerName: 'Description', width: 200 },
        {
          field: 'actions',
          headerName: 'Actions',
          sortable: false,
          disableColumnMenu: true,
          disableExport: true,
          align: 'right',
          width: 90,
          renderCell: (params) => (
            <div>
              <Button
                size="small"
                startIcon={<EditIcon />}
                aria-label="Edit"
                sx={{ minWidth: '30px' }}
                onClick={() => changeItem(params.row)}/>
              <Button
                size="small"
                color="error"
                startIcon={<DeleteOutlinedIcon />}
                aria-label="Delete"
                sx={{ minWidth: '30px' }}
                onClick={(e) => deleteItem(e, params.row.id)}/>
            </div>
          ),
        },
      ], []);

    return (
        <>
            <Box sx={boxStyle}>
                <Typography variant="h4" component="h1">
                    Inventory
                </Typography>
            </Box>
        
            <Box sx={dataGridStyle}>
              <DataGrid
                  rows={items}
                  columns={columns}
                  pageSize={5}
                  rowsPerPageOptions={[5, 10, 25, 50]}
                  density={settings.density}
                  disableSelectionOnClick
                  slots={{ toolbar: EditToolBar }}
                  slotProps={{
                    toolbar: { 
                      handleOpen, 
                      resetInitialState,
                      settings,
                      onSettingsChange: setSettings
                    }
                  }}
                  showToolbar/>
            </Box>
        </>
    );
};

export default InventoryGrid;