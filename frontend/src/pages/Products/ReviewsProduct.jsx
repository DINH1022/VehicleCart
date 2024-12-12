import React, { useState, useEffect } from "react";
import { Star, PenIcon } from "lucide-react";
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
} from "@mui/material";
import { StarRounded, StarOutlineRounded } from "@mui/icons-material";
const ReviewsProduct = ({ reviews = [], setReviews }) => {
  const [openReviewModal, setOpenReviewModal] = useState(false);
  const [newReview, setNewReview] = useState({
    name: "",
    rating: 0,
    comment: "",
  });

  const handleOpenReviewModal = () => {
    setOpenReviewModal(true);
  };

  const handleCloseReviewModal = () => {
    setOpenReviewModal(false);
    setNewReview({ name: "", rating: 0, comment: "" });
  };

  const handleSubmitReview = () => {
    if (newReview.name && newReview.rating > 0 && newReview.comment) {
      setReviews([
        ...reviews,
        {
          ...newReview,
          date: "Vừa xong",
        },
      ]);
      handleCloseReviewModal();
    }
  };
  return (
    <>
      {/* Phần nhận xét */}
      <Card variant="outlined" sx={{ mt: 4 }}>
        <CardHeader
          title="Nhận xét khách hàng"
          action={
            <Button
              variant="contained"
              color="primary"
              startIcon={<PenIcon />}
              onClick={handleOpenReviewModal}
            >
              Viết đánh giá
            </Button>
          }
        />
        <Divider />
        <CardContent>
          {reviews.map((review, index) => (
            <Box
              key={index}
              sx={{ borderBottom: "1px solid #e0e0e0", pb: 4, mb: 4 }}
            >
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Box display="flex" alignItems="center" gap={2}>
                  <Typography variant="body1" fontWeight="bold">
                    {review.name}
                  </Typography>
                  <Rating
                    name="rounded-stars-rating"
                    defaultValue={review.ratings.rating} // Giá trị mặc định
                    precision={0.1} // Hiển thị chi tiết
                    readOnly // Chỉ đọc
                    icon={<StarRounded fontSize="inherit" />} // Ngôi sao bo tròn đầy
                    emptyIcon={<StarOutlineRounded fontSize="inherit" />} // Ngôi sao bo tròn trống
                  />
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {review.date}
                </Typography>
              </Box>
              <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
                {review.ratings.comment}
              </Typography>
            </Box>
          ))}
          <Button variant="contained" color="inherit" fullWidth>
            Xem tất cả nhận xét
          </Button>
        </CardContent>
      </Card>

      {/* Modal viết đánh giá */}
      <Dialog
        open={openReviewModal}
        onClose={handleCloseReviewModal}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Viết đánh giá</DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
            <TextField
              label="Tên của bạn"
              fullWidth
              value={newReview.name}
              onChange={(e) =>
                setNewReview({ ...newReview, name: e.target.value })
              }
            />
            <Box display="flex" alignItems="center" gap={2}>
              <Typography>Đánh giá:</Typography>
              <Rating
                value={newReview.rating}
                onChange={(e, newValue) =>
                  setNewReview({ ...newReview, rating: newValue })
                }
                icon={<Star />}
              />
            </Box>
            <TextField
              label="Nhận xét"
              fullWidth
              multiline
              rows={4}
              value={newReview.comment}
              onChange={(e) =>
                setNewReview({ ...newReview, comment: e.target.value })
              }
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseReviewModal} color="secondary">
            Hủy
          </Button>
          <Button
            onClick={handleSubmitReview}
            color="primary"
            variant="contained"
            disabled={
              !newReview.name || !newReview.rating || !newReview.comment
            }
          >
            Gửi đánh giá
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
export default ReviewsProduct;
