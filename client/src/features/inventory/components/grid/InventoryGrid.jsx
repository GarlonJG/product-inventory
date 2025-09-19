import { useMemo, useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

import InventoryList from './InventoryList';
import EditToolBar from '../toolbar/EditToolBar';
import ToolbarMenu from '../toolbar/ToolbarMenu';
import { exportCsvFromItems } from '../../../../shared/utils/exportCsv';
import { useInventoryActions } from '../../hooks/useInventoryActions';
import { getInitialSettings, SETTINGS_STORAGE_KEY } from '../../constants/toolBar';

const boxStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  mb: 2,
};

const dataGridStyle = {
  height: '500px'
};

const InventoryGrid = ({ items }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [settings, setSettings] = useState(getInitialSettings());

    const { handleAdd, handleEdit, handleDelete } = useInventoryActions();

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
                onClick={() => handleEdit(params.row.id)}/>
              <Button
                size="small"
                color="error"
                startIcon={<DeleteOutlinedIcon />}
                aria-label="Delete"
                sx={{ minWidth: '30px' }}
                onClick={(e) => handleDelete(e, params.row.id)}/>
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
            onAdd={handleAdd}
            onExportCsv={onExportCsv}
            onPrint={onPrint}
            onResetSettings={onResetSettings}
          />
          <InventoryList items={items}/>
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
                      handleAdd,
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
                onAdd={handleAdd}
                onExportCsv={onExportCsv}
                onPrint={onPrint}
                onResetSettings={onResetSettings}
              />
              <InventoryList items={items}/>
              </>
            )}
          </>
        )}
      </>
    );
};

export default InventoryGrid;