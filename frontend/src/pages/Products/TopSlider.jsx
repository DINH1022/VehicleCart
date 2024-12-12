import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import {
  Box,
  Typography,
  Button,
  Rating,
  Stack,
  useTheme,
} from "@mui/material";
import {
  Favorite as FavoriteIcon,
  ShoppingCart as CartIcon,
  ArrowBackIos as PrevIcon,
  ArrowForwardIos as NextIcon,
} from "@mui/icons-material";
import { Loader } from "lucide-react";
import productApi from "../../service/api/productsApi";
const TopSlider = ({ onAddToCart, onAddToFavorites }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await productApi.getTopProducts();
        setProducts(response);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);
  let sliderRef = React.createRef();

  const settings = {
    dots: true,
    infinite: true,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    cssEase: "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
    beforeChange: (current, next) => setCurrentSlide(next),
    appendDots: (dots) => (
      <Box
        component="ul"
        sx={{
          bottom: "30px",
          position: "absolute",
          width: "100%",
          display: "flex",
          justifyContent: "center",
          "& li": {
            margin: "0 8px",
            transition: "all 0.3s ease",
          },
          "& li button:before": {
            color: "rgba(0,0,0,0.5)",
            fontSize: "12px",
            transition: "all 0.3s ease",
          },
          "& li.slick-active button:before": {
            color: "black",
            transform: "scale(1.5)",
          },
        }}
      >
        {dots}
      </Box>
    ),
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <Box
          sx={{
            position: "relative",
            background: "linear-gradient(to right, #f5f7fa, #f5f7fa)",
            height: "600px",
            overflow: "hidden",
            boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
            borderRadius: "12px",
            "& .slick-slide": {
              height: "auto !important",
            },
          }}
        >
          <Slider ref={(slider) => (sliderRef = slider)} {...settings}>
            {products.map((watch, index) => (
              <Box
                key={index}
                sx={{
                  display: "flex !important",
                  alignItems: "center",
                  height: "600px !important",
                  position: "relative",
                  overflow: "hidden",

                  p: 12,
                  opacity: currentSlide === index ? 1 : 0.7,
                  transition: "opacity 0.5s ease",
                }}
              >
                <Box
                  sx={{
                    width: "60%",
                    pr: 4,
                    zIndex: 5,
                    position: "relative",
                    transform:
                      currentSlide === index
                        ? "translateX(0)"
                        : "translateX(-50px)",
                    opacity: currentSlide === index ? 1 : 0.5,
                    transition: "all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                  }}
                >
                  <Typography
                    variant="h2"
                    sx={{
                      color: "#333",
                      textShadow: "1px 1px 2px rgba(0,0,0,0.1)",
                      mb: 2,
                      fontWeight: "bold",
                    }}
                  >
                    {watch.name}
                  </Typography>
                  <Typography
                    variant="h5"
                    sx={{
                      color: "#666",
                      mb: 3,
                    }}
                  >
                    {watch.brand}
                  </Typography>

                  <Stack
                    direction="row"
                    alignItems="center"
                    spacing={2}
                    sx={{ my: 3 }}
                  >
                    <Typography
                      variant="h4"
                      sx={{
                        color: "#d32f2f",
                        fontWeight: "bold",
                      }}
                    >
                      {watch.price.toLocaleString()} VND
                    </Typography>
                    <Rating
                      name="read-only"
                      value={watch.rating}
                      precision={0.5}
                      readOnly
                    />
                  </Stack>

                  <Stack direction="row" spacing={2}>
                    <Button
                      variant="contained"
                      startIcon={<CartIcon />}
                      onClick={() => onAddToCart(watch)}
                      sx={{
                        background: "linear-gradient(45deg, #2196f3, #21cbf3)",
                        transition: "all 0.3s ease",
                        "&:hover": {
                          transform: "scale(1.05)",
                          boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
                        },
                      }}
                      size="large"
                    >
                      Mua Ngay
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<FavoriteIcon />}
                      onClick={() => onAddToFavorites(watch)}
                      sx={{
                        color: "#2196f3",
                        borderColor: "#2196f3",
                        transition: "all 0.3s ease",
                        "&:hover": {
                          backgroundColor: "rgba(33,156,243,0.1)",
                        },
                      }}
                      size="large"
                    >
                      Yêu Thích
                    </Button>
                  </Stack>
                </Box>

                <Box
                  sx={{
                    width: "50%",
                    display: "flex",
                    justifyContent: "center",
                    position: "relative",
                    zIndex: 5,
                    transform:
                      currentSlide === index
                        ? "translateX(0)"
                        : "translateX(50px)",
                    opacity: currentSlide === index ? 1 : 0.5,
                    transition: "all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                  }}
                >
                  <img
                    src={watch.image}
                    alt={watch.name}
                    style={{
                      width: "450px",
                      height: "450px",
                      objectFit: "cover",
                      filter: "drop-shadow(0 10px 15px rgba(0,0,0,0.1))",
                      transform: "scale(1.1)",
                      transition: "all 0.5s ease",
                    }}
                  />
                </Box>
              </Box>
            ))}
          </Slider>

          {/* Custom Previous Button */}
          <Button
            onClick={() => sliderRef.slickPrev()}
            sx={{
              position: "absolute",
              top: "50%",
              left: "20px",
              transform: "translateY(-50%)",
              zIndex: 10,
              backgroundColor: "rgba(255,255,255,0.7)",
              borderRadius: "50%",
              width: "50px",
              height: "50px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
              "&:hover": {
                backgroundColor: "rgba(255,255,255,0.9)",
              },
            }}
          >
            <PrevIcon sx={{ color: "#333", fontSize: 24 }} />
          </Button>

          <Button
            onClick={() => sliderRef.slickNext()}
            sx={{
              position: "absolute",
              top: "50%",
              right: "20px",
              transform: "translateY(-50%)",
              zIndex: 10,
              backgroundColor: "rgba(255,255,255,0.7)",
              borderRadius: "50%",
              width: "50px",
              height: "50px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
              "&:hover": {
                backgroundColor: "rgba(255,255,255,0.9)",
              },
            }}
          >
            <NextIcon sx={{ color: "#333", fontSize: 24 }} />
          </Button>
        </Box>
      )}
    </>
  );
};

export default TopSlider;
