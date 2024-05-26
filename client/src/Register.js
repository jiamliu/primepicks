import React, { useState } from 'react';
import './Register.css';
import logo from './primepicks.png';

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rePassword, setRePassword] = useState('');

  const handleRegister = (e) => {
    e.preventDefault();
  };

  return (
    <div className="register">
      <img className="register__logo" src={logo} alt="PrimePicks Logo" />
      <div className="register__container">
        <h1>Create account</h1>
        <form onSubmit={handleRegister}>
          <h5>Your name</h5>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
          
          <h5>Mobile number or email</h5>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          
          <h5>Password</h5>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <p>Passwords must be at least 6 characters.</p>
          
          <h5>Re-enter password</h5>
          <input type="password" value={rePassword} onChange={(e) => setRePassword(e.target.value)} required />
          
          <button type="submit" className="register__button">Continue</button>
        </form>
        <p>By creating an account, you agree to PrimePicks' <button className="linkButton">Conditions of Use</button> and <button className="linkButton">Privacy Notice</button>.</p>
        
        <p><button className="linkButton">Buying for work?</button></p>
        <p><button className="linkButton">Create a free business account</button></p>
        
        <p>Already have an account? <a href="/login">Sign in</a></p>
      </div>
    </div>
  );
}

export default Register;

