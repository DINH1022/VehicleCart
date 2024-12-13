
import React, { useState } from "react";
import {
  Typography,
  IconButton,
  Button,
  Divider,
  Box,
  Paper,
} from "@mui/material";
import {
  Delete,
  Add,
  Remove,
  ShoppingCart,
  LocalShipping,
  BrokenImage,
} from "@mui/icons-material";

const Cart = () => {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Rolex Submariner",
      brand: "Rolex",
      price: 15000000,
      quantity: 1,
      image: "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/g/a/garmin.jpg",
      color: "Silver",
    },
    {
      id: 2,
      name: "Omega Speedmaster",
      brand: "Omega",
      price: 12000000,
      quantity: 2,
      image: "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/g/a/garmin.jpg",
      color: "Black",
    },
    {
      id: 3,
      name: "Omega Speedmaster",
      brand: "Omega",
      price: 12000000,
      quantity: 2,
      image: "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/g/a/garmin.jpg",
      color: "Black",
    },
  ]);

  const updateQuantity = (id, newQuantity) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, newQuantity) }
          : item
      )
    );
  };

  const removeItem = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const calculateTotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  return (
    <Box sx={{ backgroundColor: "gray.50", minHeight: "100vh", p: 4 }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 4,
          maxWidth: "1200px",
          mx: "auto",
        }}
      >

        <Box flex={2} component={Paper} sx={{ p: 4, borderRadius: 2 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3,
            }}
          >
            <Box display="flex" alignItems="center" gap={2}>
              <ShoppingCart color="primary" fontSize="large" />
              <Typography variant="h5" fontWeight="bold">
                Giỏ Hàng Của Bạn
              </Typography>
            </Box>
            <Typography variant="h6" color="text.secondary">
              {cartItems.length} Sản Phẩm
            </Typography>
          </Box>
          <Divider sx={{ mb: 4 }} />

          {cartItems.map((item) => (
            <Box
              key={item.id}
              sx={{
                display: "flex",
                alignItems: "center",
                p: 2,
                mb: 3,
                borderRadius: 2,
                backgroundColor: "white",
                boxShadow: 1,
                "&:hover": { boxShadow: 3 },
              }}
            >
              <Box
                sx={{
                  width: 100,
                  height: 100,
                  backgroundColor: "gray.100",
                  borderRadius: 2,
                  overflow: "hidden",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mr: 3,
                }}
              >
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.name}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                ) : (
                  <BrokenImage color="disabled" fontSize="large" />
                )}
              </Box>

              <Box flex={1}>
                <Typography variant="h6" fontWeight="bold">
                  {item.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {item.brand}
                </Typography>
                <Typography
                  variant="body1"
                  color="primary"
                  fontWeight="bold"
                  mt={1}
                >
                  {item.price.toLocaleString()} VND
                </Typography>
              </Box>
              <Box display="flex" alignItems="center" gap={1}>
                <IconButton
                  size="small"
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                >
                  <Remove />
                </IconButton>
                <Typography
                  variant="body1"
                  sx={{
                    px: 2,
                    backgroundColor: "gray.200",
                    borderRadius: 1,
                  }}
                >
                  {item.quantity}
                </Typography>
                <IconButton
                  size="small"
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                >
                  <Add />
                </IconButton>
              </Box>

              <IconButton
                color="error"
                onClick={() => removeItem(item.id)}
                sx={{ ml: 2 }}
              >
                <Delete />
              </IconButton>
            </Box>
          ))}
        </Box>

        <Box flex={1} component={Paper} sx={{ p: 4, borderRadius: 2 }}>
          <Typography variant="h5" fontWeight="bold" mb={3}>
            Tóm Tắt Đơn Hàng
          </Typography>
          <Divider sx={{ mb: 3 }} />
          <Box mb={2} display="flex" justifyContent="space-between">
            <Typography>Tạm Tính</Typography>
            <Typography>{calculateTotal().toLocaleString()} VND</Typography>
          </Box>
          <Box mb={3} display="flex" justifyContent="space-between">
            <Typography>Phí Vận Chuyển</Typography>
            <Typography color="green">Miễn Phí</Typography>
          </Box>
          <Divider sx={{ mb: 3 }} />
          <Box mb={4} display="flex" justifyContent="space-between">
            <Typography variant="h6" fontWeight="bold">
              Tổng Cộng
            </Typography>
            <Typography variant="h6" color="primary" fontWeight="bold">
              {calculateTotal().toLocaleString()} VND
            </Typography>
          </Box>
          <Button
            variant="contained"
            fullWidth
            startIcon={<LocalShipping />}
            size="large"
            sx={{
              py: 2,
              borderRadius: 2,
              backgroundImage:
                "linear-gradient(to right, #4caf50, #81c784)",
              "&:hover": { opacity: 0.9 },
            }}
          >
            Tiến Hành Thanh Toán
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default Cart;