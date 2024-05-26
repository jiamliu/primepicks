import React, { useState, useEffect, useRef } from 'react';
import './Header.css';
import logo from './primepicks.png';
import SearchIcon from '@mui/icons-material/Search';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

function Header() {
  const [searchTerm, setSearchTerm] = useState('');
  const [categories, setCategories] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef(null);

  const placeholderCategories = Array.from({ length: 10 }, (_, i) => ({
    id: `placeholder-${i}`,
    name: `Category ${i + 1}`
  }));

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/categories/categories/');
      const data = await response.json();
      console.log('Fetched categories:', data);
      if (Array.isArray(data)) {
        const sortedCategories = data.sort((a, b) => a.name.localeCompare(b.name));
        const combinedCategories = [...sortedCategories, ...placeholderCategories].slice(0, 10);
        setCategories(combinedCategories);
        console.log('Combined categories:', combinedCategories);
      } else {
        console.error('Unexpected response format:', data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      setCategories(placeholderCategories);
    }
  };

  const handleSearchInputChange = (e) => {
    setSearchTerm(e.target.value);
    console.log('Search term:', e.target.value);
  };

  const handleSearchFocus = () => {
    setShowSuggestions(true);
    console.log('Search bar focused, showing suggestions');
  };

  const handleSearchBlur = () => {
    setTimeout(() => {
      setShowSuggestions(false);
      console.log('Search bar lost focus, hiding suggestions');
    }, 200);
  };

  return (
    <div className="header">
      <img className="logo" src={logo} alt="PrimePicks Logo" />

      <div className="header__search" ref={searchRef}>
        <input
          className="header__searchInput"
          type="text"
          value={searchTerm}
          onChange={handleSearchInputChange}
          onFocus={handleSearchFocus}
          onBlur={handleSearchBlur}
        />
        <SearchIcon className="header__searchIcon" />
        {showSuggestions && categories.length > 0 && (
          <div className="header__searchSuggestions">
            {categories.slice(0, 10).map((category) => (
              <div key={category.id} className="header__searchSuggestion">
                <TrendingUpIcon className="header__icon" />
                {category.name}
              </div>
            ))}
          </div>
        )}
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
          <span className="header__optionLineTwo header__basketCount">0</span>
        </div>
      </div>
    </div>
  );
}

export default Header;