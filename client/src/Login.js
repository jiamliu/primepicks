import React, { useState } from 'react';
import './Login.css';
import logo from './primepicks.png';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
  };

  return (
    <div className="login">
      <img className="login__logo" src={logo} alt="PrimePicks Logo" />
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
        <button className="login__helpButton">Need help?</button>
        <div className="login__divider"></div>
        <button onClick={() => window.location.href = '/register'} className="login__registerButton">
          Create your PrimePicks Account
        </button>
      </div>
    </div>
  );
}

export default Login;

