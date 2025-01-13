import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Divider,
  Avatar,
  Tabs,
  Tab,
} from "@mui/material";
import { PhotoCamera, Person, Email, Lock } from "@mui/icons-material";
import Navigation from "../Auth/Navigation";
import usersApi from "../../service/api/usersApi";

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  console.log("props: ", props)
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const Profile = () => {
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    avatar: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const data = await usersApi.getProfile();
      setUserData((prevState) => ({
        ...prevState,
        username: data.username,
        email: data.email,
        avatar: data.avatar,
      }));
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch profile");
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setUserData({
      ...userData,
      [e.target.name]: e.target.value,
    });
    setError("");
    setSuccess("");
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const data = new FormData();
      data.append("avatar", file);
      try {
        const response = await usersApi.uploadAvatar(data);
        // Update local storage/session storage with new avatar
        const storage = localStorage.getItem('userData') ? localStorage : sessionStorage;
        const userData = JSON.parse(storage.getItem('userData'));
        const updatedUserData = { ...userData, avatar: response.avatar };
        storage.setItem('userData', JSON.stringify(updatedUserData));
        
        // Update state
        setUserData(prev => ({
          ...prev,
          avatar: response.avatar
        }));

        // Dispatch custom event
        window.dispatchEvent(new CustomEvent('avatarChange', { 
          detail: { avatar: response.avatar }
        }));

        setSuccess('Avatar updated successfully');
      } catch (error) {
        setError('Failed to update avatar');
      }
    }
  };

  const validateForm = () => {
    if (userData.password && userData.password !== userData.confirmPassword) {
      setError("Passwords don't match");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setUpdating(true);
    setError("");
    setSuccess("");

    try {
      const updateData = {
        username: userData.username,
        email: userData.email,
      };
      if (userData.password) {
        updateData.password = userData.password;
      }

      await usersApi.updateProfile(updateData);
      setSuccess("Profile updated successfully");
      setUserData((prev) => ({ ...prev, password: "", confirmPassword: "" }));
    } catch (err) {
      setError(err.message || "Failed to update profile");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex" }}>
      <Navigation />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          backgroundColor: "#f4f4f4",
          minHeight: "100vh",
        }}
      >
        <Container maxWidth="md">
          <Paper sx={{ mb: 4, p: 3 }}>
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                alignItems: "center",
                gap: 3,
              }}
            >
              <Avatar
                src={userData.avatar}
                alt={userData.username}
                sx={{ width: 120, height: 120 }}
              />
              <Box sx={{ textAlign: { xs: "center", sm: "left" } }}>
                <Typography variant="h4" gutterBottom>
                  {userData.username}
                </Typography>
                <Typography
                  variant="body1"
                  color="textSecondary"
                  sx={{ display: "flex", alignItems: "center", gap: 1 }}
                >
                  <Email fontSize="small" />
                  {userData.email}
                </Typography>
              </Box>
            </Box>
          </Paper>

          <Paper sx={{ mb: 4 }}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              variant="fullWidth"
              sx={{ borderBottom: 1, borderColor: "divider" }}
            >
              <Tab icon={<Person />} label="Thông tin chung" />
              <Tab icon={<PhotoCamera />} label="Ảnh đại diện" />
              <Tab icon={<Lock />} label="Mật khẩu" />
            </Tabs>

            {(error || success) && (
              <Box sx={{ p: 2 }}>
                {error && (
                  <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                  </Alert>
                )}
                {success && (
                  <Alert severity="success" sx={{ mb: 2 }}>
                    {success}
                  </Alert>
                )}
              </Box>
            )}

            <TabPanel value={tabValue} index={0}>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                <TextField
                  fullWidth
                  label="Username"
                  name="username"
                  value={userData.username}
                  onChange={handleChange}
                />
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={userData.email}
                  onChange={handleChange}
                />
                <Button
                  variant="contained"
                  fullWidth
                  onClick={handleSubmit}
                  disabled={updating}
                >
                  {updating ? <CircularProgress size={24} /> : "Lưu thay đổi"}
                </Button>
              </Box>
            </TabPanel>

            <TabPanel value={tabValue} index={1}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 3,
                }}
              >
                <Avatar
                  src={userData.avatar}
                  alt={userData.username}
                  sx={{ width: 150, height: 150 }}
                />
                <input
                  accept="image/*"
                  style={{ display: "none" }}
                  id="avatar-upload"
                  type="file"
                  onChange={handleAvatarUpload}
                />
                <label htmlFor="avatar-upload">
                  <Button
                    variant="contained"
                    component="span"
                    startIcon={<PhotoCamera />}
                  >
                    Thay đổi avatar
                  </Button>
                </label>
              </Box>
            </TabPanel>

            <TabPanel value={tabValue} index={2}>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                <TextField
                  fullWidth
                  label="New Password"
                  name="password"
                  type="password"
                  value={userData.password}
                  onChange={handleChange}
                />
                <TextField
                  fullWidth
                  label="Confirm New Password"
                  name="confirmPassword"
                  type="password"
                  value={userData.confirmPassword}
                  onChange={handleChange}
                />
                <Button
                  variant="contained"
                  fullWidth
                  onClick={handleSubmit}
                  disabled={updating}
                >
                  {updating ? (
                    <CircularProgress size={24} />
                  ) : (
                    "Thay đổi mật khẩu"
                  )}
                </Button>
              </Box>
            </TabPanel>
          </Paper>
        </Container>
      </Box>
    </Box>
  );
};

export default Profile;
