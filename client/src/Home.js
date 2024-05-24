import React from 'react';
import "./Home.css";

function Home() {
  return (
    <div className='home'>
        <div className = "home__container">
          <img className = "home__image" src = "https://img.freepik.com/premium-photo/many-beauty-fashion-cosmetic-makeup-lotion-bottles-product-with-skin-care-healthcare-concept-falling-shopping-cart-3d-rendering_476612-20259.jpg?size=626&ext=jpg&ga=GA1.1.44546679.1715731200&semt=ais_user" alt="Banner" />
          <div className = "home__row"></div>
          <div className = "home__row"></div>
          <div className = "home__row"></div>
        </div>
    </div>
  )
}

export default Home