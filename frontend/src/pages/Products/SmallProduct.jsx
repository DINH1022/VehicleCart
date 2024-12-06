import { Link } from "react-router"
const SmallProduct = ({ product }) => {
    function convertMoney(money) {
        return new Intl.NumberFormat('vi-VN').format(money);
    }
    return (
        <>
            <div className="w-[20rem] p-3 ml-[2rem]">
                <div className="relative">

                    <img src={product.image} alt={product.name} className="h-[14rem] object-cover rounded object-center w-full"/>
                    {/* Heade icon */}

                </div>


                <div className="p-4">
                    <Link to={`/product/${product.id}`}>
                        <h2 className="flex justify-between items-center text-white">
                            <div>{product.name}</div>
                            <span className="bg-pink-100 text-pink-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full dark:bg-pink-900 dark:text-pink-300">
                                {convertMoney(product.price)} VNĐ
                            </span>
                        </h2>
                    </Link>
                </div>
            </div>
        </>
    )
}
export default SmallProduct