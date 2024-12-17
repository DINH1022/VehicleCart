import React, { useState } from "react";
import { Container, Box, Typography, Button, Stack } from "@mui/material";
import { ArrowForward as ArrowIcon } from "@mui/icons-material";

import TopSlider from "./Products/TopSlider";
import WatchCard from "./Products/WatchCard";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { Loader } from "lucide-react";
import Navigation from "./Auth/Navigation";
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
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Navigation />
      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1,
          backgroundColor: "#f4f4f4",
          minHeight: '100vh',
          overflow: 'auto'
        }}
      >
        <Container 
          maxWidth="xl" 
          sx={{ 
            py: 4,
            px: { xs: 2, sm: 4 },
            mt: { xs: 2, sm: 4 }
          }}
        >
          <TopSlider
            onAddToCart={handleAddToCart}
            onAddToFavorites={handleAddToFavorites}
            sx={{ mb: 6 }}
          />

          <Box sx={{ 
            my: 6, 
            textAlign: "center",
            '& h4': {
              fontWeight: 600,
              color: '#1a237e'
            }
          }}>
            <Typography variant="h4" gutterBottom>
              Bộ Sưu Tập Nổi Bật
            </Typography>
          </Box>

          <Stack
            direction="row"
            sx={{
              flexWrap: "wrap",
              gap: 4,
              justifyContent: "center",
              alignItems: "stretch",
              mb: 6
            }}
          >
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%', py: 4 }}>
                <Loader size={40} />
              </Box>
            ) : (
              featureProducts.map((watch) => (
                <Box
                  key={watch._id}
                  sx={{
                    width: {
                      xs: '100%',
                      sm: 'calc(50% - 16px)',
                      md: 'calc(33.33% - 16px)',
                      lg: 'calc(25% - 16px)',
                    },
                    minWidth: { xs: '280px', sm: '300px' },
                    maxWidth: '400px'
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

          <Box sx={{ 
            textAlign: "center", 
            my: 6,
            '& button': {
              backgroundColor: '#1a237e',
              '&:hover': {
                backgroundColor: '#000051'
              }
            }
          }}>
            <Button 
              variant="contained" 
              size="large" 
              endIcon={<ArrowIcon />}
              sx={{ 
                px: 4, 
                py: 1.5,
                borderRadius: 2
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
