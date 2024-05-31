import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './Products.css';
import { UserContext } from './App';

const Products = () => {
  const { productId } = useParams();
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [error, setError] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 0, content: '' });

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/api/products/products/${productId}/`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Product not found');
        }
        return response.json();
      })
      .then(data => {
        setProduct(data);
        if (data.images && data.images.length > 0) {
          setSelectedImage(data.images[0].image_url);
        } else {
          setSelectedImage(data.image); 
        }
        setReviews(data.reviews);
      })
      .catch(error => setError(error.message));
  }, [productId]);

  const handleImageClick = (image) => {
    setSelectedImage(image);
  };

  const handleReviewSubmit = () => {
    if (!user) {
      navigate('/login');
      return;
    }

    // Log token information
    console.log('Token:', user.token);

    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${user.token}` // Make sure the token is correctly formatted
      },
      body: JSON.stringify({
        rating: newReview.rating,
        content: newReview.content,
        product: productId,
        user: user.id
      })
    };

    // Log request options for debugging
    console.log('Request Options:', requestOptions);

    fetch('http://127.0.0.1:8000/api/products/reviews/', requestOptions)
      .then(response => {
        if (!response.ok) {
          return response.json().then(data => {
            throw new Error(data.detail || 'Failed to submit review');
          });
        }
        return response.json();
      })
      .then(data => {
        setReviews([...reviews, data]);
        setShowReviewForm(false);
        setNewReview({ rating: 0, content: '' });
      })
      .catch(error => {
        console.error('Error:', error);
        setError(error.message);
      });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewReview(prevState => ({ ...prevState, [name]: value }));
  };

  if (error) {
    return <div>{error}</div>;
  }

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <div className="product-page">
      <div className="product-main">
        <div className="product-image-section">
          <div className="thumbnail-images">
            {product.images && product.images.length > 0 ? (
              product.images.map((img, index) => (
                <img
                  key={index}
                  src={img.image_url}
                  alt={`Thumbnail ${index}`}
                  className={`thumbnail ${selectedImage === img.image_url ? 'selected' : ''}`}
                  onClick={() => handleImageClick(img.image_url)}
                />
              ))
            ) : (
              <img
                src={product.image}
                alt={product.title}
                className={`thumbnail ${selectedImage === product.image ? 'selected' : ''}`}
                onClick={() => handleImageClick(product.image)}
              />
            )}
          </div>
          <div className="product-image">
            <img src={selectedImage} alt={product.title} />
          </div>
        </div>
        <div className="product-info-section">
          <h1>{product.description}</h1>
          <div className="product-rating">
            {Array(Math.round(product.rating)).fill('★').join('')}
            {Array(5 - Math.round(product.rating)).fill('☆').join('')}
            <span>{product.rating}</span>
          </div>
          <div className="product-price">${product.price}</div>
          <div className="product-brand">
            Brand: {product.title}
          </div>
          <div className="product-details">
            <h2>Product details</h2>
            <ul>
              {Object.keys(product.details).map(key => (
                <li key={key}><strong>{key}:</strong> {product.details[key]}</li>
              ))}
            </ul>
          </div>
          <div className="product-about-item">
            <h2>About this item</h2>
            <ul>
              {product.about.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
        <div className="buy-section">
          <div className="buy-box">
            <div className="buy-price">${product.price}</div>
            <div className="buy-delivery">FREE delivery <strong>June 3 - 4</strong>. Details</div>
            <div className="buy-delivery">Or fastest delivery <strong>Monday, June 3</strong>. Order within 12 hrs 8 mins. Details</div>
            <div className="buy-stock">Only 1 left in stock - order soon.</div>
            <button className="buy-button add-to-cart">Add to Cart</button>
            <button className="buy-button buy-now">Buy Now</button>
            <div className="buy-details">
              <p>Ships from <strong>Performance Guarantee</strong></p>
              <p>Sold by <strong>Performance Guarantee</strong></p>
              <p>Returns <strong>Eligible for Return, Refund or Replacement within 30 days of receipt</strong></p>
              <p>Payment <strong>Secure transaction</strong></p>
            </div>
            <button className="buy-button add-to-list">Add to List</button>
          </div>
        </div>
      </div>
      <div className="product-reviews">
        <h2>Customer reviews</h2>
        <div className="review-overview">
          <div className="average-rating">{product.rating} out of 5</div>
          <div className="total-reviews">{reviews.length} global ratings</div>
        </div>
        <div className="reviews-list">
          {reviews.map(review => (
            <div key={review.id} className="review-item">
              <div className="review-header">
                <span className="review-rating">
                  {Array(review.rating).fill('★').join('')}
                  {Array(5 - review.rating).fill('☆').join('')}
                </span>
                <span className="review-user">by {review.user.username}</span>
              </div>
              <div className="review-content">{review.content}</div>
            </div>
          ))}
        </div>
        <div className="review-form">
          <button onClick={() => setShowReviewForm(true)}>Write a customer review</button>
          {showReviewForm && (
            <div className="review-modal">
              <div className="review-modal-content">
                <h3>Write a Review</h3>
                <label>
                  Rating:
                  <select name="rating" value={newReview.rating} onChange={handleInputChange}>
                    {[1, 2, 3, 4, 5].map(star => (
                      <option key={star} value={star}>{star}</option>
                    ))}
                  </select>
                </label>
                <label>
                  Review:
                  <textarea name="content" value={newReview.content} onChange={handleInputChange}></textarea>
                </label>
                <button onClick={handleReviewSubmit}>Submit Review</button>
                <button className="cancel" onClick={() => setShowReviewForm(false)}>Cancel</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;



















