import React, { useState } from "react";
import { Container, Box, Typography, Button, Stack } from "@mui/material";
import { ArrowForward as ArrowIcon } from "@mui/icons-material";

import TopSlider from "./Products/TopSlider";
import WatchCard from "./Products/WatchCard";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { Loader } from "lucide-react";
import productApi from "../service/api/productsApi";
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
    // setFavorites((prev) =>
    //   prev.some((fav) => fav.id === watch.id)
    //     ? prev.filter((fav) => fav.id !== watch.id)
    //     : [...prev, watch]
    // );
  };
  // function setCookie(name, value, days) {
  //   const date = new Date();
  //   date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  //   const expires = "expires=" + date.toUTCString();
  //   document.cookie = name + "=" + value + ";" + expires + ";path=/";
  // }
  // setCookie("jwt", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NzVhZWE0N2ViYWJiOGYyYTdlNzkwMDQiLCJpYXQiOjE3MzQwNTY1NDYsImV4cCI6MTczNjY0ODU0Nn0.-sY_bNeWcJvwlOc0ISu6n9Fu21s3mhuHao5PGQI2Ujg", 7);
  // Ví dụ: Lưu cookie

  const handleAddToCart = (watch) => {
    // setCart((prev) => [...prev, watch]);
    // setCookie("jwt", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NzVhZWE0N2ViYWJiOGYyYTdlNzkwMDQiLCJpYXQiOjE3MzQwNTY1NDYsImV4cCI6MTczNjY0ODU0Nn0.-sY_bNeWcJvwlOc0ISu6n9Fu21s3mhuHao5PGQI2Ujg", 7);
  };

  return (
    <Box sx={{ backgroundColor: "#f4f4f4", minHeight: "100vh" }}>
      {/* <Header 
      /> */}

      <Container maxWidth="xl" sx={{ py: 4 }}>
        <TopSlider
          onAddToCart={handleAddToCart}
          onAddToFavorites={handleAddToFavorites}
        />

        <Box sx={{ my: 6, textAlign: "center" }}>
          <Typography variant="h4" gutterBottom>
            Bộ Sưu Tập Nổi Bật
          </Typography>
        </Box>

        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={3}
          justifyContent="center"
          alignItems="stretch"
          sx={{
            flexWrap: "wrap",
            gap: 4,
          }}
        >
          {loading ? (
            <Loader />
          ) : (
            featureProducts.map((watch) => (
              <Box
                key={watch._id}
                sx={{
                  width: {
                    xs: "100%",
                    sm: "calc(50% - 24px)",
                    md: "calc(33.33% - 24px)",
                  },
                  minWidth: 300,
                  maxWidth: 400,
                }}
              >
                <WatchCard
                  watch={watch}
                  onAddToCart={handleAddToCart}
                  onAddToFavorites={handleAddToFavorites}
                />
              </Box>
            ))
          )}
        </Stack>

        {/* Shop Collection Button */}
        <Box sx={{ textAlign: "center", my: 6 }}>
          <Button variant="contained" size="large" endIcon={<ArrowIcon />}>
            Khám Phá Bộ Sưu Tập
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default HomePage;
