import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Header from './Header';
import Home from './Home';
import Login from './Login';
import Register from './Register';
import Categories from './Categories';  // Import Categories component

export const UserContext = React.createContext();

function App() {
  const [user, setUser] = useState(null);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <Router>
        <div className="app">
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/categories/:categoryId" element={<Categories />} /> {/* Add this route */}
          </Routes>
        </div>
      </Router>
    </UserContext.Provider>
  );
}

export default App;



