import { useEffect } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import {
  addFavoriteToLocalStorage,
  getFavoritesFromLocalStorage,
  removeFavoriteFromLocalStorage,
} from "../../utils/localStorage.js";
const HeartIcon = ({ product }) => {
  var isFavorite = true;

  useEffect(() => {
    const favoritesFromLocalStorage = getFavoritesFromLocalStorage();
  }, []);

  const toggleFavorites = () => {
    if (isFavorite) {
      removeFavoriteFromLocalStorage(product.id);
      isFavorite =false
    } else {
      addFavoriteToLocalStorage(product);
      isFavorite = true
    }
  };
  return (
    <div
      className="absolute top-2 right-5 cursor-pointer"
      onClick={toggleFavorites}
    >
      {isFavorite ? (
        <FaHeart className="text-pink-500" />
      ) : (
        <FaRegHeart className="text-white" />
      )}
    </div>
  );
};

export default HeartIcon;
