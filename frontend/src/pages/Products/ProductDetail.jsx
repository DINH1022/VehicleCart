import React, { useState, useEffect } from "react";
import { ShoppingCart, HeartIcon } from "lucide-react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Rating,
  Typography,
} from "@mui/material";
import { useParams } from "react-router";
import { StarRounded, StarOutlineRounded } from "@mui/icons-material";
import SimilarProducts from "./SimilarProducts";
import productApi from "../../service/api/productsApi";
import ImageGallery from "./ImageGallery";
import RatingProduct from "./RatingProduct.jsx";
import ReviewProduct from "./ReviewsProduct.jsx";
import Loader from "../../components/Loader.jsx";
import HeartIconProduct from "./HeartIconProduct.jsx";
import cartApi from "../../service/api/cartRequest.js";
import showToast from "../../components/ShowToast.jsx";
import Navigation from "../Auth/Navigation";

const ProductDetail = () => {
  const [quantity, setQuantity] = useState(1);
  const [product, setProducts] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id: productId } = useParams();
  const [reviews, setReviews] = useState();
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await productApi.getReviewProduct(productId);
        setReviews(response.reviews);
      } catch (err) {
        console.error("Lỗi khi tải nhận xét:", err);
      }
    };
    fetchReviews();
  }, []);
  // const [reviews, setReviews] = useState(product.reviews)
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await productApi.getProductById(productId);
        setProducts(response);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };
    fetchProduct();
  }, []);
  const handleAddToCart = async () => {
    try {
      await cartApi.addToCart(productId, quantity);
      showToast("Thêm vào giỏ hàng thành công", "success");
    } catch (error) {
      showToast("Thất bại !!!", "error");
    }
  };
  const similarProducts = [
    {
      id: 1,
      name: "Đồng Hồ Elegance",
      price: 2.499,
      rating: 4.5,
      image: "/api/placeholder/150/150",
    },
    {
      id: 2,
      name: "Đồng Hồ Sporty",
      price: 1.999,
      rating: 4.2,
      image: "/api/placeholder/150/150",
    },
    {
      id: 3,
      name: "Đồng Hồ Cổ Điển",
      price: 3.299,
      rating: 4.8,
      image:
        "https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/1/8/18_2_117_1_1_1.jpg",
    },
    {
      id: 4,
      name: "Đồng Hồ Thời Thượng",
      price: 1.799,
      rating: 4.0,
      image:
        "https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/1/8/18_2_117_1_1_1.jpg",
    },
    {
      id: 5,
      name: "Đồng Hồ Vintage",
      price: 2.699,
      rating: 4.6,
      image:
        "https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/1/5/15_3_128_1_2_2.jpg",
    },
  ];

  return (
    <Box sx={{ display: "flex" }}>
      <Navigation />
      <Box component="main" sx={{ flexGrow: 1 }}>
        {loading ? (
          <Loader />
        ) : (
          <div className="container mx-auto p-4 bg-gray-50">
            <div className="grid md:grid-cols-2 gap-8">
              <ImageGallery images={[product.image, ...product.listImage]} />

              <div className="space-y-4">
                <h1 className="text-3xl font-bold text-gray-800">
                  {product.name}
                </h1>

                <Typography variant="body2" color="text.secondary">
                  Thương hiệu: <strong>{product.brand}</strong>
                </Typography>

                <Box display="flex" alignItems="center" gap={2}>
                  <Rating
                    name="rounded-stars-rating"
                    defaultValue={2.4}
                    precision={0.1}
                    readOnly
                    icon={<StarRounded fontSize="inherit" />}
                    emptyIcon={<StarOutlineRounded fontSize="inherit" />}
                  />
                  <Typography variant="body1" color="text.secondary">
                    {product.reviews.length} Nhận xét
                  </Typography>
                </Box>

                <Box display="flex" flexDirection="column">
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      textDecoration: "line-through",
                      fontSize: "0.9rem",
                    }}
                  >
                    {product.originalPrice.toLocaleString()} VNĐ
                  </Typography>
                  <Typography variant="h4" color="error.main" fontWeight="bold">
                    {product.price.toLocaleString()} VNĐ
                  </Typography>
                </Box>

                <Typography variant="body1" color="text.secondary">
                  {product.description}
                </Typography>

                <Box display="flex" alignItems="center" gap={4}>
                  <Box display="flex" alignItems="center" gap={2}>
                    <Button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      variant="contained"
                      color="inherit"
                      size="small"
                    >
                      -
                    </Button>
                    <Typography variant="body1" sx={{ color: "black" }}>
                      {quantity}
                    </Typography>

                    <Button
                      onClick={() => setQuantity(quantity + 1)}
                      variant="contained"
                      color="inherit"
                      size="small"
                    >
                      +
                    </Button>
                  </Box>
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<ShoppingCart />}
                    onClick={handleAddToCart}
                  >
                    Thêm vào giỏ
                  </Button>

                  <HeartIconProduct product={product} />
                </Box>

                <Card variant="outlined">
                  <CardHeader title="Đặc điểm nổi bật" />
                  <Divider />
                  <CardContent>
                    <ul className="list-disc list-inside text-gray-700">
                      {product.features.map((feature, index) => (
                        <li key={index}>{feature}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>

            <RatingProduct reviews={reviews} />
            <ReviewProduct reviews={reviews} setReviews={setReviews} productId={productId} />
            <SimilarProducts similarProducts={similarProducts} />
          </div>
        )}
      </Box>
    </Box>
  );
};

export default ProductDetail;