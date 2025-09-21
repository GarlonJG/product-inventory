import { Outlet } from 'react-router-dom';
import UserMenu from '../features/userMenu/components/UserMenu';
import Box from '@mui/material/Box';

const headerStyles = {
    width: '100vw',
    position: 'fixed',
    top: '1rem',
    right: '1rem',
    display: 'flex',
    justifyContent: 'flex-end',
    zIndex: 100,
}

const MainLayout = () => {
  return (
    <Box component="main" sx={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <Box component="header" sx={headerStyles}>
          <UserMenu />
      </Box>
      <main>
        <Outlet />
      </main>
    </Box>
  );
};

export default MainLayout;
