import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  Card,
  CardContent,
  Button,
  Alert,
} from "@mui/material";
import {
  People as PeopleIcon,
  ShoppingCart as ShoppingCartIcon,
  Inventory as InventoryIcon,
  AttachMoney as MoneyIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import Navigation from "../Auth/Navigation";
import usersApi from "../../service/api/usersApi";
import productsApi from "../../service/api/productsApi";

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
  });
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const users = await usersApi.getUsers();
        const products = await productsApi.allProducts();
        setStats({
          totalUsers: users.length,
          totalProducts: products.length,
          totalOrders: 150,
          totalRevenue: 250000000,
        });
      } catch (err) {
        setError("Failed to fetch dashboard statistics");
      }
    };
    fetchStats();
  }, []);

  const StatCard = ({ title, value, icon, color }) => (
    <Card sx={{ flex: 1, minWidth: "240px", backgroundColor: color }}>
      <CardContent>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box>
            <Typography variant="h6" sx={{ color: "white", mb: 1 }}>
              {title}
            </Typography>
            <Typography
              variant="h4"
              sx={{ color: "white", fontWeight: "bold" }}
            >
              {value}
            </Typography>
          </Box>
          {icon}
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <Navigation />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Typography
          variant="h4"
          sx={{ mb: 4, color: "#1a237e", fontWeight: 600 }}
        >
          Admin Dashboard
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box
          sx={{
            display: "flex",
            gap: 3,
            mb: 4,
            flexWrap: "wrap",
          }}
        >
          <StatCard
            title="Total Users"
            value={stats.totalUsers}
            icon={<PeopleIcon sx={{ fontSize: 40, color: "white" }} />}
            color="#1a237e"
          />
          <StatCard
            title="Total Products"
            value={stats.totalProducts}
            icon={<InventoryIcon sx={{ fontSize: 40, color: "white" }} />}
            color="#0d47a1"
          />
          <StatCard
            title="Total Orders"
            value={stats.totalOrders}
            icon={<ShoppingCartIcon sx={{ fontSize: 40, color: "white" }} />}
            color="#1565c0"
          />
          <StatCard
            title="Total Revenue"
            value={`${(stats.totalRevenue / 1000000).toFixed(1)}M VND`}
            icon={<MoneyIcon sx={{ fontSize: 40, color: "white" }} />}
            color="#1976d2"
          />
        </Box>

        <Box sx={{ display: "flex", gap: 3 }}>
          {/* Khối Quick Actions */}
          <Paper sx={{ p: 3, flex: "0 0 49%" }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Quick Actions
            </Typography>
            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
              <Button
                variant="contained"
                onClick={() => navigate("/users")}
                startIcon={<PeopleIcon />}
              >
                Manage Users
              </Button>
            </Box>
          </Paper>

          {/* Khối mới */}
          <Paper sx={{ p: 3, flex: "0 0 49%", ml: 0.5 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
            Quick Actions
            </Typography>
            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
              <Button
                variant="contained"
                onClick={() => navigate("/categories")}
                startIcon={<InventoryIcon />}
              >
                Manage Category
              </Button>
            </Box>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;