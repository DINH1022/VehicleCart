
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import ProductDetail from './pages/Products/ProductDetail.jsx'
import Cart from './pages/Cart.jsx'
import FavoritesProduct from './pages/Products/FavoritesProduct.jsx'
import Navigation from './pages/Auth/Navigation.jsx'
import HomePage from './pages/Home.jsx'
import Register from './pages/Auth/Register.jsx'
import Login from './pages/Auth/Login.jsx'
function App() {

  return (
    <Router>
      <div className='App'>
        <Routes>
          <Route path='/' element={<HomePage />}></Route>
          <Route path='/product/:id' element={<ProductDetail/>}></Route>
          <Route path='/cart/' element = {<Cart />}></Route>
          <Route path='/favorites' element = {<FavoritesProduct />}></Route>
          <Route path='/register' element = {<Register />}></Route>
          <Route path = 'login' element ={<Login/>}></Route>
        </Routes>
      </div>
    </Router>
  )
}

export default App