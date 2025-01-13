import React, { useState } from "react";
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
  Divider,
} from "@mui/material";
import Swal from "sweetalert2";
import { useGoogleLogin } from "@react-oauth/google";
import GoogleIcon from "@mui/icons-material/Google";
import FacebookIcon from '@mui/icons-material/Facebook';
import { Link, useNavigate } from "react-router-dom";
import Navigation from "./Navigation";
import usersApi from "../../service/api/usersApi";
import { loginSuccess } from "../../redux/feature/authSlice";
import { useDispatch } from "react-redux";
import cartApi from "../../service/api/cartRequest";
const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const validateForm = () => {
    if (!formData.email || !formData.password) {
      setError("Please fill in all fields");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address");
      return false;
    }
    return true;
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.type === "checkbox" ? e.target.checked : e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) return;

    setLoading(true);
    try {
      const loginData = {
        email: formData.email,
        password: formData.password,
      };

      const response = await usersApi.login(loginData);
      if (response.success === false) {
        Swal.fire("Thất bại !", response.mes, "error");
        return;
      }
      // Save user data to localStorage if rememberMe is checked
      if (formData.rememberMe) {
        localStorage.setItem("userData", JSON.stringify(response));
      } else {
        sessionStorage.setItem("userData", JSON.stringify(response));
      }
      const data = sessionStorage.getItem("carts");
      const carts = JSON.parse(data);
      await cartApi.addItemsToCart(carts);
      sessionStorage.removeItem("carts");

      navigate("/");
    } catch (err) {
      console.log(err);
      setError(err.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };
  const reponseGoogle = async (authResult) => {
    try {
      if (authResult["code"]) {
        const code = authResult["code"];
        const response = await usersApi.googleLogin(code);
        sessionStorage.setItem("userData", JSON.stringify(response));
        const data = sessionStorage.getItem("carts");
        const carts = JSON.parse(data);
        await cartApi.addItemsToCart(carts);
        sessionStorage.removeItem("carts");
        response.isAdmin ? navigate("/admin") : navigate('/');
      }
    } catch (error) {
      console.log("error", error);
    }
  };
  const handleGoogleLogin = useGoogleLogin({
    onSuccess: reponseGoogle,
    onError: reponseGoogle,
    flow: "auth-code",
  });

  const handleFacebookLogin = async (response) => {
    try {
      if (response.accessToken) {
        const result = await usersApi.facebookLogin(response.accessToken);
        sessionStorage.setItem("userData", JSON.stringify(result));
        const data = sessionStorage.getItem("carts");
        const carts = JSON.parse(data);
        await cartApi.addItemsToCart(carts);
        sessionStorage.removeItem("carts");
        result.isAdmin ? navigate("/admin") : navigate('/');
      }
    } catch (error) {
      console.error("Facebook login error:", error);
      setError("Facebook login failed");
    }
  };

  return (
    <Box sx={{ display: "flex" }}>
      <Navigation />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Container maxWidth="sm">
          <Paper
            elevation={3}
            sx={{
              p: 4,
              mt: 8,
              backgroundColor: "white",
              borderRadius: 2,
            }}
          >
            <Typography
              variant="h4"
              align="center"
              gutterBottom
              sx={{
                color: "#1a237e",
                fontWeight: 600,
                mb: 3,
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
                  backgroundColor: "#1a237e",
                  "&:hover": {
                    backgroundColor: "#000051",
                  },
                }}
              >
                {loading ? <CircularProgress size={24} /> : "Sign In"}
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
                  mb: 2,
                  py: 1.5,
                  borderColor: "#dadce0",
                  color: "#3c4043",
                  "&:hover": {
                    borderColor: "#dadce0",
                    backgroundColor: "#f8f9fa",
                  },
                }}
              >
                Continue with Google
              </Button>

              <Button
                fullWidth
                variant="outlined"
                startIcon={<FacebookIcon />}
                onClick={() => {
                  const fbAuthUrl = `https://www.facebook.com/v12.0/dialog/oauth` +
                    `?client_id=${import.meta.env.VITE_FACEBOOK_APP_ID}` +
                    `&redirect_uri=${encodeURIComponent('http://localhost:5173/')}` + // Hardcode the exact URI
                    `&scope=email,public_profile`;
                  window.location.href = fbAuthUrl;
                }}
                sx={{
                  py: 1.5,
                  borderColor: "#1877f2",
                  color: "#1877f2",
                  "&:hover": {
                    borderColor: "#1877f2",
                    backgroundColor: "#e7f3ff",
                  },
                }}
              >
                Continue with Facebook
              </Button>

              <Typography align="center" sx={{ mt: 2 }}>
                Don't have an account?{" "}
                <Link
                  to="/register"
                  style={{
                    textDecoration: "none",
                    color: "#1a237e",
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
