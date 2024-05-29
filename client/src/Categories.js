import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './Categories.css';
import primePassLogo from './primepass.png';

const Categories = () => {
    const { categoryId } = useParams();
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [priceRange, setPriceRange] = useState([0, 1000]);
    const [selectedRatings, setSelectedRatings] = useState([]);
    const [selectedBrands, setSelectedBrands] = useState([]);

    useEffect(() => {
        fetch(`http://127.0.0.1:8000/api/products/products/?category=${categoryId}`)
            .then(response => response.json())
            .then(data => {
                setProducts(data);
                setFilteredProducts(data);
            });
    }, [categoryId]);

    useEffect(() => {
        let filtered = [...products];

        if (selectedRatings.length > 0) {
            filtered = filtered.filter(product =>
                selectedRatings.some(rating => Math.round(product.rating) >= rating)
            );
        }

        if (selectedBrands.length > 0) {
            filtered = filtered.filter(product => selectedBrands.includes(product.title));
        }

        filtered = filtered.filter(product => {
            if (priceRange[1] === 1000) {
                return product.price >= priceRange[0];
            } else {
                return product.price >= priceRange[0] && product.price <= priceRange[1];
            }
        });

        setFilteredProducts(filtered);
    }, [priceRange, selectedRatings, selectedBrands, products]);

    const getDeliveryDate = (daysToAdd) => {
        const date = new Date();
        date.setDate(date.getDate() + daysToAdd);
        const options = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    };

    const handleRatingChange = (rating) => {
        setSelectedRatings(prevRatings =>
            prevRatings.includes(rating)
                ? prevRatings.filter(r => r !== rating)
                : [...prevRatings, rating]
        );
    };

    const handleBrandChange = (brand) => {
        setSelectedBrands(prevBrands =>
            prevBrands.includes(brand)
                ? prevBrands.filter(b => b !== brand)
                : [...prevBrands, brand]
        );
    };

    const uniqueBrands = Array.from(new Set(products.map(product => product.title)));

    const handlePriceChange = (e) => {
        const minValue = Math.min(e.target.value, priceRange[1]);
        const maxValue = Math.max(e.target.value, priceRange[0]);
        if (e.target.name === 'min') {
            setPriceRange([minValue, priceRange[1]]);
        } else {
            setPriceRange([priceRange[0], maxValue]);
        }
    };

    return (
        <div className="categories-page">
            <div className="sidebar">
                <div className="filter-section">
                    <h4>Price</h4>
                    <div className="price-slider">
                        <input
                            type="range"
                            min="0"
                            max="1000"
                            value={priceRange[0]}
                            onChange={handlePriceChange}
                            name="min"
                            className="range-input"
                        />
                        <input
                            type="range"
                            min="0"
                            max="1000"
                            value={priceRange[1]}
                            onChange={handlePriceChange}
                            name="max"
                            className="range-input"
                        />
                        <div className="price-values">
                            <span>${priceRange[0]}</span> - <span>{priceRange[1] === 1000 ? "1000 and up" : `$${priceRange[1]}`}</span>
                        </div>
                    </div>
                </div>
                <div className="filter-section sort-by-rating">
                    <h4>Rating</h4>
                    {[5, 4, 3, 2, 1].map(star => (
                        <label key={star} className="star-label">
                            <input
                                type="checkbox"
                                value={star}
                                onChange={() => handleRatingChange(star)}
                            />
                            {'★'.repeat(star)}{'☆'.repeat(5 - star)} 
                        </label>
                    ))}
                </div>
                <div className="filter-section sort-by-brand">
                    <h4>Brand</h4>
                    {uniqueBrands.map(brand => (
                        <label key={brand} className="brand-label">
                            <input
                                type="checkbox"
                                value={brand}
                                onChange={() => handleBrandChange(brand)}
                            />
                            {brand}
                        </label>
                    ))}
                </div>
            </div>
            <div className="products">
                {filteredProducts.map(product => {
                    const originalPrice = (product.price * 1.10).toFixed(2);
                    const discountedPrice = (product.price * 0.90).toFixed(2);
                    const freeDeliveryDate = getDeliveryDate(3);
                    const fastestDeliveryDate = getDeliveryDate(4);

                    return (
                        <div key={product.id} className="product-card">
                            {product.images.length > 0 && <img src={product.images[0].image_url} alt={product.title} />}
                            <div className="product-info">
                                <h2 className="product-name">{product.title}</h2>
                                <div className="product-description">{product.description}</div>
                                <div className="rating">
                                    {'★'.repeat(Math.round(product.rating))}
                                    {'☆'.repeat(5 - Math.round(product.rating))}
                                </div>
                                <div className="price-section">
                                    <span className="sale-price">${product.price}</span>
                                    <span className="original-price">List: ${originalPrice}</span>
                                    <span className="discounted-price">${discountedPrice} with Subscribe & Save discount</span>
                                </div>
                                <div className="primepass-logo-container">
                                    <img src={primePassLogo} alt="PrimePass" className="primepass-logo" />
                                </div>
                                <div className="delivery-info">
                                    <p>FREE delivery: <span className="bold-date">{freeDeliveryDate}</span> on $35 of items shipped by PrimePicks</p>
                                    <p>Or fastest delivery: <span className="bold-date">{fastestDeliveryDate}</span></p>
                                </div>
                                <button className="add-to-cart-button">Add to Cart</button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Categories;



















