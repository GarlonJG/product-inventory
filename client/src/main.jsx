import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider, useDispatch } from 'react-redux';
import { RouterProvider } from "react-router-dom";

import { CssBaseline, GlobalStyles } from '@mui/material';
import './styles/index.css';
import './styles/App.css';

import { store } from './app/store';
import { ToastProvider } from './app/providers/ToastProvider';
import router from './routes/routes'
import { AuthProvider } from './features/auth/hooks/authcontext.provider'

// Global styles to ensure full viewport coverage
const globalStyles = {
  html: {
    height: '100%',
  },
  body: {
    margin: 0,
    minHeight: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  '#root': {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 0,
    width: '100vw',
    maxWidth: '100vw',
    background: `
          linear-gradient(127deg, rgb(255 255 255 / 1), transparent 80%),
          linear-gradient(217deg, rgb(0 247 218 / 0.8), transparent 80.71%),
          linear-gradient(336deg, rgb(206 0 247 / 0.8), transparent 80.71%)
    `,
    backgroundAttachment: 'fixed',
    padding: 2
  },
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <AuthProvider>
        <CssBaseline />
        <GlobalStyles styles={globalStyles} />
        <ToastProvider>
          <RouterProvider router={router} />
        </ToastProvider>
      </AuthProvider>
    </Provider>
  </StrictMode>
);
