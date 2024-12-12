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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  LinearProgress,
} from "@mui/material";
import { useParams } from "react-router";
import { StarRounded, StarOutlineRounded } from "@mui/icons-material";
import SimilarProducts from "./SimilarProducts";
import productApi from "../../service/api/productsApi";
import ImageGallery from "./ImageGallery";
import RatingProduct from "./RatingProduct.jsx";
import ReviewProduct from "./ReviewsProduct.jsx"
const WatchProductPage = () => {
  const { id: productId } = useParams();
  const [quantity, setQuantity] = useState(1);
  const watchDetails = {
    name: "Đồng Hồ Luxury Classic",
    brand: "TimeMaster",
    price: 2999000,
    originalPrice: 3499000,
    description:
      "Chiếc đồng hồ sang trọng với thiết kế tinh tế, phù hợp cho những doanh nhân đẳng cấp. Máy Nhật Bản, chống nước 50m.",
    features: [
      "Máy Nhật Bản chính hãng",
      "Dây da cao cấp",
      "Chống nước 50m",
      "Mặt kính Sapphire chống xước",
    ],
  };
  const [reviews, setReviews] = useState([
    {
      name: "Nguyễn Văn A",
      ratings: {
        comment: "HELllo anh em ơi",
        rating: 4
      },
      date: "2 tháng trước",
      comment: "Đồng hồ rất đẹp, chất lượng tốt, giao hàng nhanh.",
    },
    {
      name: "Trần Thị B",
      ratings: {
        comment: "HELllo anh em ơi",
        rating: 2
      },
      date: "1 tháng trước",
      comment: "Thiết kế sang trọng, phù hợp đi làm và sự kiện.",
    },
    {
      name: "Trần Thị B",
      ratings: {
        comment: "HELllo anh em ơi",
        rating: 2
      },
      date: "1 tháng trước",
      comment: "Thiết kế sang trọng, phù hợp đi làm và sự kiện.",
    },
  ]);
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
      image: "https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/1/8/18_2_117_1_1_1.jpg",
    },
    {
      id: 4,
      name: "Đồng Hồ Thời Thượng",
      price: 1.799,
      rating: 4.0,
      image: "https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/1/8/18_2_117_1_1_1.jpg",
    },
    {
      id: 5,
      name: "Đồng Hồ Vintage",
      price: 2.699,
      rating: 4.6,
      image: "https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/1/5/15_3_128_1_2_2.jpg",
    },
  ];


  const listImg = [
    "https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/1/5/15_3_128_1_2_2.jpg",
    "https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/1/8/18_2_117_1_1_1.jpg",
    "https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/1/7/17_2_111_1_1_1.jpg",
    "https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/1/9/19_2_114_1_1_1.jpg",
    "https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/1/5/15_3_128_1_2_2.jpg",
    "https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/1/8/18_2_117_1_1_1.jpg",
    "https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/1/7/17_2_111_1_1_1.jpg",
    "https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/1/9/19_2_114_1_1_1.jpg",
  ];

  return (
    <div className="container mx-auto p-4 bg-gray-50">
      <div className="grid md:grid-cols-2 gap-8">
        <ImageGallery images={listImg}/>

        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-gray-800">
            {watchDetails.name}
          </h1>

          <Typography variant="body2" color="text.secondary">
            Thương hiệu: <strong>{watchDetails.brand}</strong>
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
              (2 nhận xét)
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
              {watchDetails.originalPrice.toLocaleString()} VNĐ
            </Typography>
            <Typography variant="h4" color="error.main" fontWeight="bold">
              {watchDetails.price.toLocaleString()} VNĐ
            </Typography>
          </Box>

          <Typography variant="body1" color="text.secondary">
            {watchDetails.description}
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
              <Typography variant="body1">{quantity}</Typography>
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
            >
              Thêm vào giỏ
            </Button>
            <Button color="error">
              <HeartIcon />
            </Button>
          </Box>

          <Card variant="outlined">
            <CardHeader title="Đặc điểm nổi bật" />
            <Divider />
            <CardContent>
              <ul className="list-disc list-inside text-gray-700">
                {watchDetails.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
      <RatingProduct reviews={reviews} />

      <ReviewProduct reviews={reviews} setReviews={setReviews} />

      <SimilarProducts similarProducts={similarProducts} />
    </div>
  );
};

export default WatchProductPage;
