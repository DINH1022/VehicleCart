import React, { useEffect, useState } from "react";
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
  History,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import cartApi from "../service/api/cartRequest";
import orderApi from "../service/api/orderApi";
import Navigation from "./Auth/Navigation";
import { Link } from "react-router-dom";
import {
  getCartSessionStorage,
  updateQuanityCartSessionStorage,
  removeCartFromSessionStorage,
  clearCartSessionStorage,
} from "../utils/sessionStorage.js";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

const GradientButton = styled(Button)(({ theme }) => ({
  background: "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
  border: 0,
  borderRadius: 15,
  boxShadow: "0 3px 5px 2px rgba(33, 203, 243, .3)",
  color: "white",
  height: 48,
  padding: "0 30px",
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "scale(1.05)",
    boxShadow: "0 5px 15px rgba(33, 203, 243, .4)",
  },
}));

const CartItemPaper = styled(Paper)(({ theme }) => ({
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "translateY(-10px)",
    boxShadow: theme.shadows[8],
  },
}));

const Cart = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [cartItems, setCartItems] = useState([]);
  const [login, setLogin] = useState(!!sessionStorage.getItem("userData"));
  const navigate = useNavigate();
  useEffect(() => {
    const fetchCart = async () => {
      try {
        if (login) {
          const products = await cartApi.getCart();
          setCartItems(products.items);
        } else {
          const savedCart = getCartSessionStorage();
          setCartItems(savedCart);
        }
      } catch (error) {
        console.error("Error fetching cart items:", error);
      }
    };

    fetchCart();
  }, []);

  const updateQuantity = async (id, newQuantity) => {
    try {
      if (newQuantity < 1) return;

      if (login) {
        await cartApi.updateCart(id, newQuantity);
      } else {
        updateQuanityCartSessionStorage(id, newQuantity);
      }

      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item.product._id === id ? { ...item, quantity: newQuantity } : item
        )
      );
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  const removeItem = async (id) => {
    try {
      if (login) {
        await cartApi.removeFromCart(id);
      } else {
        removeCartFromSessionStorage(id);
      }
      setCartItems((prevItems) =>
        prevItems.filter((item) => item.product._id !== id)
      );
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };
  const clearCart = async () => {
    try {
      if (login) {
        await cartApi.clearCart();
      } else {
        clearCartSessionStorage();
      }
      setCartItems([]);
    } catch (error) {
      console.error("Error clearing cart:", error);
    }
  };
  const calculateTotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );
  };

  const handlePayment = async () => {
    try {
      if (!login) {
        toast.error("Please login to continue");
        navigate("/login");
        return;
      }

      const total = calculateTotal();
      const items = cartItems.map((item) => ({
        product: item.product._id,
        quantity: item.quantity,
        price: item.product.price,
      }));

      const response = await orderApi.processPayment(total, items);
      if (response.redirectUrl) {
        // Lưu orderId vào sessionStorage trước khi redirect
        sessionStorage.setItem("pendingOrderId", response.orderId);
        window.location.href = response.redirectUrl;
      }
    } catch (error) {
      toast.error(error.message || "Payment failed");
    }
  };

  const handleViewHistory = () => {
    if (!login) {
      toast.error("Vui lòng đăng nhập để xem lịch sử đơn hàng");
      navigate("/login");
      return;
    }
    navigate("/orders");
  };
  const handleViewHistoryPayment = async () => {
    try {
      const res = await orderApi.getHistoryPayment();
      if (res.redirectUrl) {
        window.location.href = res.redirectUrl;
      }
    } catch (error) {}
  };
  return (
    <Box sx={{ display: "flex", minHeight: "100vh", width: "100%" }}>
      <Navigation />
      <Box
        sx={{
          flex: 1,
          backgroundColor: theme.palette.background.default,
          minHeight: "100vh",
          p: { xs: 2, md: 4 },
          background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
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
          <Box
            flex={2}
            component={Paper}
            sx={{
              p: 4,
              borderRadius: 4,
              boxShadow: theme.shadows[6],
              background: "linear-gradient(to right, #ffffff 0%, #f0f0f0 100%)",
            }}
          >
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
              <Box display="flex" alignItems="center" gap={2}>
                <Typography variant="subtitle1" color="text.secondary">
                  {cartItems.length} Sản Phẩm
                </Typography>
                {cartItems.length > 0 && (
                  <Button
                    variant="contained"
                    color="error"
                    startIcon={<Delete />}
                    onClick={clearCart}
                  >
                    Xóa Tất Cả
                  </Button>
                )}
              </Box>
            </Box>
            <Divider sx={{ mb: 4 }} />

            {cartItems.length == 0 ? (
              <h1>Không có sản phẩm nào</h1>
            ) : (
              <>
                {cartItems.map((item, index) => (
                  <CartItemPaper
                    key={index}
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
                      <Link
                        to={`/product/${item.product._id}`}
                        style={{ textDecoration: "none" }}
                      >
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      </Link>
                    </Box>

                    <Box flex={1}>
                      <Typography
                        variant="h6"
                        fontWeight="bold"
                        color="primary"
                      >
                        {item.product.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {item.product.brand}
                      </Typography>
                      <Typography
                        variant="h6"
                        color="success.main"
                        fontWeight="bold"
                        mt={1}
                      >
                        {item.product.price.toLocaleString()} VND
                      </Typography>
                    </Box>

                    <Box display="flex" alignItems="center" gap={1}>
                      <Tooltip title="Giảm số lượng">
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() =>
                            updateQuantity(item.product._id, item.quantity - 1)
                          }
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
                          fontWeight: "bold",
                        }}
                      >
                        {item.quantity}
                      </Typography>
                      <Tooltip title="Tăng số lượng">
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() =>
                            updateQuantity(item.product._id, item.quantity + 1)
                          }
                        >
                          <Add />
                        </IconButton>
                      </Tooltip>
                    </Box>

                    <Box display="flex" ml={2}>
                      <Tooltip title="Xóa sản phẩm">
                        <IconButton
                          color="error"
                          onClick={() => removeItem(item.product._id)}
                        >
                          <Delete />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </CartItemPaper>
                ))}
              </>
            )}
          </Box>

          <Box
            flex={1}
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 3,
              position: "sticky",
              top: 20,
              alignSelf: "flex-start",
            }}
          >
            <Box
              component={Paper}
              sx={{
                p: 4,
                borderRadius: 4,
                boxShadow: theme.shadows[6],
                background:
                  "linear-gradient(to right, #ffffff 0%, #e0e0e0 100%)",
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
                onClick={handlePayment}
              >
                Tiến Hành Thanh Toán
              </GradientButton>
            </Box>

            <Box
              component={Paper}
              sx={{
                p: 4,
                borderRadius: 4,
                boxShadow: theme.shadows[6],
                background:
                  "linear-gradient(to right, #ffffff 0%, #e0e0e0 100%)",
              }}
            >
              <Typography variant="h5" fontWeight="bold" mb={3} color="primary">
                Đơn Hàng Của Bạn
              </Typography>
              <Divider sx={{ mb: 3 }} />

              <Button
                fullWidth
                startIcon={<History />}
                sx={{
                  background:
                    "linear-gradient(45deg, #4CAF50 30%, #81C784 90%)",
                  color: "white",
                  height: 48,
                  borderRadius: 2,
                  boxShadow: "0 3px 5px 2px rgba(76, 175, 80, .3)",
                  "&:hover": {
                    background:
                      "linear-gradient(45deg, #388E3C 30%, #66BB6A 90%)",
                    transform: "scale(1.02)",
                    boxShadow: "0 5px 15px rgba(76, 175, 80, .4)",
                  },
                }}
                onClick={handleViewHistory}
              >
                Xem Lịch Sử Đơn Hàng
              </Button>
            </Box>

            <Box
              component={Paper}
              sx={{
                p: 4,
                borderRadius: 4,
                boxShadow: theme.shadows[6],
                background:
                  "linear-gradient(to right, #ffffff 0%, #e0e0e0 100%)",
              }}
            >
              <Typography variant="h5" fontWeight="bold" mb={3} color="primary">
                Đơn Hàng Của Bạn
              </Typography>
              <Divider sx={{ mb: 3 }} />

              <Button
                fullWidth
                startIcon={<History />}
                sx={{
                  background:
                    "linear-gradient(45deg, #4CAF50 30%, #81C784 90%)",
                  color: "white",
                  height: 48,
                  borderRadius: 2,
                  boxShadow: "0 3px 5px 2px rgba(76, 175, 80, .3)",
                  "&:hover": {
                    background:
                      "linear-gradient(45deg, #388E3C 30%, #66BB6A 90%)",
                    transform: "scale(1.02)",
                    boxShadow: "0 5px 15px rgba(76, 175, 80, .4)",
                  },
                }}
                onClick={handleViewHistoryPayment}
              >
                Xem Lịch Sử Thanh Toán
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Cart;
