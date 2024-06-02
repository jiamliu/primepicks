import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './Products.css';
import { UserContext } from './App';

const profilePictureUrl = 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Windows_10_Default_Profile_Picture.svg/1024px-Windows_10_Default_Profile_Picture.svg.png?20221210150350';

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

  const handleReviewSubmit = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    const accessToken = localStorage.getItem('token');
    console.log("Access Token from Local Storage: ", accessToken);

    if (!accessToken) {
      console.error('No token found, please login again');
      navigate('/login');
      return;
    }

    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      body: JSON.stringify({
        rating: newReview.rating,
        content: newReview.content,
        product: productId,
      }),
    };

    try {
      let response = await fetch('http://127.0.0.1:8000/api/products/reviews/', requestOptions);
      console.log("Review Submit Response Status: ", response.status);
      if (response.status === 401) {
        console.error('Unauthorized, token might be expired');
        navigate('/login');
        return;
      }
      if (!response.ok) {
        throw new Error('Failed to submit review');
      }
      const data = await response.json();
      setReviews([...reviews, data]);
      setShowReviewForm(false);
      setNewReview({ rating: 0, content: '' });
    } catch (error) {
      setError(error.message);
    }
  };


  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewReview(prevState => ({ ...prevState, [name]: value }));
  };



  const calculateAverageRating = (reviews) => {
    if (reviews.length === 0) return 0;
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    return (totalRating / reviews.length).toFixed(1);
  };



  const calculateRatingPercentages = (reviews) => {
    const totalReviews = reviews.length;
    const starCounts = [1, 0, 0, 0, 0]; 
    reviews.forEach(review => {
      starCounts[review.rating - 1]++;
    });

    return starCounts.map(count => ((count / totalReviews) * 100).toFixed(1));
  };

  const averageRating = calculateAverageRating(reviews);
  const ratingPercentages = calculateRatingPercentages(reviews);



  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    
    return (
      <>
        {Array(fullStars).fill().map((_, i) => <span key={`full-${i}`} className="star">★</span>)}
        {halfStar && <span className="star half">★</span>}
        {Array(emptyStars).fill().map((_, i) => <span key={`empty-${i}`} className="star empty">★</span>)}
      </>
    );
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
            {renderStars(averageRating)}
            <span>{averageRating}</span>
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
      <div className="review-section">
        <div className="customer-review-summary">
          <h2>Customer Reviews</h2>
          <div className="average-rating-summary">
            <span className="star-summary">{renderStars(averageRating)}</span>
            <span>{averageRating} out of 5</span>
          </div>
          <div>{reviews.length} global ratings</div>
          <div className="rating-breakdown">
            {[5, 4, 3, 2, 1].map(star => (
              <div key={star} className="rating-row">
                <span>{star} star</span>
                <div className="rating-bar">
                  <div
                    className="filled-bar"
                    style={{ width: `${ratingPercentages[star - 1]}%` }}
                  ></div>
                </div>
                <span>{ratingPercentages[star - 1]}%</span>
              </div>
            ))}
          </div>
        </div>
        <div className="product-reviews">
          <h2>Top Reviews</h2>
          <div className="reviews-list">
            {reviews.map(review => (
              <div key={review.id} className="review-item">
                <div className="review-header">
                  <div className="profile-picture" style={{ backgroundImage: `url(${profilePictureUrl})` }}></div>
                  <div className="review-user-details">
                    <span className="review-user">{review.user}</span>
                    <span className="review-rating">
                      {renderStars(review.rating)}
                    </span>
                    <span className="review-date">Reviewed on {new Date(review.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="review-content">{review.content}</div>
                <div className="review-purchase">Verified Purchase</div>
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
                  <button onClick={() => setShowReviewForm(false)}>Cancel</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;

