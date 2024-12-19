import React, { useState } from 'react';
import { 
  Card, 
  CardMedia, 
  CardContent, 
  Typography, 
  Button, 
  Rating, 
  Stack 
} from '@mui/material';
import { 
  Favorite as FavoriteIcon, 
  ShoppingCart as CartIcon 
} from '@mui/icons-material';
import {Link} from 'react-router-dom'
import HeartIconProduct from './HeartIconProduct';
const WatchCard = ({ watch, onAddToCart, onAddToFavorites }) => {
  const [isFavorite, setIsFavorite] = useState(false);

  const handleFavoriteToggle = () => {
    setIsFavorite(!isFavorite);
    onAddToFavorites(watch);
  };

  return (
    <Card 
      sx={{ 
        maxWidth: 350, 
        transition: 'transform 0.3s',
        '&:hover': { 
          transform: 'scale(1.05)',
          boxShadow: 3 
        }
      }}
    >
      <Link to={`/product/${watch._id}`}>
          <CardMedia
            component="img"
            height="250"
            image={watch.image}
            alt={watch.name}
          />
      </Link>
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {watch.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {watch.brand}
        </Typography>
        
        <Stack 
          direction="row" 
          justifyContent="space-between" 
          alignItems="center" 
          sx={{ mt: 1 }}
        >
          <Typography variant="h6" color="error">
            {watch.price.toLocaleString()} VND
          </Typography>
          <Rating 
            name="read-only" 
            value={watch.rating} 
            precision={0.5} 
            readOnly 
          />
        </Stack>

        <Stack 
          direction="row" 
          spacing={2} 
          sx={{ mt: 2 }}
        >
          <Button 
            variant="contained" 
            startIcon={<CartIcon />}
            onClick={() => onAddToCart(watch)}
            fullWidth
          >
            Thêm Giỏ
          </Button>
          <HeartIconProduct product={watch} />
        </Stack>
      </CardContent>
    </Card>
  );
};

export default WatchCard;