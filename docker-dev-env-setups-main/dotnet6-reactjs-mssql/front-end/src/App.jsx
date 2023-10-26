import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import { NavigationBar } from './components/navbar/navbar'
import { Categories } from './views/Categories/categories'
import { Home } from './views/home/home'
import { Items } from './views/Items/items'

const App = () => {

  return (
    <BrowserRouter>

      <NavigationBar />

      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Categories" element={<Categories />} />
          <Route path="/Items" element={<Items />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}


export default App
