import React from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Header from './Header.js';
import Home from './Home.js';
import Login from './Login.js';
import Register from './Register.js'

function App() {
  return (
    <Router>
      <div className="app">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

