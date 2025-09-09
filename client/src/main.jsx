import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { CssBaseline, GlobalStyles } from '@mui/material';
import { store } from './app/store';
import App from './containers/App/App.jsx';
import './styles/index.css';

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
    padding: 0,
    margin: 0,
    width: '100vw',
    maxWidth: '100vw',
  },
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <CssBaseline />
      <GlobalStyles styles={globalStyles} />
      <App />
    </Provider>
  </StrictMode>
);
