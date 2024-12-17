import React, { useState } from 'react';
import {
  Box,
  Container,
  TextField,
  Button,
  Typography,
  Paper,
  Checkbox,
  FormControlLabel,
  CircularProgress,
  Alert,
  Divider
} from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import { Link, useNavigate } from 'react-router-dom';
import Navigation from './Navigation';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.type === 'checkbox' ? e.target.checked : e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Add your API call here
      // const response = await authApi.login(formData);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      // Add Google authentication logic here
      // const response = await authApi.googleLogin();
      navigate('/');
    } catch (err) {
      setError(err.message || 'Google login failed');
    }
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <Navigation />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Container maxWidth="sm">
          <Paper 
            elevation={3} 
            sx={{ 
              p: 4, 
              mt: 8,
              backgroundColor: 'white',
              borderRadius: 2
            }}
          >
            <Typography 
              variant="h4" 
              align="center" 
              gutterBottom
              sx={{ 
                color: '#1a237e',
                fontWeight: 600,
                mb: 3
              }}
            >
              Login
            </Typography>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <Box 
              component="form" 
              onSubmit={handleSubmit} 
              noValidate
              sx={{ mt: 1 }}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                value={formData.email}
                onChange={handleChange}
                sx={{ mb: 2 }}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                autoComplete="current-password"
                value={formData.password}
                onChange={handleChange}
                sx={{ mb: 2 }}
              />
              <FormControlLabel
                control={
                  <Checkbox 
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                    color="primary"
                  />
                }
                label="Remember me"
                sx={{ mb: 2 }}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading}
                sx={{
                  mt: 2,
                  mb: 3,
                  py: 1.5,
                  backgroundColor: '#1a237e',
                  '&:hover': {
                    backgroundColor: '#000051'
                  }
                }}
              >
                {loading ? <CircularProgress size={24} /> : 'Sign In'}
              </Button>
              <Box sx={{ mt: 3, mb: 2 }}>
                <Divider>
                  <Typography variant="body2" color="text.secondary">
                    OR
                  </Typography>
                </Divider>
              </Box>

              <Button
                fullWidth
                variant="outlined"
                startIcon={<GoogleIcon />}
                onClick={handleGoogleLogin}
                sx={{
                  mt: 1,
                  py: 1.5,
                  borderColor: '#dadce0',
                  color: '#3c4043',
                  '&:hover': {
                    borderColor: '#dadce0',
                    backgroundColor: '#f8f9fa'
                  }
                }}
              >
                Continue with Google
              </Button>
              <Typography align="center" sx={{ mt: 2 }}>
                Don't have an account?{' '}
                <Link 
                  to="/register" 
                  style={{ 
                    textDecoration: 'none',
                    color: '#1a237e'
                  }}
                >
                  Sign up
                </Link>
              </Typography>
            </Box>
          </Paper>
        </Container>
      </Box>
    </Box>
  );
};

export default Login;