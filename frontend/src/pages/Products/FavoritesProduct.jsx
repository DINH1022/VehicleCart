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

  const [favorites, setFavorites] = useState([]);
  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const response = await favoritesApi.getFavorites();
        setFavorites(response.products);
      } catch (error) {
        console.error("Failed to fetch favorites:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFavorites();
  }, []);

  const handleDeleteWatch = async (id) => {
    try {
      await favoritesApi.removeFavorite(id);
      const response = await favoritesApi.getFavorites();
      setFavorites(response.products);
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
                {favorites.map((watch, index) => {
                  const isFavorited = favorites.some(
                    (fav) => fav._id === watch._id
                  );
                  return (
                    <WatchCard
                      key={index}
                      watch={watch}
                      pageFavorite={true}
                      handleDeleteWatch={handleDeleteWatch}
                      favorited={isFavorited}
                    />
                  );
                })}
                ;
              </div>
            </div>
          </div>
        </div>
    </>
  );
};

export default FavoritesProduct;
