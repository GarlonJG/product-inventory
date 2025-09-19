// ToolbarMenu.jsx
import React, { useState, useRef } from 'react';
import {
  Button, Tooltip, Menu, MenuItem, ListItemIcon, ListItemText,
  Divider, IconButton, Typography, Box
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SettingsIcon from '@mui/icons-material/Settings';
import DownloadIcon from '@mui/icons-material/Download';
import PrintIcon from '@mui/icons-material/Print';
import CheckIcon from '@mui/icons-material/Check';
import SettingsBackupRestoreIcon from '@mui/icons-material/SettingsBackupRestore';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import ViewListIcon from '@mui/icons-material/ViewList';

const DENSITY_OPTIONS = [
  { label: 'Compact density', value: 'compact' },
  { label: 'Standard density', value: 'standard' },
  { label: 'Comfortable density', value: 'comfortable' },
];

/**
 * A pure toolbar menu that doesn't depend on DataGrid context
 * Props:
 * - settings: { density, view, ...}
 * - onSettingsChange: fn to update settings
 * - onViewChange: fn to toggle view ('grid' or 'list')
 * - onAdd: fn for Add item button
 * - onExportCsv: fn for export CSV
 * - onPrint: fn for print
 * - onResetSettings: fn to reset settings
 */
const ToolbarMenu = ({
  settings,
  onSettingsChange,
  onViewChange,
  onAdd,
  onExportCsv,
  onPrint,
  onResetSettings,
}) => {
  const [settingsMenuOpen, setSettingsMenuOpen] = useState(false);
  const settingsMenuTriggerRef = useRef(null);

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'flex-end', borderStyle: 'solid', borderColor: '#d9d9d9', borderWidth: '1px 1px 0 1px', borderRadius: '5px 5px 0 0', gap: 1, p: 1, backgroundColor: 'white' }}>
      <Button
        sx={{ fontWeight: 'bold' }}
        size="small"
        startIcon={<AddIcon />}
        onClick={onAdd}
        aria-label="Add item">
        Add Item
      </Button>

      <Tooltip title="Settings">
        <IconButton
          ref={settingsMenuTriggerRef}
          aria-controls={settingsMenuOpen ? 'settings-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={settingsMenuOpen ? 'true' : undefined}
          onClick={() => setSettingsMenuOpen(true)}
          size="small"
        >
          <SettingsIcon />
        </IconButton>
      </Tooltip>

      <Menu
        id="settings-menu"
        anchorEl={settingsMenuTriggerRef.current}
        open={settingsMenuOpen}
        onClose={() => setSettingsMenuOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        MenuListProps={{ 'aria-labelledby': 'settings-menu-trigger' }}
      >
        {DENSITY_OPTIONS.map((option) => (
          <MenuItem
            key={option.value}
            onClick={() => {
              onSettingsChange((current) => ({
                ...current,
                density: option.value,
              }));
              setSettingsMenuOpen(false);
            }}
          >
            <ListItemIcon>
              {settings.density === option.value && <CheckIcon fontSize="small" />}
            </ListItemIcon>
            <ListItemText>{option.label}</ListItemText>
          </MenuItem>
        ))}

        <Divider />

        <MenuItem
          onClick={() => {
            onViewChange();
            setSettingsMenuOpen(false);
          }}
        >
          <ListItemIcon>
            {settings.view === 'grid' ? <ViewListIcon /> : <ViewModuleIcon />}
          </ListItemIcon>
          <ListItemText>
            {settings.view === 'grid' ? 'Switch to List View' : 'Switch to Grid View'}
          </ListItemText>
        </MenuItem>

        <MenuItem
          onClick={() => {
            onExportCsv();
            setSettingsMenuOpen(false);
          }}
        >
          <ListItemIcon>
            <DownloadIcon />
          </ListItemIcon>
          <ListItemText>Export CSV</ListItemText>
        </MenuItem>

        <MenuItem
          onClick={() => {
            onPrint();
            setSettingsMenuOpen(false);
          }}
        >
          <ListItemIcon>
            <PrintIcon />
          </ListItemIcon>
          <ListItemText>Print</ListItemText>
        </MenuItem>

        <Divider />

        <MenuItem
          onClick={() => {
            onResetSettings();
            setSettingsMenuOpen(false);
          }}
        >
          <ListItemIcon>
            <SettingsBackupRestoreIcon />
          </ListItemIcon>
          <ListItemText>Reset to defaults</ListItemText>
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default ToolbarMenu;