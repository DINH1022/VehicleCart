
import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Rating,
  Typography,
  LinearProgress,
} from "@mui/material";
import { StarRounded, StarOutlineRounded } from "@mui/icons-material";

const RatingProduct = ({ reviews = [] }) => {
  const calculateRatingStats = () => {
    const totalReviews = reviews.length;
    const ratingCounts = {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
    };

    reviews.forEach((review) => {
      ratingCounts[review.ratings.rating]++;
    });

    const averageRating =
      reviews.reduce((sum, review) => sum + review.ratings.rating, 0) /
      totalReviews;

    return {
      totalReviews,
      ratingCounts,
      averageRating,
    };
  };

  const ratingStats = calculateRatingStats();

  return (
    <Card variant="outlined" sx={{ mt: 4 }}>
      <CardHeader title="Thống kê đánh giá" />
      <Divider />
      <CardContent>
        <Box display="flex" alignItems="center" gap={4}>
          <Box textAlign="center">
            <Typography variant="h4" color="primary">
              {ratingStats.averageRating.toFixed(1)}
            </Typography>
            <Rating
              name="rounded-stars-rating"
              defaultValue={ratingStats.averageRating} 
              precision={0.1} 
              readOnly
              icon={<StarRounded fontSize="inherit" />} 
              emptyIcon={<StarOutlineRounded fontSize="inherit" />}
            />
            <Typography variant="body2" color="text.secondary">
              {ratingStats.totalReviews} đánh giá
            </Typography>
          </Box>
          <Box flexGrow={1}>
            {[5, 4, 3, 2, 1].map((star) => (
              <Box key={star} display="flex" alignItems="center" gap={2} mb={1}>
                <Typography variant="body2">{star} sao</Typography>
                <LinearProgress
                  variant="determinate"
                  value={
                    (ratingStats.ratingCounts[star] /
                      ratingStats.totalReviews) *
                    100
                  }
                  sx={{ flexGrow: 1, height: 10, borderRadius: 5 }}
                />
                <Typography variant="body2" color="text.secondary">
                  {ratingStats.ratingCounts[star]}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};
export default RatingProduct;
