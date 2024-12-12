import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import productApi from "../../service/api/productsApi.js";
import convertMoney from "../../service/others/convertMoney.js";
import { useState, useEffect } from "react";
import {
  FaBox,
  FaClock,
  FaShoppingCart,
  FaStar,
  FaStore,
} from "react-icons/fa";
import Loader from "../../components/Loader.jsx";
const ProductCarosel = () => {

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await productApi.getTopProducts()
        setProducts(response);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    autoplay: true,
    autoplaySpeed: 3000,
  };
  return (
    <div className="mb-4 lg:block xl:block md:block">
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">
        {error?.data?.message || error.error}
      </Message>
      ): (
      <Slider
        {...settings}
        className="xl:w-[45rem] lg:w-[45rem] md:w-[50rem] sm:w-[40rem] sm:block "
      >
        {products.map((product) => (
          <div key={product._id}>
            <img
              src={product.image}
              alt={product.name}
              className="w-full rounded-lg object-cover h-[30rem]"
            />

            <div className="flex justify-between text-white">
              <div className="one mt-2">
                <h2>{product.name}</h2>
                <p>{convertMoney(product.price)} VNĐ</p> <br></br>
                <p className="w-[25rem]">
                  {product.description.substring(0, 170)}...
                </p>
              </div>
              <div className="two flex  justify-between w-[20rem]">
                <div className="one mt-2 ml-2">
                  <h1 className="flex items-center mb-6">
                    <FaStore className="mr-2 text-white" /> Brand:dsf
                  </h1>
                  <h1 className="flex items-center mb-6">
                    <FaClock className="mr-2 text-white" /> Added: sdf
                  </h1>
                  <h1 className="flex items-center mb-6">
                    <FaStar className="mr-2 text-white" /> Reviews: sfd
                  </h1>
                </div>

                <div className="two mt-2 mr-3">
                  <h1 className="flex items-center mb-6">
                    <FaStar className="mr-2 text-white" /> Ratings:{" "}  asdf
                  </h1>
                  <h1 className="flex items-center mb-6">
                    <FaShoppingCart className="mr-2 text-white" /> Quantity: {" "} sdf sdf
                  </h1>
                  <h1 className="flex items-center mb-6">
                    <FaBox className="mr-2 text-white" /> In Stock:{" "} sdf df
                  </h1>
                </div>
              </div>
            </div>


          </div>

        ))}
      </Slider>
      )}
    </div>
  )}
export default ProductCarosel;
