import React, { useState } from "react";
import {
  Typography,
  IconButton,
  Button,
  Divider,
  Box,
  Paper,
  useMediaQuery,
  useTheme,
  Tooltip,
} from "@mui/material";
import {
  Delete,
  Add,
  Remove,
  ShoppingCart,
  LocalShipping,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";

const GradientButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
  border: 0,
  borderRadius: 15,
  boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
  color: 'white',
  height: 48,
  padding: '0 30px',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'scale(1.05)',
    boxShadow: '0 5px 15px rgba(33, 203, 243, .4)',
  },
}));

const CartItemPaper = styled(Paper)(({ theme }) => ({
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-10px)',
    boxShadow: theme.shadows[8],
  },
}));

const Cart = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
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
    <Box 
      sx={{ 
        backgroundColor: theme.palette.background.default, 
        minHeight: '100vh', 
        p: { xs: 2, md: 4 },
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' 
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          gap: 4,
          maxWidth: "1400px",
          mx: "auto",
        }}
      >
        <Box flex={2} component={Paper} sx={{ 
          p: 4, 
          borderRadius: 4, 
          boxShadow: theme.shadows[6],
          background: 'linear-gradient(to right, #ffffff 0%, #f0f0f0 100%)'
        }}>
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
              <Typography variant="h4" fontWeight="bold" color="primary">
                Giỏ Hàng Của Bạn
              </Typography>
            </Box>
            <Typography variant="subtitle1" color="text.secondary">
              {cartItems.length} Sản Phẩm
            </Typography>
          </Box>
          <Divider sx={{ mb: 4 }} />

          {cartItems.map((item) => (
            <CartItemPaper
              key={item.id}
              sx={{
                display: "flex",
                alignItems: "center",
                p: 3,
                mb: 3,
                borderRadius: 3,
              }}
            >
              <Box
                sx={{
                  width: 120,
                  height: 120,
                  backgroundColor: "gray.100",
                  borderRadius: 3,
                  overflow: "hidden",
                  mr: 3,
                  boxShadow: theme.shadows[3],
                }}
              >
                <img
                  src={item.image}
                  alt={item.name}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </Box>

              <Box flex={1}>
                <Typography variant="h6" fontWeight="bold" color="primary">
                  {item.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {item.brand} - {item.color}
                </Typography>
                <Typography
                  variant="h6"
                  color="success.main"
                  fontWeight="bold"
                  mt={1}
                >
                  {item.price.toLocaleString()} VND
                </Typography>
              </Box>

              <Box display="flex" alignItems="center" gap={1}>
                <Tooltip title="Giảm số lượng">
                  <IconButton 
                    size="small" 
                    color="primary" 
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  >
                    <Remove />
                  </IconButton>
                </Tooltip>
                <Typography
                  variant="body1"
                  sx={{
                    px: 2,
                    py: 0.5,
                    backgroundColor: "primary.light",
                    borderRadius: 2,
                    color: "white",
                    fontWeight: "bold"
                  }}
                >
                  {item.quantity}
                </Typography>
                <Tooltip title="Tăng số lượng">
                  <IconButton 
                    size="small" 
                    color="primary" 
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  >
                    <Add />
                  </IconButton>
                </Tooltip>
              </Box>

              <Box display="flex" ml={2}>
                <Tooltip title="Xóa sản phẩm">
                  <IconButton 
                    color="error" 
                    onClick={() => removeItem(item.id)}
                  >
                    <Delete />
                  </IconButton>
                </Tooltip>
    
              </Box>
            </CartItemPaper>
          ))}
        </Box>

        <Box 
          flex={1} 
          component={Paper} 
          sx={{ 
            p: 4, 
            borderRadius: 4, 
            boxShadow: theme.shadows[6],
            background: 'linear-gradient(to right, #ffffff 0%, #e0e0e0 100%)',
            position: 'sticky',
            top: 20,
            alignSelf: 'flex-start',
          }}
        >
          <Typography variant="h5" fontWeight="bold" mb={3} color="primary">
            Tóm Tắt Đơn Hàng
          </Typography>
          <Divider sx={{ mb: 3 }} />
          <Box mb={2} display="flex" justifyContent="space-between">
            <Typography>Tạm Tính</Typography>
            <Typography fontWeight="bold">
              {calculateTotal().toLocaleString()} VND
            </Typography>
          </Box>
          <Box mb={3} display="flex" justifyContent="space-between">
            <Typography>Phí Vận Chuyển</Typography>
            <Typography color="success.main" fontWeight="bold">
              Miễn Phí
            </Typography>
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
          <GradientButton
            fullWidth
            startIcon={<LocalShipping />}
            size="large"
          >
            Tiến Hành Thanh Toán
          </GradientButton>
        </Box>
      </Box>
    </Box>
  );
};

export default Cart;