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

const sliderImages = [
  "/assets/uploads/img1.png",
  "/assets/uploads/img2.png",
  "/assets/uploads/img3.png",
  "/assets/uploads/img4.png",
  "/assets/uploads/img5.png",

];

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
            height: "600px", // Fixed height for the container
            overflow: "hidden",
            boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
            borderRadius: "12px",
            "& .slick-slider, & .slick-list, & .slick-track": {
              height: "100%",
            },
            "& .slick-slide": {
              height: "600px",
              "& > div": {
                height: "100%",
              },
            },
          }}
        >
          <Slider ref={(slider) => (sliderRef = slider)} {...settings}>
            {sliderImages.map((imagePath, index) => (
              <Box
                key={index}
                sx={{
                  height: "100%",
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                }}
              >
                <img
                  src={imagePath}
                  alt={`Slide ${index + 1}`}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain", // Changed from cover to contain
                    objectPosition: "center",
                  }}
                />
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
