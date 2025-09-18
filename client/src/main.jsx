import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { CssBaseline, GlobalStyles } from '@mui/material';
import { store } from './app/store';
import './styles/index.css';
import './styles/App.css';
import { ToastProvider } from './app/providers/ToastProvider';
import { RouterProvider } from "react-router-dom";
import router from "./routes/routes";

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
      <CssBaseline />
      <GlobalStyles styles={globalStyles} />
      <ToastProvider>
        <RouterProvider router={router} />
      </ToastProvider>
    </Provider>
  </StrictMode>
);
