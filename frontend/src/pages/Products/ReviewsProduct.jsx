import React, { useState } from "react";
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
  Avatar,
} from "@mui/material";
import productApi from "../../service/api/productsApi";
import { StarRounded, StarOutlineRounded } from "@mui/icons-material";
import showToast from "../../components/ShowToast";
import Swal from "sweetalert2";

const ReviewsProduct = ({ reviews, setReviews, productId }) => {
  const [openReviewModal, setOpenReviewModal] = useState(false);
  const [login, setLogin] = useState(!!sessionStorage.getItem("userData"));
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [newReview, setNewReview] = useState({
    rating: 0,
    comment: "",
  });
  const handleOpenReviewModal = () => {
    if (login) {
      setOpenReviewModal(true);
    } else {
      Swal.fire("Cảnh báo", "Bạn cần đăng nhập để đánh giá sản phẩm !", "info");
    }
  };

  const handleCloseReviewModal = () => {
    setOpenReviewModal(false);
    setNewReview({ rating: 0, comment: "" });
  };

  const handleSubmitReview = async () => {
    if (newReview.rating > 0) {
      try {
        const res = await productApi.createReview(productId, newReview);
        console.log("res", res);
        if (res.success == false) {
          showToast(res.mes, "error");
        } else {
          showToast("Đánh giá sản phẩm thành công", "success");
        }
        const response = await productApi.getReviewProduct(productId);
        setReviews(response.reviews);
        handleCloseReviewModal();
      } catch (error) {
        console.error("Lỗi khi gửi nhận xét:", error);
      }
    }
  };

  const displayedReviews = showAllReviews ? reviews : reviews?.slice(0, 3);

  return (
    <>
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
          {reviews && reviews.length > 0 ? (
            <>
              {displayedReviews.map((review, index) => (
                <Box
                  key={index}
                  sx={{ borderBottom: "1px solid #e0e0e0", pb: 4, mb: 4 }}
                >
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="flex-start"
                  >
                    <Box display="flex" gap={2}>
                      <Avatar
                        src={review.avatar}
                        alt={review.name}
                        sx={{ marginTop: 1 }}
                      >
                        {review.name?.charAt(0)}
                      </Avatar>
                      <Box>
                        <Typography
                          variant="body1"
                          fontWeight="bold"
                          sx={{ marginLeft: 1 }}
                        >
                          {review.name}
                        </Typography>
                        <Rating
                          name="rounded-stars-rating"
                          defaultValue={review.rating}
                          precision={0.1}
                          readOnly
                          icon={<StarRounded fontSize="inherit" />}
                          emptyIcon={<StarOutlineRounded fontSize="inherit" />}
                        />
                        <Typography
                          variant="body1"
                          color="text.secondary"
                          sx={{ mt: 1 }}
                        >
                          {review.comment}
                        </Typography>
                      </Box>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      {review?.createdAt?.split("T")[0] || ""}
                    </Typography>
                  </Box>
                </Box>
              ))}
              <Box display="flex" gap={2} justifyContent="center">
                {reviews.length > 3 && (
                  <Button
                    variant="contained"
                    color="inherit"
                    onClick={() => setShowAllReviews(!showAllReviews)}
                  >
                    {showAllReviews ? "Thu gọn" : "Xem tất cả nhận xét"}
                  </Button>
                )}
              </Box>
            </>
          ) : (
            <Typography variant="body1">Chưa có nhận xét nào</Typography>
          )}
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
            disabled={!newReview.rating}
          >
            Gửi đánh giá
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ReviewsProduct;
