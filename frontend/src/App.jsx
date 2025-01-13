import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProductDetail from "./pages/Products/ProductDetail.jsx";
import Cart from "./pages/Carts/Cart.jsx"
import FavoritesProduct from "./pages/Products/FavoritesProduct.jsx";
import HomePage from "./pages/Home/Home.jsx";
import Register from "./pages/Auth/Register.jsx";
import Login from "./pages/Auth/Login.jsx";
import UserList from "./pages/Admin/UserList.jsx";
import Profile from "./pages/User/Profile.jsx";
import ProductsPage from "./pages/Products/ProductsPage.jsx";
import Dashboard from "./pages/Admin/Dashboard.jsx";
import CategoriesPage from "./pages/Admin/CategoriesPage.jsx";
import OrderHistory from "./pages/Orders/OrderHistory";
import OrderManagement from "./pages/Admin/OrderManagement.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />}></Route>
          <Route path="/product/:id" element={<ProductDetail />}></Route>
          <Route path="/cart/" element={<Cart />}></Route>
          <Route path="/products" element={<ProductsPage />}></Route>
          <Route path="/favorites" element={<FavoritesProduct />}></Route>
          <Route path="/register" element={<Register />}></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/users" element={<UserList />}></Route>
          <Route path="/categories" element={<CategoriesPage />}></Route>
          <Route path="/profile" element={<Profile />}></Route>
          <Route path="/admin" element={<Dashboard />}></Route>
          <Route path="/orders" element={<OrderHistory />}></Route>
          <Route path="/admin/orders" element={<OrderManagement />}></Route>
        </Routes>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </div>
    </Router>
  );
}

export default App;
