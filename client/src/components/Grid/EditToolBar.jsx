import { useState, useRef } from 'react';
import { 
  Toolbar, 
  ToolbarButton,  
  ExportCsv,
  ExportPrint
} from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import Button from '@mui/material/Button';
import SettingsIcon from '@mui/icons-material/Settings';
import DownloadIcon from '@mui/icons-material/Download';
import PrintIcon from '@mui/icons-material/Print';
import Tooltip from '@mui/material/Tooltip';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import CheckIcon from '@mui/icons-material/Check';
import Divider from '@mui/material/Divider';
import SettingsBackupRestoreIcon from '@mui/icons-material/SettingsBackupRestore';

const toolbar_btn_style = {
  color: '#474747',
  fontWeight: 'bold',
  backgroundColor: '#efefef',
  borderRadius: '5px',
  border: '1px solid #d9d9d9',
  paddingLeft: '7px',
  paddingRight: '7px',
  '&:hover': {
    backgroundColor: '#1976d2',
    color: 'white',
  },
  '& span[class$="-startIcon"]': {
    marginRight: '5px'
  }
}

const toolbar_style = {
  gap: '7px',
  padding: '7px',
}

const icon_style = {
  fontSize: 'small'
}

const menu_item_style = {
  color: 'inherit',
  fontSize: 'small',
  fontWeight: 'bold',
  backgroundColor: 'none',
  width: '100%',
  minWidth: 'auto',
  height: '100%',
  display: 'flex',
  justifyContent: 'flex-start',
  gap: '7px',
  p: 0,
  '&:hover': {
    backgroundColor: 'transparent',
    boxShadow: 'none',
  },
  '& .MuiButton-startIcon': {
    m: 0,
    mr: 1,
  }
}

const DENISTY_OPTIONS = [
  { label: 'Compact density', value: 'compact' },
  { label: 'Standard density', value: 'standard' },
  { label: 'Comfortable density', value: 'comfortable' },
];

export const SETTINGS_STORAGE_KEY = 'inventory-grid-settings';

const SETTINGS_DEFAULT = {
  density: 'standard',
  showCellBorders: false,
  showColumnBorders: false,
};

export const getInitialSettings = () => {
  try {
    const storedSettings = localStorage.getItem(SETTINGS_STORAGE_KEY);
    return storedSettings ? JSON.parse(storedSettings) : SETTINGS_DEFAULT;
  } catch (error) {
    return SETTINGS_DEFAULT;
  }
};

const EditToolBar = ({handleOpen, resetInitialState, settings, onSettingsChange}) => {

  const [settingsMenuOpen, setSettingsMenuOpen] = useState(false);
  const settingsMenuTriggerRef = useRef(null);
  
    return (
      <Toolbar sx={toolbar_style}>
        <ToolbarButton 
          render={<Button 
                  sx={toolbar_btn_style}
                  size="small"
                  tabIndex={0}
                  startIcon={<AddIcon sx={icon_style} />}
                  onClick={() => {
                    resetInitialState();
                    handleOpen()}}>
                    Add Item
                  </Button>}/>
        <Tooltip title="Settings">
          <ToolbarButton
              ref={settingsMenuTriggerRef}
              id="settings-menu-trigger"
              aria-controls="settings-menu"
              aria-haspopup="true"
              aria-expanded={settingsMenuOpen ? 'true' : undefined}
              onClick={() => setSettingsMenuOpen(true)}>
              <SettingsIcon fontSize="small" sx={{ ml: 'auto' }} />
            </ToolbarButton>
        </Tooltip>

        <Menu
            id="settings-menu"
            anchorEl={settingsMenuTriggerRef.current}
            open={settingsMenuOpen}
            onClose={() => setSettingsMenuOpen(false)}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            slotProps={{
              list: {
                'aria-labelledby': 'settings-menu-trigger',
              },
            }}>
          {DENISTY_OPTIONS.map((option) => (
            <MenuItem
              key={option.value}
              onClick={() =>
                onSettingsChange((currentSettings) => ({
                  ...currentSettings,
                  density: option.value,
                }))
              }>
              <ListItemIcon>
                {settings.density === option.value && <CheckIcon fontSize="small" />}
              </ListItemIcon>
              <ListItemText>{option.label}</ListItemText>
            </MenuItem>
          ))}
          <Divider/>
          <MenuItem>
            <ExportCsv sx={menu_item_style}>
              <DownloadIcon sx={icon_style} /> Export
            </ExportCsv>
          </MenuItem>
          <MenuItem>
            <ExportPrint sx={menu_item_style}>
              <PrintIcon sx={icon_style} /> Print
            </ExportPrint>
          </MenuItem>
          <Divider/>
          <MenuItem onClick={() => onSettingsChange(SETTINGS_DEFAULT)}>
            <SettingsBackupRestoreIcon sx={icon_style} /> 
            Reset to defaults
          </MenuItem>
        </Menu>
        
      </Toolbar>
    );
}

export default EditToolBar;
