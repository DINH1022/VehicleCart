import React, { useState, useEffect } from "react";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  Rating,
  Stack,
  IconButton,
  Box,
  Chip,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import Swal from "sweetalert2";
import {
  ShoppingCart as CartIcon,
  Delete as DeleteIcon,
  LocalOffer as DiscountIcon,
} from "@mui/icons-material";
import { Link } from "react-router-dom";
import cartApi from "../../service/api/cartRequest";
import "react-toastify/dist/ReactToastify.css";
import showToast from "../../components/ShowToast";
import { addCartToSessionStorage } from "../../utils/sessionStorage.js";
import favoritesApi from "../../service/api/favoritesApi.js";

const WatchCard = ({
  watch,
  pageFavorite = false,
  favorited,
  handleDeleteWatch,
}) => {
  const [login, setLogin] = useState(!!sessionStorage.getItem("userData"));
  const [isFavorite, setIsFavorite] = useState(favorited);

  const calculateDiscount = () => {
    if (watch.originalPrice && watch.price) {
      return Math.round(
        ((watch.originalPrice - watch.price) / watch.originalPrice) * 100
      );
    }
    return 0;
  };

  const handleFavoriteToggle = async () => {
    if (login) {
      if (isFavorite) {
        setIsFavorite(!isFavorite);
        await favoritesApi.removeFavorite(watch._id);
      } else {
        setIsFavorite(!isFavorite);
        await favoritesApi.addFavorite(watch._id);
      }
    } else {
      Swal.fire(
        "Cảnh báo",
        "Bạn cần đăng nhập để yêu thích sản phẩm !",
        "error"
      );
    }
  };

  useEffect(() => {
    setIsFavorite(favorited);
  }, [favorited]);

  const handleCartToggle = async () => {
    try {
      if (login) {
        await cartApi.addToCart(watch._id, 1);
        showToast("Thêm vào giỏ hàng thành công!", "success");
      } else {
        addCartToSessionStorage(watch, 1);
        showToast("Thêm vào giỏ hàng thành công!", "success");
      }
    } catch (error) {
      throw error;
    }
  };

  return (
    <Card
      sx={{
        maxWidth: 320,
        borderRadius: 2,
        overflow: "hidden",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
        transition: "transform 0.3s, box-shadow 0.3s",
        position: "relative",
        "&:hover": {
          transform: "translateY(-5px)",
          boxShadow: "0px 6px 15px rgba(0, 0, 0, 0.2)",
        },
      }}
    >
      {watch.discount && calculateDiscount() > 0 && (
        <Box
          sx={{
            position: "absolute",
            top: 16,
            right: 16,
            zIndex: 1,
            transform: "rotate(0deg)",
          }}
        >
          <Chip
            icon={<DiscountIcon sx={{ color: "white !important" }} />}
            label={`-${calculateDiscount()}%`}
            sx={{
              bgcolor: "error.main",
              color: "white",
              fontWeight: "bold",
              "& .MuiChip-icon": {
                color: "white",
              },
            }}
          />
        </Box>
      )}

      <Link to={`/product/${watch._id}`} style={{ textDecoration: "none" }}>
        <Box sx={{ position: "relative", overflow: "hidden" }}>
          <CardMedia
            component="img"
            image={watch.image}
            alt={watch.name}
            sx={{
              height: "320px",
              width: "100%",
              objectFit: "contain",
              transition: "transform 0.3s ease-in-out",
              "&:hover": {
                transform: "scale(1.05)",
              },
            }}
          />
        </Box>
      </Link>

      <CardContent sx={{ p: 2 }}>
        <Stack spacing={1}>
          <Chip
            label={watch.brand}
            size="small"
            sx={{
              alignSelf: "flex-start",
              bgcolor: "primary.main",
              color: "white",
            }}
          />
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              fontSize: "1.1rem",
              color: "#333",
              minHeight: "2.4em",
              lineHeight: 1.2,
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
            }}
          >
            {watch.name}
          </Typography>

          <Stack direction="row" alignItems="center" spacing={1}>
            <Rating
              name="read-only"
              value={watch.rating}
              precision={0.1}
              readOnly
              size="small"
            />
            <Typography variant="body2" color="text.secondary">
              ({watch.numReviews})
            </Typography>
          </Stack>

          <Stack direction="row" alignItems="baseline" spacing={1}>
            <Typography
              variant="h6"
              color="error"
              sx={{ fontWeight: 700, fontSize: "1.2rem" }}
            >
              {watch.price.toLocaleString()}₫
            </Typography>
            {watch.originalPrice && (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ textDecoration: "line-through" }}
              >
                {watch.originalPrice.toLocaleString()} đ
              </Typography>
            )}
          </Stack>


          <Stack direction="row" spacing={1.5} sx={{ mt: 1 }}>
            <Button
              variant="contained"
              startIcon={<CartIcon />}
              onClick={handleCartToggle}
              sx={{
                flex: 1,
                bgcolor: "primary.main",
                "&:hover": { bgcolor: "primary.dark" },
              }}
            >
              Thêm vào Giỏ
            </Button>

            {pageFavorite ? (
              <IconButton
                color="error"
                onClick={() =>
                  handleDeleteWatch && handleDeleteWatch(watch._id)
                }
                sx={{
                  bgcolor: "error.light",
                  "&:hover": {
                    bgcolor: "error.main",
                  },
                }}
              >
                <DeleteIcon sx={{ color: "white" }} />
              </IconButton>
            ) : (
              <IconButton
                onClick={handleFavoriteToggle}
                sx={{
                  bgcolor: isFavorite ? "error.light" : "grey.200",
                  "&:hover": {
                    bgcolor: isFavorite ? "error.main" : "grey.300",
                  },
                }}
              >
                {isFavorite ? (
                  <FavoriteIcon sx={{ color: "white" }} />
                ) : (
                  <FavoriteBorderIcon />
                )}
              </IconButton>
            )}
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default WatchCard;


















