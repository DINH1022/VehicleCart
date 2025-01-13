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
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import Navigation from "../Auth/Navigation";
import usersApi from "../../service/api/usersApi";
import productsApi from "../../service/api/productsApi";
import RevenueChart from '../../components/RevenueChart';
import orderApi from "../../service/api/orderApi";

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0
  });
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const users = await usersApi.getUsers();
        const products = await productsApi.allProducts();
        const orderStats = await orderApi.getTotalOrders();
        
        setStats({
          totalUsers: users.length,
          totalProducts: products.length,
          totalOrders: orderStats.totalOrders
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
        </Box>

        <RevenueChart />
      </Box>
    </Box>
  );
};

export default Dashboard;
