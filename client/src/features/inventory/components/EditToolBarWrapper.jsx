import React from 'react';
import { useGridApiContext } from '@mui/x-data-grid';
import ToolbarMenu from './ToolbarMenu';

const EditToolBar = (props) => {
  const apiRef = useGridApiContext();

  const onExportCsv = () => {
    // Use DataGrid's API method to export
    apiRef.current.exportDataAsCsv();
  };

  const onPrint = () => {
    // Use DataGrid's built-in print (this opens print dialog)
    // There isn't a direct API to trigger print but GridToolbarPrint renders the button and dialog.
    // You can render GridToolbarPrint directly if you want native print toolbar button
    
    // Alternatively just do:
    window.print();
  };

  return (
    <div>
      <ToolbarMenu
        {...props}
        onExportCsv={onExportCsv}
        onPrint={onPrint}
      />
    </div>
  );
};

export default EditToolBar;