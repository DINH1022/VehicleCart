import React, { useState } from 'react';
import {
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Typography,
  ListItemIcon,
  Box,
  Divider
} from '@mui/material';
import { AccountCircle, ExitToApp, Person } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import usersApi from '../../service/api/usersApi';

const Account = ({ username, email, avatar, open }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleProfile = () => {
    navigate('/profile');
    handleClose();
  };

  const handleLogout = async () => {
    try {
      await usersApi.logout();
      localStorage.removeItem('userData');
      sessionStorage.removeItem('userData');
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
    handleClose();
  };

  return (
    <Box
      sx={{
        p: 2,
        minHeight: 56,
        display: 'flex',
        alignItems: 'center',
        justifyContent: open ? 'flex-start' : 'center',
      }}
    >
      <IconButton
        size="small"
        onClick={handleMenu}
        sx={{
          mr: open ? 2 : 'auto',
        }}
      >
        <Avatar 
          src={avatar || ''} 
          alt={username}
          sx={{ 
            width: 32, 
            height: 32, 
            bgcolor: '#1a237e',
            fontSize: '0.875rem'
          }}
        >
          {username?.charAt(0).toUpperCase()}
        </Avatar>
      </IconButton>
      
      {open && (
        <Typography
          variant="body2"
          sx={{
            color: '#1a237e',
            fontWeight: 500,
            opacity: open ? 1 : 0
          }}
        >
          {username}
        </Typography>
      )}

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem disabled>
          <ListItemIcon>
            <AccountCircle />
          </ListItemIcon>
          <Typography variant="body2">{email}</Typography>
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleProfile}>
          <ListItemIcon>
            <Person fontSize="small" />
          </ListItemIcon>
          Profile
        </MenuItem>
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <ExitToApp fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default Account;