import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { useLocation } from "react-router-dom";
import Navigation from "../Auth/Navigation";
import orderApi from "../../service/api/orderApi";
import { toast } from "react-toastify";
import cartApi from "../../service/api/cartRequest";

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const location = useLocation();
  const [login, setLogin] = useState(!!sessionStorage.getItem("userData"));
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const params = new URLSearchParams(location.search);
        if (params.get("success")) {
          const pendingOrderId = sessionStorage.getItem("pendingOrderId");
          if (pendingOrderId) {
            try {
              // Cập nhật trạng thái đơn hàng
              await orderApi.updatePaymentStatus(pendingOrderId, "completed");
              // xóa giỏ hàng
              await cartApi.clearCart();
              toast.success("Thanh toán thành công!");
            } catch (error) {
              console.error("Error updating order status:", error);
            } finally {
              // Luôn xóa pendingOrderId khỏi session storage
              sessionStorage.removeItem("pendingOrderId");
            }
          }
        }

        // lấy danh sách orders mới nhất
        const data = await orderApi.getOrders();
        setOrders(data);
      } catch (error) {
        toast.error("Không thể tải lịch sử đơn hàng");
      }
    };
    fetchOrders();
  }, [location]);

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "success";
      case "pending":
        return "warning";
      case "failed":
        return "error";
      default:
        return "default";
    }
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <Navigation />
      <Box sx={{ flexGrow: 1, p: 3 }}>
        <Typography variant="h4" gutterBottom color="black">
          Lịch sử đơn hàng
        </Typography>

        {orders.map((order) => (
          <Paper key={order._id} sx={{ mb: 3, p: 3 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
              }}
            >
              <Box>
                <Typography variant="h6">Mã đơn: {order._id}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {new Date(order.createdAt).toLocaleDateString("vi-VN")}
                </Typography>
              </Box>
              <Box sx={{ textAlign: "right" }}>
                <Chip
                  label={order.paymentStatus.toUpperCase()}
                  color={getStatusColor(order.paymentStatus)}
                  sx={{ mr: 1 }}
                />
                <Typography variant="h6" color="primary">
                  {order.totalAmount.toLocaleString()} VND
                </Typography>
              </Box>
            </Box>

            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Sản phẩm</TableCell>
                    <TableCell align="center">Số lượng</TableCell>
                    <TableCell align="right">Đơn giá</TableCell>
                    <TableCell align="right">Thành tiền</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {order.items.map((item) => (
                    <TableRow key={item.product._id}>
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            style={{ width: 50, height: 50, marginRight: 10 }}
                          />
                          {item.product.name}
                        </Box>
                      </TableCell>
                      <TableCell align="center">{item.quantity}</TableCell>
                      <TableCell align="right">
                        {item.price.toLocaleString()} VND
                      </TableCell>
                      <TableCell align="right">
                        {(item.price * item.quantity).toLocaleString()} VND
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        ))}
      </Box>
    </Box>
  );
};

export default OrderHistory;
