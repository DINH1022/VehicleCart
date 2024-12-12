
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import Home from './pages/Home'
import ProductDetail from './pages/Products/ProductDetail.jsx'

function App() {

  return (
    <Router>
      <div className='App'>
        <Routes>
          <Route path='/' element={<Home />}></Route>
          <Route path='/product/:id' element={<ProductDetail/>}></Route>
        </Routes>
      </div>
    </Router>
  )
}

export default App
