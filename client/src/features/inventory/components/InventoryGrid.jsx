import { useMemo, useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import EditToolBar, { getInitialSettings, SETTINGS_STORAGE_KEY } from './EditToolBar';
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';

import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import InventoryList from './InventoryList';

import ToolbarMenu from './ToolbarMenu';
import { exportCsvFromItems } from '../../../shared/utils/exportCsv';
import { useNavigate } from 'react-router-dom';

const boxStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  mb: 2,
};

const dataGridStyle = {
  height: '500px'
};

const InventoryGrid = ({ items, deleteItem }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [settings, setSettings] = useState(getInitialSettings());

    const navigate = useNavigate();

    useEffect(() => {
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
    }, [settings]);

    useEffect(() => {
      if (!isMobile) {
        setSettings({
          ...settings,
          view: 'grid'
        });
      }
    }, [isMobile]);

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
                onClick={() => navigate(`/${params.row.id}/edit`)}/>
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

    const toggleView = () => {
      setSettings(prev => ({
        ...prev,
        view: prev.view === 'grid' ? 'list' : 'grid'
      }));
    };

    const onExportCsv = () => {
      exportCsvFromItems(items);
    };
  
    const onPrint = () => {
      // Simple approach: print current window, or open new window with formatted list
      window.print();
    };

    const onAdd = () => {
      navigate('/new');
    };

    const onResetSettings = () => {
      setSettings(getInitialSettings());
      localStorage.removeItem(SETTINGS_STORAGE_KEY);
    };

    return (
      <>
        <Box sx={boxStyle}>
          <Typography variant="h4" component="h1">
              Inventory
          </Typography>
        </Box>
        {isMobile ? (
          <>
          <ToolbarMenu
            settings={settings}
            onSettingsChange={setSettings}
            onViewChange={toggleView}
            onAdd={onAdd}
            onExportCsv={onExportCsv}
            onPrint={onPrint}
            onResetSettings={onResetSettings}
          />
          <InventoryList items={items} onDelete={deleteItem}/>
          </>
        ) : (
          <>
            {settings.view === 'grid' ? (
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
                      settings,
                      onSettingsChange: setSettings,
                      onViewChange: toggleView
                    }
                  }}
                  showToolbar/>
              </Box>
            ) : (
              <>
              <ToolbarMenu
                settings={settings}
                onSettingsChange={setSettings}
                onViewChange={toggleView}
                onAdd={onAdd}
                onExportCsv={onExportCsv}
                onPrint={onPrint}
                onResetSettings={onResetSettings}
              />
              <InventoryList items={items} onDelete={deleteItem}/>
              </>
            )}
          </>
        )}
      </>
    );
};

export default InventoryGrid;