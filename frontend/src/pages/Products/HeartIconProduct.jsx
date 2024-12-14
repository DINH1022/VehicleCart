
import IconButton from "@mui/material/IconButton";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import favoritesApi from "../../service/api/favoritesApi";
import {
  setFavorites,
  addToFavorites,
  removeFromFavorites,
} from "../../redux/feature/favoritesSlice";

const HeartIconProduct = ({ product }) => {
  const dispatch = useDispatch();
  const favorites = useSelector((state) => state.favorites);
  const [loading, setLoading] = useState(true); 


  const isFavorited = favorites.some((favorite) => favorite._id === product._id);


  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const response = await favoritesApi.getFavorites();
        dispatch(setFavorites(response.products || [])); 
      } catch (error) {
        console.error("Failed to fetch favorites:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [dispatch]);

  const toggleHeart = async () => {
    if (loading) return;

    try {
      if (isFavorited) {
        await favoritesApi.removeFavorite(product._id);
        dispatch(removeFromFavorites(product._id));
      } else {
        await favoritesApi.addFavorite(product);
        dispatch(addToFavorites(product));
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  return (
    <IconButton
      onClick={toggleHeart}
      style={{
        borderRadius: "50%",
        transition: "transform 0.2s",
        "&:hover": {
          transform: "scale(1.1)",
        },
      }}
      disabled={loading} 
    >
      {loading ? (
        <FavoriteBorderIcon style={{ color: "gray", opacity: 0.5 }} />
      ) : isFavorited ? (
        <FavoriteIcon style={{ color: "red" }} />
      ) : (
        <FavoriteBorderIcon style={{ color: "gray" }} />
      )}
    </IconButton>
  );
};

export default HeartIconProduct;
