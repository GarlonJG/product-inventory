import { StrictMode, Profiler } from 'react'
import { createRoot } from 'react-dom/client'
import { CssBaseline, GlobalStyles } from '@mui/material';
import './styles/index.css'
import App from './containers/App/App.jsx'

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
    <CssBaseline />
    <GlobalStyles styles={globalStyles} />
    <App />
  </StrictMode>
)
