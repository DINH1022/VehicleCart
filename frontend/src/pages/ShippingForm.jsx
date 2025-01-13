import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Container,
  Stack,
} from "@mui/material";

const ShippingForm = ({ formData, setFormData, handlePayment, setShipping }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handlePayment();
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "grey.50",
        display: "flex",
        alignItems: "center",
        py: 4,
      }}
    >
      <Container maxWidth="md">
        <Card elevation={3}>
          <CardContent>
            <Typography
              variant="h4"
              component="h2"
              align="center"
              gutterBottom
              sx={{ fontWeight: "bold", color: "text.primary", mb: 4 }}
            >
              Thông Tin Giao Hàng
            </Typography>

            <Box component="form" onSubmit={handleSubmit}>
              <Stack spacing={3}>
                <TextField
                  fullWidth
                  id="phone"
                  name="phone"
                  label="Số điện thoại"
                  type="tel"
                  placeholder="Nhập số điện thoại"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />

                <Box>
                  <Typography
                    variant="h6"
                    component="h3"
                    sx={{ mb: 2, color: "text.secondary" }}
                  >
                    Địa chỉ giao hàng
                  </Typography>

                  <Stack spacing={2}>
                    <TextField
                      fullWidth
                      id="street"
                      name="street"
                      label="Số nhà, tên đường"
                      placeholder="Số nhà, tên đường"
                      value={formData.street}
                      onChange={handleChange}
                      required
                    />

                    <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                      <TextField
                        fullWidth
                        id="city"
                        name="city"
                        label="Phường/Xã/Thị trấn"
                        placeholder="Phường/Xã/Thị trấn"
                        value={formData.city}
                        onChange={handleChange}
                        required
                      />

                      <TextField
                        fullWidth
                        id="state"
                        name="state"
                        label="Quận/Huyện/Thành phố"
                        placeholder="Quận/Huyện/Thành phố"
                        value={formData.state}
                        onChange={handleChange}
                        required
                      />
                    </Stack>

                    <TextField
                      fullWidth
                      id="country"
                      name="country"
                      label="Tỉnh/Thành phố"
                      placeholder="Thành phố"
                      value={formData.country}
                      onChange={handleChange}
                      required
                    />
                  </Stack>
                </Box>

                <TextField
                  fullWidth
                  id="note"
                  name="note"
                  label="Ghi chú cho chủ shop"
                  placeholder="Nhập ghi chú cho chủ shop (nếu có)"
                  value={formData.note}
                  onChange={handleChange}
                  multiline
                  rows={4}
                />

                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  sx={{
                    mt: 2,
                    bgcolor: "primary.main",
                    "&:hover": {
                      bgcolor: "primary.dark",
                    },
                  }}
                >
                  Xác nhận và Thanh toán
                </Button>

                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  onClick={() => setShipping(false)}
                  sx={{
                    mt: 2,
                    bgcolor: "#d32f2f",
                    "&:hover": {
                      bgcolor: "#d32f2f",
                    },
                  }}
                >
                  Quay lại
                </Button>
              </Stack>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default ShippingForm;
