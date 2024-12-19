import React, { useState, useEffect } from "react";
import { Container, Box, Typography, Button, Stack } from "@mui/material";
import { ArrowForward as ArrowIcon } from "@mui/icons-material";
import { ChevronLeft, ChevronRight, Loader } from "lucide-react";
import WatchCard from "./WatchCard";

const ListProduct = ({ products, title, handleAddToFavorites, handleAddToCart }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const productsPerPage = 5;
  const totalPages = Math.ceil(products.length / productsPerPage);

  const handleNext = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages);
  };

  const handlePrev = () => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
  };
  const getCurrentProducts = () => {
    const start = currentPage * productsPerPage;
    return products.slice(start, start + productsPerPage);
  };

  return (
    <>
      <Box
        sx={{
          my: 6,
          textAlign: "center",
          "& h4": {
            fontWeight: 600,
            color: "#1a237e",
            margin: "0 auto"
          },
        }}
      >
        <Typography variant="h4" gutterBottom>
          {title}
        </Typography>
      </Box>

      <Box sx={{ position: "relative", my: 4 }}>
        <Button
          sx={{
            position: "absolute",
            left: -20,
            top: "50%",
            transform: "translateY(-50%)",
            minWidth: 40,
            width: 40,
            height: 40,
            borderRadius: "50%",
            backgroundColor: "white",
            boxShadow: 2,
            "&:hover": {
              backgroundColor: "#f5f5f5",
            },
            zIndex: 2,
          }}
          onClick={handlePrev}
        >
          <ChevronLeft />
        </Button>

        <Box
          sx={{
            display: "flex",
            gap: 2,
            transition: "transform 0.3s ease",
            transform: `translateX(-${currentPage * 100}%)`,
            mx: 2,
          }}
        >
          {getCurrentProducts().map((watch) => (
            <Box
              key={watch._id}
              sx={{
                flex: "0 0 calc(20% - 16px)",
                minWidth: "200px",
                maxWidth: "300px",
                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                borderRadius: "8px",
                backgroundColor: "#ffffff",
                overflow: "hidden",
                transition: "transform 0.3s, box-shadow 0.3s",
                "&:hover": {
                  transform: "translateY(-5px)",
                  boxShadow: "0px 6px 15px rgba(0, 0, 0, 0.15)",
                },
              }}
            >
              <WatchCard
                watch={watch}
                onAddToCart={handleAddToCart}
                onAddToFavorites={handleAddToFavorites}
                sx={{
                  "& .watch-title": {
                    fontSize: "1rem",
                    fontWeight: 600,
                    color: "#333",
                  },
                  "& .watch-price": {
                    fontSize: "0.875rem",
                    color: "#666",
                  },
                }}
              />
            </Box>
          ))}
        </Box>

        <Button
          sx={{
            position: "absolute",
            right: -20,
            top: "50%",
            transform: "translateY(-50%)",
            minWidth: 40,
            width: 40,
            height: 40,
            borderRadius: "50%",
            backgroundColor: "white",
            boxShadow: 2,
            "&:hover": {
              backgroundColor: "#f5f5f5",
            },
            zIndex: 2,
          }}
          onClick={handleNext}
        >
          <ChevronRight />
        </Button>

        <Stack
          direction="row"
          spacing={1}
          justifyContent="center"
          sx={{ mt: 3 }}
        >
          {Array.from({ length: totalPages }).map((_, index) => (
            <Box
              key={index}
              sx={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                backgroundColor: currentPage === index ? "#1a237e" : "#e0e0e0",
                cursor: "pointer",
                transition: "background-color 0.3s ease",
              }}
              onClick={() => setCurrentPage(index)}
            />
          ))}
        </Stack>
      </Box>
    </>
  );
};
export default ListProduct;
