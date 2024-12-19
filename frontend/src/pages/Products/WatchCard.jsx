

import React, { useState } from "react";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  Rating,
  Stack,
  IconButton,
} from "@mui/material";
import {
  ShoppingCart as CartIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { Link } from "react-router-dom";
import HeartIconProduct from "./HeartIconProduct";

const WatchCard = ({
  watch,
  onAddToCart,
  onAddToFavorites,
  isFavorites = false,
  handleDeleteWatch,
}) => {
  const [isFavorite, setIsFavorite] = useState(false);

  const handleFavoriteToggle = () => {
    setIsFavorite(!isFavorite);
    onAddToFavorites && onAddToFavorites(watch); // Ensure function exists before calling.
  };

  return (
    <Card
      sx={{
        maxWidth: 320,
        borderRadius: 2,
        overflow: "hidden",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
        transition: "transform 0.3s, box-shadow 0.3s",
        "&:hover": {
          transform: "translateY(-5px)",
          boxShadow: "0px 6px 15px rgba(0, 0, 0, 0.2)",
        },
      }}
    >
      <Link to={`/product/${watch._id}`} style={{ textDecoration: "none" }}>
        <CardMedia
          component="img"
          height="200"
          image={watch.image}
          alt={watch.name}
          sx={{
            objectFit: "cover",
          }}
        />
      </Link>
      <CardContent sx={{ p: 2 }}>
        <Typography
          gutterBottom
          variant="h6"
          component="div"
          sx={{
            fontWeight: 600,
            fontSize: "1.1rem",
            color: "#333",
            textAlign: "center",
          }}
        >
          {watch.name}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ textAlign: "center", mb: 1 }}
        >
          {watch.brand}
        </Typography>

        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ mt: 1 }}
        >
          <Typography
            variant="h6"
            color="error"
            sx={{ fontWeight: 700, fontSize: "1rem" }}
          >
            {watch.price.toLocaleString()} VND
          </Typography>
          <Rating
            name="read-only"
            value={watch.rating}
            precision={0.1}
            readOnly
            sx={{ fontSize: "1rem" }}
          />
        </Stack>

        <Stack direction="row" spacing={1.5} sx={{ mt: 2 }}>
          <Button
            variant="contained"
            startIcon={<CartIcon />}
            onClick={() => onAddToCart && onAddToCart(watch)} // Ensure function exists before calling.
            sx={{
              flex: 1,
              backgroundColor: "#1a237e",
              "&:hover": { backgroundColor: "#000051" },
            }}
          >
            Thêm Giỏ
          </Button>
          {isFavorites ? (
            <IconButton
              color="error"
              onClick={() => handleDeleteWatch && handleDeleteWatch(watch._id)} // Ensure function exists before calling.
              sx={{
                backgroundColor: "rgba(255, 0, 0, 0.1)",
                "&:hover": {
                  backgroundColor: "rgba(255, 0, 0, 0.2)",
                },
              }}
            >
              <DeleteIcon />
            </IconButton>
          ) : (
            <HeartIconProduct
              product={watch}
              onToggleFavorite={handleFavoriteToggle}
              isFavorite={isFavorite}
            />
          )}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default WatchCard;
