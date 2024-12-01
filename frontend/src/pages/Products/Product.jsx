import { Link } from "react-router"
import HeartIcon from "./HeartIcon";
const Product = ({product}) => {

    function convertMoney(money) {
        return new Intl.NumberFormat('vi-VN').format(money);
    }
    return (
        <div className="w-[30rem] p-2 relative">
            <div className="relative">
                <img src= {product.image} alt={product.name} className="w-[28rem] h-[20rem] rounded" />
                <HeartIcon product = {product} />
            </div>

            <div className="p-3">
                <Link to={`/product/${product.id}`}>
                    <h2 className="flex justify-between items-center">
                        <div className="text-lg">{product.name}</div>
                        <span className="bg-pink-100 text-pink-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded-full dark:bg-pink-900 dark:text-pink-300">
                         {convertMoney(product.price)} VNĐ
                        </span>
                    </h2>
                </Link>
            </div>
        </div>
    )
}
export default Product