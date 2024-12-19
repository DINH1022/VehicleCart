// import React, { useState, useEffect } from "react";
// import {
//   Card,
//   CardMedia,
//   CardContent,
//   Typography,
//   IconButton,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   Button,
// } from "@mui/material";
// import {
//   Delete as DeleteIcon,
//   AddCircle as AddIcon,
//   ShoppingCart as CartIcon,
// } from "@mui/icons-material";
// import { useSelector, useDispatch } from "react-redux";
// import favoritesApi from "../../service/api/favoritesApi";
// import {
//   removeFromFavorites,
//   setFavorites,
// } from "../../redux/feature/favoritesSlice";

// const FavoritesProduct = () => {
//   const [openDialog, setOpenDialog] = useState(false);
//   const [selectedWatch, setSelectedWatch] = useState(null);
//   const [cart, setCart] = useState([]);
//   const dispatch = useDispatch();
//   const favoritesProduct = useSelector((state) => state.favorites);

//   useEffect(() => {
//     const fetchFavorites = async () => {
//       try {
//         const favorites = await favoritesApi.getFavorites();
//         dispatch(setFavorites(favorites.products));
//       } catch (error) {
//         console.error("Failed to fetch favorites:", error);
//       }
//     };
//     fetchFavorites();
//   }, [dispatch]);

//   const handleDeleteWatch = async (id) => {
//     try {
//       dispatch(removeFromFavorites(id));

//       await favoritesApi.removeFavorite(id);
//     } catch (error) {
//       console.error("Failed to delete the item:", error);
//     }
//   };

//   const handleOpenDetails = (watch) => {
//     setSelectedWatch(watch);
//     setOpenDialog(true);
//   };

//   const handleCloseDialog = () => {
//     setOpenDialog(false);
//     setSelectedWatch(null);
//   };

//   const handleAddToCart = (watch) => {
//     if (!cart.find((item) => item.id === watch.id)) {
//       setCart([...cart, { ...watch, quantity: 1 }]);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 p-8">
//       <div className="container mx-auto">
//         <div className="flex justify-between items-center mb-8">
//           <h1 className="text-3xl font-bold text-gray-800">
//             Danh Sách Đồng Hồ Yêu Thích
//           </h1>
//           <div className="relative">
//             <IconButton color="primary">
//               <CartIcon />
//             </IconButton>
//             <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full px-2 text-xs">
//               {cart.length}
//             </span>
//           </div>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {favoritesProduct.map((watch) => (
//             <Card
//               key={watch._id}
//               className="transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
//             >
//               <CardMedia
//                 component="img"
//                 height="300"
//                 image={watch.image}
//                 alt={watch.name}
//                 className="h-64 object-cover"
//               />
//               <CardContent className="relative">
//                 <Typography
//                   gutterBottom
//                   variant="h5"
//                   component="div"
//                   className="font-bold text-gray-800"
//                 >
//                   {watch.name}
//                 </Typography>
//                 <Typography
//                   variant="body2"
//                   color="text.secondary"
//                   className="text-gray-600 mb-4"
//                 >
//                   {watch.brand} | ${watch.price.toLocaleString()}
//                 </Typography>

//                 <div className="absolute top-2 right-2 flex space-x-2">
//                   <IconButton
//                     color="error"
//                     onClick={() => handleDeleteWatch(watch._id)}
//                     className="bg-red-50 hover:bg-red-100"
//                   >
//                     <DeleteIcon />
//                   </IconButton>
//                   <IconButton
//                     color="primary"
//                     onClick={() => handleOpenDetails(watch)}
//                     className="bg-blue-50 hover:bg-blue-100"
//                   >
//                     <AddIcon />
//                   </IconButton>
//                 </div>

//                 <Button
//                   variant="contained"
//                   color="primary"
//                   startIcon={<CartIcon />}
//                   className="w-full mt-4"
//                   onClick={() => handleAddToCart(watch)}
//                 >
//                   Thêm vào giỏ
//                 </Button>
//               </CardContent>
//             </Card>
//           ))}
//         </div>

//         <Dialog
//           open={openDialog}
//           onClose={handleCloseDialog}
//           maxWidth="md"
//           fullWidth
//         >
//           {selectedWatch && (
//             <>
//               <DialogTitle className="text-2xl font-bold text-gray-800">
//                 {selectedWatch.name}
//               </DialogTitle>
//               <DialogContent className="flex flex-col md:flex-row gap-6">
//                 <img
//                   src={selectedWatch.image}
//                   alt={selectedWatch.name}
//                   className="w-full md:w-1/2 rounded-lg object-cover"
//                 />
//                 <div>
//                   <Typography
//                     variant="h6"
//                     className="font-semibold text-gray-700 mb-2"
//                   >
//                     Thông Tin Chi Tiết
//                   </Typography>
//                   <Typography variant="body1" className="text-gray-600 mb-10">
//                     <strong>Hãng:</strong> {selectedWatch.brand}
//                   </Typography>
//                   <Typography variant="body1" className="text-gray-600 mb-10">
//                     <strong>Giá:</strong> {selectedWatch.price.toLocaleString()}{" "}
//                     VNĐ
//                   </Typography>
//                   <Typography variant="body1" className="text-gray-600 m-4">
//                     <strong>Mô Tả:</strong> {selectedWatch.description}
//                   </Typography>
//                   <Button
//                     variant="contained"
//                     color="primary"
//                     startIcon={<CartIcon />}
//                     className="mt-10"
//                     onClick={() => {
//                       handleAddToCart(selectedWatch);
//                       handleCloseDialog();
//                     }}
//                   >
//                     Thêm vào giỏ
//                   </Button>
//                 </div>
//               </DialogContent>
//             </>
//           )}
//         </Dialog>
//       </div>
//     </div>
//   );
// };

// export default FavoritesProduct;

import React, { useState, useEffect } from "react";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  AddCircle as AddIcon,
  ShoppingCart as CartIcon,
} from "@mui/icons-material";
import { useSelector, useDispatch } from "react-redux";
import favoritesApi from "../../service/api/favoritesApi";
import {
  removeFromFavorites,
  setFavorites,
} from "../../redux/feature/favoritesSlice";
import WatchCard from "./WatchCard";
const FavoritesProduct = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedWatch, setSelectedWatch] = useState(null);
  const [cart, setCart] = useState([]);
  const dispatch = useDispatch();
  const favoritesProduct = useSelector((state) => state.favorites);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const favorites = await favoritesApi.getFavorites();
        dispatch(setFavorites(favorites.products));
      } catch (error) {
        console.error("Failed to fetch favorites:", error);
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

  const handleOpenDetails = (watch) => {
    setSelectedWatch(watch);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedWatch(null);
  };

  const handleAddToCart = (watch) => {
    if (!cart.find((item) => item.id === watch.id)) {
      setCart([...cart, { ...watch, quantity: 1 }]);
    }
  };

  return (
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
             <WatchCard watch={watch} isFavorites={true} handleDeleteWatch={handleDeleteWatch} />
          ))}
        </div>


      </div>
    </div>
  );
};

export default FavoritesProduct;

