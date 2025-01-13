import React, { useState, useEffect } from "react";
import { Container, Box, Typography, Button, Stack } from "@mui/material";
import { ArrowForward as ArrowIcon } from "@mui/icons-material";
import ImageSlider from "./ImageSlider";
import Navigation from "../Auth/Navigation";
import productApi from "../../service/api/productsApi";
import usersApi from "../../service/api/usersApi"; // Add this import
import cartApi from "../../service/api/cartRequest"; // Add this import
import ProductSlider from "./ProductSlider";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Loader from "../../components/Loader";

const HomePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [newProducts, setNewProducts] = useState([]);
  const [topRatedProducts, setTopRatedProducts] = useState([]);
  const [topSellingProducts, setTopSellingProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        const [newProds, topRated, topSelling] = await Promise.all([
          productApi.getNewProducts(),
          productApi.getTopRatingProducts(),
          productApi.getTopSellingProducts(),
        ]);

        setNewProducts(newProds);
        setTopRatedProducts(topRated);
        setTopSellingProducts(topSelling);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };
    fetchAllProducts();
  }, []);

  useEffect(() => {
    const handleFacebookLogin = async () => {
      const params = new URLSearchParams(location.search);
      const code = params.get('code');
      
      if (code) {
        try {
          console.log("Attempting Facebook login with code:", code);
          const response = await usersApi.facebookLogin(code);
          console.log("Facebook login response:", response);
          
          if (response) {
            sessionStorage.setItem("userData", JSON.stringify(response));
            const cartData = sessionStorage.getItem("carts");
            if (cartData) {
              const carts = JSON.parse(cartData);
              await cartApi.addItemsToCart(carts);
              sessionStorage.removeItem("carts");
            }
            // Clear the URL parameters
            window.history.replaceState({}, document.title, "/");
            // Optionally show success message
            console.log("Login successful");
          }
        } catch (error) {
          console.error("Facebook login error:", error);
          // Optionally show error message to user
          alert("Facebook login failed. Please try again.");
        }
      }
    };

    handleFacebookLogin();
  }, [location]);

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <Navigation />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          backgroundColor: "#f4f4f4",
          minHeight: "100vh",
          overflow: "hidden",
        }}
      >
        <Container
          maxWidth="xl"
          sx={{ py: 4, px: { xs: 2, sm: 4 }, mt: { xs: 2, sm: 4 } }}
        >
          <ImageSlider sx={{ mb: 6 }} />

          {loading ? (
            <Loader />
          ) : (
            <>
              <ProductSlider
                products={topSellingProducts}
                title="Sản phẩm bán chạy nhất"
              />

              <ProductSlider
                products={topRatedProducts}
                title="Sản phẩm đánh giá cao"
              />

              <ProductSlider products={newProducts} title="Sản phẩm mới" />
            </>
          )}

          <Box sx={{ textAlign: "center", my: 6 }}>
            <Link to="/products" style={{ textDecoration: "none" }}>
              <Button
                variant="contained"
                size="large"
                endIcon={<ArrowIcon />}
                sx={{
                  px: 4,
                  py: 1.5,
                  borderRadius: 2,
                  backgroundColor: "#1a237e",
                  "&:hover": {
                    backgroundColor: "#000051",
                  },
                }}
              >
                Khám Phá Bộ Sưu Tập
              </Button>
            </Link>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage;



