import Header from "../components/Header";
import { useParams } from "react-router";
import { useEffect, useState } from "react";
import productsApi from "../service/api/productsApi.js";
import { Link } from "react-router";
import Product from "./Products/Product.jsx";
import Loader from "../components/Loader.jsx";
const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await productsApi.allProducts();
        setProducts(response);
        setLoading(false);
      } catch (error) {
        console.log(error)
        setError(error);
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);
  return (
    <>
      {/* {!keyword ? <Header /> : null} */}
      {/* <div className="bg-black">{!keyword ? <Header /> : null}</div> */}
      <div className="bg-black">{<Header/>}</div>
      {loading ? (
        <Loader />
      ) : error ? (
        <h1>Errorr</h1>
      ) : (
        <>
          <div className="flex justify-between items-center">
            <h1 className="ml-[20rem] mt-[10rem] text-[3rem]">
              Special Products
            </h1>
            <Link
              to="/shop"
              className="bg-pink-600 font-bold rounded-full py-2 px-10 mr-[18rem] mt-[10rem]"
            >
              Shop
            </Link>
          </div>

          <div>
            <div className="flex justify-center flex-wrap mt-[2rem]">
              {products?.map((product) => (
                <div key={product._id}>
                  <Product product={product} />
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </>
  );

};

export default Home;
