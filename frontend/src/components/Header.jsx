import SmallProduct from "../pages/Products/SmallProduct";
import ProductCarosel from "../pages/Products/ProductCarosel";
import { useState, useEffect } from "react";
import Loader from "./Loader";
import productApi from "../service/api/productsApi";

const Header = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await productApi.getTopProducts();
        setProducts(response);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);
  
  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <h1>ERROR</h1>;
  }
  return (
    <>
      <div className="flex justify-around">
        <div className="xl:block lg:hidden md:hidden sm:hidden">
          <div className="grid grid-cols-2">
            {products.map((product) => {
              return (
                <div key={product._id}>
                  <SmallProduct product={product} />
                </div>
              );
            })}
          </div>
        </div>
        <ProductCarosel />
      </div>
    </>
  );
};
export default Header;
