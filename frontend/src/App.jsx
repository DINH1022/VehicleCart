
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import Home from './pages/Home'
import Favorites from './pages/Products/Favorites'
import ProductDetail from './pages/Products/ProductDetail'
function App() {

  return (
    <Router>
      <div className='App'>
        <Routes>
          <Route path='/' element={<Home />}></Route>
          <Route path='/favorites' element = {<Favorites />}></Route>
          <Route path='/product/:id' element = {<ProductDetail />}></Route>
        </Routes>
      </div>
    </Router>
  )
}

export default App
