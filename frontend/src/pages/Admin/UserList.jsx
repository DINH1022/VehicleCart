import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Typography,
  Chip,
  CircularProgress,
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  TextField,
  FormControlLabel,
  Switch,
  Avatar,
} from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import Navigation from '../Auth/Navigation';
import usersApi from '../../service/api/usersApi';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editUserData, setEditUserData] = useState({
    username: '',
    email: '',
    isAdmin: false
  });

  const fetchUsers = async () => {
    try {
      const data = await usersApi.getUsers();
      setUsers(data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch users');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (userId) => {
    try {
      await usersApi.deleteUser(userId);
      setUsers(users.filter(user => user._id !== userId));
      setDeleteDialogOpen(false);
    } catch (err) {
      setError('Failed to delete user');
    }
  };

  const openDeleteDialog = (user) => {
    setSelectedUser(user);
    setDeleteDialogOpen(true);
  };

  const handleEditClick = async (userId) => {
    try {
      const userData = await usersApi.getUserDetails(userId);
      setEditUserData({
        _id: userData._id,
        username: userData.username,
        email: userData.email,
        isAdmin: userData.isAdmin
      });
      setEditDialogOpen(true);
    } catch (err) {
      setError('Failed to fetch user details');
    }
  };

  const handleEditChange = (e) => {
    const { name, value, checked } = e.target;
    setEditUserData(prev => ({
      ...prev,
      [name]: name === 'isAdmin' ? checked : value
    }));
  };

  const handleEditSubmit = async () => {
    try {
      const updatedUser = await usersApi.updateUser(editUserData._id, editUserData);
      setUsers(users.map(user => 
        user._id === updatedUser._id ? updatedUser : user
      ));
      setEditDialogOpen(false);
      setError('');
    } catch (err) {
      setError('Failed to update user');
    }
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <Navigation />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Typography 
          variant="h4" 
          sx={{ 
            mb: 4, 
            color: '#1a237e',
            fontWeight: 600 
          }}
        >
          User Management
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                  <TableCell>Avatar</TableCell>
                  <TableCell>ID</TableCell>
                  <TableCell>Username</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      <CircularProgress />
                    </TableCell>
                  </TableRow>
                ) : (
                  users.map((user) => (
                    <TableRow key={user._id}>
                      <TableCell>
                        <Avatar 
                          src={user.avatar} 
                          alt={user.username}
                          sx={{ width: 40, height: 40 }}
                        >
                          {user.username?.charAt(0).toUpperCase()}
                        </Avatar>
                      </TableCell>
                      <TableCell>{user._id}</TableCell>
                      <TableCell>{user.username}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Chip 
                          label={user.isAdmin ? 'Admin' : 'User'}
                          color={user.isAdmin ? 'primary' : 'default'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <IconButton 
                          color="primary"
                          onClick={() => handleEditClick(user._id)}
                          disabled={user.isAdmin}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton 
                          color="error"
                          onClick={() => openDeleteDialog(user)}
                          disabled={user.isAdmin}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        <Dialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
        >
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete user: {selectedUser?.username}?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
            <Button 
              onClick={() => handleDelete(selectedUser?._id)} 
              color="error"
              autoFocus
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog 
          open={editDialogOpen} 
          onClose={() => setEditDialogOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Edit User</DialogTitle>
          <DialogContent>
            <Box component="form" sx={{ mt: 2 }}>
              <TextField
                fullWidth
                label="Username"
                name="username"
                value={editUserData.username}
                onChange={handleEditChange}
                margin="normal"
                required
              />
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={editUserData.email}
                onChange={handleEditChange}
                margin="normal"
                required
              />
              <FormControlLabel
                control={
                  <Switch
                    name="isAdmin"
                    checked={editUserData.isAdmin}
                    onChange={handleEditChange}
                    color="primary"
                  />
                }
                label="Admin Rights"
                sx={{ mt: 2 }}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
            <Button 
              onClick={handleEditSubmit} 
              variant="contained"
              color="primary"
            >
              Save Changes
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};

export default UserList;