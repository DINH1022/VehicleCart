import React, { useState, useEffect } from "react";
import Loader from "../../components/Loader";
import { useSelector, useDispatch } from "react-redux";
import favoritesApi from "../../service/api/favoritesApi";
import { useNavigate } from "react-router-dom";
import {
  removeFromFavorites,
  setFavorites,
} from "../../redux/feature/favoritesSlice";
import WatchCard from "./WatchCard";
import Navigation from "../Auth/Navigation";

const FavoritesProduct = () => {
  const [loading, setLoading] = useState(true);
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
        <div className="flex">
          <Navigation />
          <div className="min-h-screen bg-gray-50 p-4 flex-1">
            <div className="container mx-auto px-4">
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-semibold text-gray-800">
                  Danh Sách Đồng Hồ Yêu Thích
                </h1>
              </div>

              <div className="grid grid-cols-4 gap-6">
                {favoritesProduct.map((watch) => (
                  <WatchCard
                    key={watch.id}
                    watch={watch}
                    isFavorites={true}
                    handleDeleteWatch={handleDeleteWatch}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
    </>
  );
};

export default FavoritesProduct;
