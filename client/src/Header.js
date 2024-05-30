import React, { useState, useEffect, useRef, useCallback, useContext } from 'react';
import './Header.css';
import logo from './primepicks.png';
import SearchIcon from '@mui/icons-material/Search';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PlaceIcon from '@mui/icons-material/Place';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { useNavigate } from 'react-router-dom';
import { UserContext } from './App';
import { useCart } from './CartContext';

function Header() {
  const [searchTerm, setSearchTerm] = useState('');
  const [categories, setCategories] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [location, setLocation] = useState('Fetching location...');
  const searchRef = useRef(null);
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserContext);
  const { cart } = useCart();

  const fetchCategories = useCallback(async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/categories/categories/');
      const data = await response.json();
      if (Array.isArray(data)) {
        const sortedCategories = data.sort((a, b) => a.name.localeCompare(b.name));
        setCategories(sortedCategories);
      } else {
        console.error('Unexpected response format:', data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`)
        .then(response => response.json())
        .then(data => {
          setLocation(`Delivering to ${data.city} ${data.postcode}`);
        })
        .catch(error => {
          console.error('Error fetching location:', error);
          setLocation('Location not available');
        });
    });
  }, []);

  const handleSearchInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchFocus = () => {
    setShowSuggestions(true);
    document.getElementById('overlay').style.display = 'block';
  };

  const handleSearchBlur = () => {
    setTimeout(() => {
      setShowSuggestions(false);
      document.getElementById('overlay').style.display = 'none';
    }, 200);
  };

  const handleSignOut = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setUser(null);
    navigate('/login');
  };

  const updateLocation = () => {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`)
        .then(response => response.json())
        .then(data => {
          setLocation(`Delivering to ${data.city} ${data.postcode}`);
        })
        .catch(error => {
          console.error('Error fetching location:', error);
          setLocation('Location not available');
        });
    });
  };

  return (
    <div className="header">
      <div id="overlay"></div>
      <img className="logo" src={logo} alt="PrimePicks Logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }} />
      <div className="header__location" onClick={updateLocation} style={{ cursor: 'pointer' }}>
        <PlaceIcon className="header__locationIcon" />
        <div className="header__locationText">
          <span>{location}</span>
          <span className="header__updateLocation">Update location</span>
        </div>
      </div>
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
            {categories.filter(cat => cat.name.toLowerCase().includes(searchTerm.toLowerCase())).slice(0, 10).map((category) => (
              <div key={category.id} className="header__searchSuggestion" onClick={() => navigate(`/categories/${category.id}`)}>
                <TrendingUpIcon className="header__icon" />
                {category.name}
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="header__nav">
        <div className="header__option" onClick={user ? handleSignOut : () => navigate('/login')}>
          <span className="header__optionLineOne">Hello {user ? user.username : 'Guest'}</span>
          <span className="header__optionLineTwo">{user ? 'Sign Out' : 'Sign In'}</span>
        </div>
        <div className="header__option">
          <span className="header__optionLineOne">Returns</span>
          <span className="header__optionLineTwo">& Orders</span>
        </div>
        <div className="header__option">
          <span className="header__optionLineOne">Go</span>
          <span className="header__optionLineTwo">PrimePass</span>
        </div>
        <div className="header__optionBasket">
          <ShoppingCartIcon />
          <span className="header__optionLineTwo header__basketCount">{cart.length}</span>
        </div>
      </div>
    </div>
  );
}

export default Header;





















