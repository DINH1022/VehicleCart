import React, { useState, useEffect } from "react";
import { IconButton } from "@mui/material";
import { ShoppingCart as CartIcon } from "@mui/icons-material";
import Loader from "../../components/Loader";
import { useSelector, useDispatch } from "react-redux";
import favoritesApi from "../../service/api/favoritesApi";
import { useNavigate } from "react-router-dom";
import {
  removeFromFavorites,
  setFavorites,
} from "../../redux/feature/favoritesSlice";
import WatchCard from "./WatchCard";
const FavoritesProduct = () => {
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const favoritesProduct = useSelector((state) => state.favorites);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const favorites = await favoritesApi.getFavorites();
        dispatch(setFavorites(favorites.products));
      } catch (error) {
        console.error("Failed to fetch favorites:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFavorites();
  }, [dispatch]);

  const handleDeleteWatch = async (id) => {
    try {
      dispatch(removeFromFavorites(id));
      await favoritesApi.removeFavorite(id);
    } catch (error) {
      console.error("Failed to delete the item:", error);
    }
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="min-h-screen bg-gray-50 p-4">
          <div className="container mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-800">
                Danh Sách Đồng Hồ Yêu Thích
              </h1>
              <div className="relative">
                <IconButton color="primary" size="small">
                  <CartIcon />
                </IconButton>
                <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full px-1.5 text-xs">
                  {cart.length}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {favoritesProduct.map((watch) => (
                <WatchCard
                  watch={watch}
                  isFavorites={true}
                  handleDeleteWatch={handleDeleteWatch}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FavoritesProduct;
