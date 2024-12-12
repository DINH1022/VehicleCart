// import Header from "../components/Header";
// import { useEffect, useState } from "react";
// import productsApi from "../service/api/productsApi.js";
// import { Link } from "react-router";
// import Product from "./Products/Product.jsx";
// import Loader from "../components/Loader.jsx";
// const Home = () => {
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         const response = await productsApi.allProducts();
//         setProducts(response);
//         setLoading(false);
//       } catch (error) {
//         console.log(error)
//         setError(error);
//         setLoading(false);
//       }
//     };
//     fetchProducts();
//   }, []);
//   return (
//     <>
//       {/* {!keyword ? <Header /> : null} */}
//       {/* <div className="bg-black">{!keyword ? <Header /> : null}</div> */}
//       <div className="bg-gray-50">{<Header/>}</div>
//       {loading ? (
//         <Loader />
//       ) : error ? (
//         <h1>Errorr</h1>
//       ) : (
//         <>
//           <div className="flex justify-between items-center">
//             <h1 className="ml-[20rem] mt-[10rem] text-[3rem]">
//               Special Products
//             </h1>
//             <Link
//               to="/shop"
//               className="bg-pink-600 font-bold rounded-full py-2 px-10 mr-[18rem] mt-[10rem]"
//             >
//               Shop
//             </Link>
//           </div>

//           <div>
//             <div className="flex justify-center flex-wrap mt-[2rem]">
//               {products?.map((product) => (
//                 <div key={product._id}>
//                   <Product product={product} />
//                 </div>
//               ))}
//             </div>
//           </div>
//         </>
//       )}
//     </>
//   );

// };

// export default Home;

import React, { useState } from "react";
import { Container, Box, Typography, Button, Stack } from "@mui/material";
import { ArrowForward as ArrowIcon } from "@mui/icons-material";

import TopSlider from "./Products/TopSlider";
import WatchCard from "./Products/WatchCard";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { Loader } from "lucide-react";
import productApi from "../service/api/productsApi";
const HomePage = () => {
  const [favorites, setFavorites] = useState([]);
  const [cart, setCart] = useState([]);
  const [featureProducts, setFeatureProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await productApi.getNewProducts();
        setFeatureProducts(response);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleAddToFavorites = (watch) => {
    setFavorites((prev) =>
      prev.some((fav) => fav.id === watch.id)
        ? prev.filter((fav) => fav.id !== watch.id)
        : [...prev, watch]
    );
  };

  const handleAddToCart = (watch) => {
    setCart((prev) => [...prev, watch]);
  };

  return (
    <Box sx={{ backgroundColor: "#f4f4f4", minHeight: "100vh" }}>
      {/* <Header 
        cartItems={cart} 
        favoriteItems={favorites} 
      /> */}

      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Top Slider */}
        <TopSlider
          onAddToCart={handleAddToCart}
          onAddToFavorites={handleAddToFavorites}
        />

        {/* Featured Watches Section */}
        <Box sx={{ my: 6, textAlign: "center" }}>
          <Typography variant="h4" gutterBottom>
            Bộ Sưu Tập Nổi Bật
          </Typography>
        </Box>

        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={3}
          justifyContent="center"
          alignItems="stretch"
          sx={{
            flexWrap: "wrap",
            gap: 4,
          }}
        >
          {loading ? (
            <Loader />
          ) : (
            featureProducts.map((watch) => (
              <Box
                key={watch.id}
                sx={{
                  width: {
                    xs: "100%",
                    sm: "calc(50% - 24px)",
                    md: "calc(33.33% - 24px)",
                  },
                  minWidth: 300,
                  maxWidth: 400,
                }}
              >
                <Link>
                  <WatchCard
                    watch={watch}
                    onAddToCart={handleAddToCart}
                    onAddToFavorites={handleAddToFavorites}
                  />
                </Link>
              </Box>
            ))
          )}
        </Stack>

        {/* Shop Collection Button */}
        <Box sx={{ textAlign: "center", my: 6 }}>
          <Button variant="contained" size="large" endIcon={<ArrowIcon />}>
            Khám Phá Bộ Sưu Tập
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default HomePage;
