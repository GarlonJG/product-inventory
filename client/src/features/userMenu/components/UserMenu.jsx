import React, { useState, useRef, useEffect } from 'react';
import { FiLogOut, FiChevronDown } from 'react-icons/fi';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { useAuth } from '../../auth/hooks/authcontext.provider';

const UserMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const { user, logout } = useAuth();

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <Box component="nav" sx={{ position: 'relative', display: 'flex', alignItems: 'flex-end', flexDirection: 'column' }} ref={menuRef}>
      <button sx={{
        maxWidth: '55px',
        maxHeight: '55px'
      }}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-2 rounded-full hover:bg-gray-100 transition-colors"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <FiChevronDown style={{ 
          transition: 'transform 0.2s ease-in-out',
          transform: isOpen ? 'rotate(180deg)' : 'rotate(0)'
        }} />
      </button>

      {isOpen && (
        <Box sx={{
          mt: 1,
          bgcolor: 'white',
          borderRadius: 2,
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          zIndex: 1000
        }}>
          <Box sx={{
            px: 2,
            py: 1,
            borderBottom: '1px solid #ccc'
          }}>
            <p className="font-medium">{user?.firstName} {user?.lastName}</p>
            <p className="text-xs text-gray-500">{user?.email}</p>
          </Box>
          <Button sx={{
              px: 2,
              py: 1,
              cursor: 'pointer',
              '&:hover': {
                bgcolor: 'gray.100'
              }
            }}
            onClick={logout}>
            <FiLogOut className="mr-2" />
            Log Out
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default UserMenu;
