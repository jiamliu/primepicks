import React, { useState, useEffect } from 'react';
import './Header.css';
import logo from './primepicks.png';
import SearchIcon from '@mui/icons-material/Search';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

function Header() {
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
  }, []);

  return (
    <div className="header">
      <img className="logo" src={logo} alt="PrimePicks Logo" />

      <div className="header__search">
        <input className="header__searchInput" type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}/>
        <SearchIcon className = "header__searchIcon" />
      </div>

      <div className="header__nav">
        <div className="header__option">
          <span className="header__optionLineOne">Hello Guest</span>
          <span className="header__optionLineTwo">Sign In</span>
        </div>
        <div className="header__option">
          <span className="header__optionLineOne">Returns</span>
          <span className="header__optionLineTwo">& Orders</span>
        </div>
        <div className="header__option">
          <span className="header__optionLineOne">Go</span>
          <span className="header__optionLineTwo">Premium</span>
        </div>
        <div className="header__optionBasket">
          <ShoppingCartIcon />
          <span className = "header__optionLineTwo header__basketCount">0</span>
        </div>
      </div>
    </div>
  );
}

export default Header;
