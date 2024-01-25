import { useState } from 'react';
import './PostReviewModal.css';
import { useModal } from '../../context/Modal';
import { useDispatch } from 'react-redux';
import { createNewReview, getReviewsBySpotId } from '../../store/reviews';
import { getSpotById } from '../../store/spots';

export default function PostReviewModal({ spotId }) {
  const dispatch = useDispatch();
  const [review, setReview] = useState('');
  const [stars, setStars] = useState(0);
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const handleRadioChange = (e) => {
    setStars(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setErrors({});

    return dispatch(createNewReview({ review, stars }, spotId))
      .then(() => {
        dispatch(getSpotById(spotId));
        dispatch(getReviewsBySpotId(spotId));
        closeModal();
      })
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.message) {
          setErrors(data);
        }
      });
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="review-form">
        <h2 className="title">How was your Stay?</h2>
        {errors.message && <p className="error">{errors.message}</p>}
        <textarea
          value={review}
          cols="50"
          rows="8"
          className="textarea"
          placeholder=" Leave your review here..."
          onChange={(e) => setReview(e.target.value)}
        ></textarea>
        <div className="stars">
          <div className="rating">
            <label>
              <input
                type="radio"
                name="stars"
                value={1}
                onChange={handleRadioChange}
              />
              <span className="icon">★</span>
            </label>
            <label>
              <input
                type="radio"
                name="stars"
                value={2}
                onChange={handleRadioChange}
              />
              <span className="icon">★</span>
              <span className="icon">★</span>
            </label>
            <label>
              <input
                type="radio"
                name="stars"
                value={3}
                onChange={handleRadioChange}
              />
              <span className="icon">★</span>
              <span className="icon">★</span>
              <span className="icon">★</span>
            </label>
            <label>
              <input
                type="radio"
                name="stars"
                value={4}
                onChange={handleRadioChange}
              />
              <span className="icon">★</span>
              <span className="icon">★</span>
              <span className="icon">★</span>
              <span className="icon">★</span>
            </label>
            <label>
              <input
                type="radio"
                name="stars"
                value={5}
                onChange={handleRadioChange}
              />
              <span className="icon">★</span>
              <span className="icon">★</span>
              <span className="icon">★</span>
              <span className="icon">★</span>
              <span className="icon">★</span>
            </label>
          </div>
          <p className="stars-string">Stars</p>
        </div>
        <div className="btn">
          <button
            className="submit-review-btn"
            type="submit"
            disabled={review.length < 10 || stars < 1}
          >
            Submit your Review
          </button>
        </div>
      </form>
    </>
  );
}
