import { 
  Toolbar, 
  ToolbarButton,  
  ExportCsv,
  ExportPrint
} from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import Button from '@mui/material/Button';
import DownloadIcon from '@mui/icons-material/Download';
import PrintIcon from '@mui/icons-material/Print';

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

const EditToolBar = ({handleOpen, resetInitialState}) => {
  
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
        <ExportCsv render={<ToolbarButton render={
          <Button 
            sx={toolbar_btn_style} 
            size="small" 
            tabIndex={0}
            startIcon={<DownloadIcon sx={icon_style} />}
            >
            Export
          </Button>} />} />
        <ExportPrint render={<ToolbarButton render={
          <Button 
            sx={toolbar_btn_style} 
            size="small"
            tabIndex={0}
            startIcon={<PrintIcon sx={icon_style} />}>
            Print
          </Button>} />} />
      </Toolbar>
    );
}

export default EditToolBar;
