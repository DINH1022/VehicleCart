
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import Home from './pages/Home'
import ProductDetail from './pages/Products/ProductDetail.jsx'
import Cart from './pages/Cart.jsx'
import FavoritesProduct from './pages/Products/FavoritesProduct.jsx'
import Navigation from './pages/Auth/Navigation.jsx'
function App() {

  return (
    <Router>
      <div className='App'>
        <Routes>
          <Route path='/' element={<Navigation />}></Route>
          <Route path='/product/:id' element={<ProductDetail/>}></Route>
          <Route path='/cart/' element = {<Cart />}></Route>
          <Route path='/favorites' element = {<FavoritesProduct />}></Route>
        </Routes>
      </div>
    </Router>
  )
}

export default App