// import React, { useState, useEffect } from "react";
// import {
//   Card,
//   CardMedia,
//   CardContent,
//   Typography,
//   Button,
//   Rating,
//   Stack,
//   IconButton,
// } from "@mui/material";
// import FavoriteIcon from "@mui/icons-material/Favorite";
// import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
// import Swal from "sweetalert2";
// import {
//   ShoppingCart as CartIcon,
//   Delete as DeleteIcon,
// } from "@mui/icons-material";
// import { Link } from "react-router-dom";
// import cartApi from "../../service/api/cartRequest";
// import "react-toastify/dist/ReactToastify.css";
// import showToast from "../../components/ShowToast";
// import { addCartToSessionStorage } from "../../utils/sessionStorage.js";
// import favoritesApi from "../../service/api/favoritesApi.js";

// const WatchCard = ({
//   watch,
//   pageFavorite = false,
//   favorited,
//   handleDeleteWatch,
// }) => {
//   const [login, setLogin] = useState(!!sessionStorage.getItem("userData"));
//   console.log("test: ", favorited);
//   const [isFavorite, setIsFavorite] = useState(favorited);
//   const handleFavoriteToggle = async () => {
//     if (login) {
//       if (isFavorite) {
//         setIsFavorite(!isFavorite);
//         await favoritesApi.removeFavorite(watch._id);
//       } else {
//         setIsFavorite(!isFavorite);
//         await favoritesApi.addFavorite(watch._id);
//       }
//     } else {
//       Swal.fire(
//         "Cảnh báo",
//         "Bạn cần đăng nhập để yêu thích sản phẩm !",
//         "error"
//       );
//     }
//   };
//   useEffect(() => {
//     setIsFavorite(favorited);
//   }, [favorited]);
//   const handleCartToggle = async () => {
//     try {
//       if (login) {
//         await cartApi.addToCart(watch._id, 1);
//         showToast("Thêm vào giỏ hàng thành công!", "success");
//       } else {
//         addCartToSessionStorage(watch, 1);
//         showToast("Thêm vào giỏ hàng thành công!", "success");
//       }
//     } catch (error) {
//       throw error;
//     }
//   };
//   return (
//     <Card
//       sx={{
//         maxWidth: 320,
//         borderRadius: 2,
//         overflow: "hidden",
//         boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
//         transition: "transform 0.3s, box-shadow 0.3s",
//         "&:hover": {
//           transform: "translateY(-5px)",
//           boxShadow: "0px 6px 15px rgba(0, 0, 0, 0.2)",
//         },
//       }}
//     >
//       <Link to={`/product/${watch._id}`} style={{ textDecoration: "none" }}>
//         <CardMedia
//           component="img"
//           image={watch.image}
//           alt={watch.name}
//           sx={{
//             height: "320px",
//             width: "100%",
//             objectFit: "contain",
//             objectPosition: "center",
//             overflow: "hidden",
//           }}
//         />
//       </Link>
//       <CardContent sx={{ p: 2 }}>
//         <Typography
//           gutterBottom
//           variant="h6"
//           component="div"
//           sx={{
//             fontWeight: 600,
//             fontSize: "1.1rem",
//             color: "#333",
//             textAlign: "center",
//           }}
//         >
//           {watch.name}
//         </Typography>
//         <Typography
//           variant="body2"
//           color="text.secondary"
//           sx={{ textAlign: "center", mb: 1 }}
//         >
//           {watch.brand}
//         </Typography>

//         <Stack
//           direction="row"
//           justifyContent="space-between"
//           alignItems="center"
//           sx={{ mt: 1 }}
//         >
//           <Typography
//             variant="h6"
//             color="error"
//             sx={{ fontWeight: 700, fontSize: "1rem" }}
//           >
//             {watch.price.toLocaleString()} đ
//           </Typography>
//           <Rating
//             name="read-only"
//             value={watch.rating}
//             precision={0.1}
//             readOnly
//             sx={{ fontSize: "1rem" }}
//           />
//         </Stack>

//         <Stack direction="row" spacing={1.5} sx={{ mt: 2 }}>
//           <Button
//             variant="contained"
//             startIcon={<CartIcon />}
//             onClick={handleCartToggle}
//             sx={{
//               flex: 1,
//               backgroundColor: "#1a237e",
//               "&:hover": { backgroundColor: "#000051" },
//             }}
//           >
//             Thêm vào Giỏ
//           </Button>
//           {pageFavorite ? (
//             <IconButton
//               color="error"
//               onClick={() => handleDeleteWatch && handleDeleteWatch(watch._id)}
//               sx={{
//                 backgroundColor: "rgba(255, 0, 0, 0.1)",
//                 "&:hover": {
//                   backgroundColor: "rgba(255, 0, 0, 0.2)",
//                 },
//               }}
//             >
//               <DeleteIcon />
//             </IconButton>
//           ) : (
//             <IconButton
//               onClick={handleFavoriteToggle}
//               sx={{
//                 borderRadius: "50%",
//                 transition: "transform 0.2s",
//               }}
//             >
//               {isFavorite ? (
//                 <FavoriteIcon style={{ color: "red" }} />
//               ) : (
//                 <FavoriteBorderIcon style={{ color: "gray" }} />
//               )}
//             </IconButton>
//           )}
//         </Stack>
//       </CardContent>
//     </Card>
//   );
// };

// export default WatchCard;