import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Header from './Header';
import Home from './Home';
import Login from './Login';
import Register from './Register';
import Categories from './Categories';
import Products from './Products'; 
import { CartProvider } from './CartContext';

export const UserContext = React.createContext();

function App() {
  const [user, setUser] = useState(null);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <CartProvider>
        <Router>
          <div className="app">
            <Header />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/categories/:categoryId" element={<Categories />} />
              <Route path="/product/:productId" element={<Products />} />
            </Routes>
          </div>
        </Router>
      </CartProvider>
    </UserContext.Provider>
  );
}

export default App;



