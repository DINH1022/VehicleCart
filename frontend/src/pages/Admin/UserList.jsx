import React, { useState, useEffect, useMemo } from 'react';
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
  Stack,
  Pagination,
} from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon, Search as SearchIcon } from '@mui/icons-material';
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
  const [page, setPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');

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

  const filteredAndPaginatedUsers = useMemo(() => {
    const filtered = users.filter(user => 
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filtered.slice(startIndex, endIndex);
  }, [users, page, itemsPerPage, searchQuery]);

  const totalPages = useMemo(() => {
    const filtered = users.filter(user => 
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return Math.ceil(filtered.length / itemsPerPage);
  }, [users.length, itemsPerPage, searchQuery]);

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
    setPage(1); // Reset to first page when searching
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <Navigation />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <Typography 
            variant="h4" 
            sx={{ 
              color: '#1a237e',
              fontWeight: 600,
              flex: 1
            }}
          >
            User Management
          </Typography>

          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center',
            bgcolor: 'background.paper',
            borderRadius: '20px',
            padding: '4px 12px',
            border: '1px solid #e2e8f0',
            '&:hover': {
              bgcolor: '#f8fafc',
            },
          }}>
            <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />
            <TextField
              placeholder="Search users..."
              value={searchQuery}
              onChange={handleSearch}
              sx={{ 
                width: 200,
                '& .MuiInput-root': {
                  border: 'none',
                  '&:before, &:after': {
                    display: 'none',
                  },
                },
                '& .MuiInput-input': {
                  padding: '4px 0',
                },
              }}
              variant="standard"
              size="small"
            />
          </Box>
        </Box>

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
                ) : filteredAndPaginatedUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      <Typography color="text.secondary">
                        {searchQuery ? 'No users found matching your search' : 'No users available'}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredAndPaginatedUsers.map((user, index) => (
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

        {totalPages > 1 && (
          <Box sx={{ 
            mt: 3, 
            display: 'flex', 
            justifyContent: 'center',
            '& .MuiPagination-ul': {
              '& .MuiPaginationItem-root': {
                color: '#64748b',
                '&:hover': {
                  backgroundColor: '#f1f5f9',
                },
                '&.Mui-selected': {
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  fontWeight: 'bold',
                  '&:hover': {
                    backgroundColor: '#2563eb',
                  },
                },
              },
            },
          }}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={handlePageChange}
              color="primary"
              showFirstButton
              showLastButton
              size="large"
            />
          </Box>
        )}

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