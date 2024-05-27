import React, { useState, useContext } from 'react';
import './Login.css';
import logo from './primepicks.png';
import { useNavigate } from 'react-router-dom';
import { UserContext } from './App';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://127.0.0.1:8000/api/users/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('access_token', data.access);
        localStorage.setItem('refresh_token', data.refresh);
        setUser(data.user);
        navigate('/');
      } else {
        console.error('Login failed:', data);
      }
    } catch (error) {
      console.error('Error logging in:', error);
    }
  };

  return (
    <div className="login">
      <img className="login__logo" src={logo} alt="PrimePicks Logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }} />
      <div className="login__container">
        <h1>Sign-In</h1>
        <form onSubmit={handleLogin}>
          <h5>Email</h5>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <h5>Password</h5>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <button type="submit" className="login__signInButton">Sign In</button>
        </form>
        <p>By continuing, you agree to PrimePicks' Conditions of Use and Privacy Notice.</p>
        <button onClick={() => navigate('/register')} className="login__registerButton">
          Create your PrimePicks Account
        </button>
      </div>
    </div>
  );
}

export default Login;








