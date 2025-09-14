import { createContext, useContext, useMemo, useState } from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

const ToastContext = createContext({ notify: () => {} });

export const useToast = () => useContext(ToastContext);

export function ToastProvider({ children }) {
  const [snack, setSnack] = useState({
    open: false,
    message: '',
    severity: 'info',
    autoHideDuration: 3000,
  });

  const notify = ({ message, severity = 'info', autoHideDuration = 3000 }) => {
    setSnack({ open: true, message, severity, autoHideDuration });
  };

  const handleClose = (_, reason) => {
    if (reason === 'clickaway') return;
    setSnack((s) => ({ ...s, open: false }));
  };

  const value = useMemo(() => ({ notify }), []);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <Snackbar
        open={snack.open}
        autoHideDuration={snack.autoHideDuration}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleClose} severity={snack.severity} variant="filled" sx={{ width: '100%' }}>
          {snack.message}
        </Alert>
      </Snackbar>
    </ToastContext.Provider>
  );
}
