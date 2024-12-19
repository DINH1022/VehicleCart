import React, { useState, useEffect } from "react";
import { Container, Box, Typography, Button, Stack } from "@mui/material";
import { ArrowForward as ArrowIcon } from "@mui/icons-material";
import TopSlider from "./Products/TopSlider";
import Navigation from "./Auth/Navigation";
import productApi from "../service/api/productsApi";
import ListProduct from "./Products/ListProduct";

const HomePage = () => {
  const [featureProducts, setFeatureProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await productApi.getNewProducts();
        setFeatureProducts(response);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleAddToFavorites = (watch) => {
    // Original favorites logic
  };

  const handleAddToCart = (watch) => {
    // Original cart logic
  };

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
          sx={{
            py: 4,
            px: { xs: 2, sm: 4 },
            mt: { xs: 2, sm: 4 },
          }}
        >
          <TopSlider
            onAddToCart={handleAddToCart}
            onAddToFavorites={handleAddToFavorites}
            sx={{ mb: 6 }}
          />

          {loading ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                width: "100%",
                py: 4,
              }}
            ></Box>
          ) : (
            <>
              <ListProduct
                products={featureProducts}
                title="Sản phẩm bán chạy"
                handleAddToFavorites={handleAddToFavorites}
                handleAddToCart={handleAddToCart}
              />
            </>
          )}

          {loading ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                width: "100%",
                py: 4,
              }}
            ></Box>
          ) : (
            <>
              <ListProduct
                products={featureProducts}
                title="Hot Sale"
                handleAddToFavorites={handleAddToFavorites}
                handleAddToCart={handleAddToCart}
              />
            </>
          )}

          {loading ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                width: "100%",
                py: 4,
              }}
            ></Box>
          ) : (
            <>
              <ListProduct
                products={featureProducts}
                title="Sản phẩm mới"
                handleAddToFavorites={handleAddToFavorites}
                handleAddToCart={handleAddToCart}
              />
            </>
          )}
          <Box
            sx={{
              textAlign: "center",
              my: 6,
              "& button": {
                backgroundColor: "#1a237e",
                "&:hover": {
                  backgroundColor: "#000051",
                },
              },
            }}
          >
            <Button
              variant="contained"
              size="large"
              endIcon={<ArrowIcon />}
              sx={{
                px: 4,
                py: 1.5,
                borderRadius: 2,
              }}
            >
              Khám Phá Bộ Sưu Tập
            </Button>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage;
