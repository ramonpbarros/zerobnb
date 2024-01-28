import { getSpotById } from '../../store/spots';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './SpotDetail.css';
import SpotReviews from '../SpotReviews/SpotReviews';

function SpotDetail() {
  const { spotId } = useParams();
  const dispatch = useDispatch();
  const spot = useSelector((state) => state.spots.spotDetails[spotId]);

  useEffect(() => {
    dispatch(getSpotById(spotId));
  }, [dispatch, spotId]);

  if (!spot) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="container">
        <div>
          <h1 className="title">{spot.name}</h1>
          <p className="city-info">{`${spot.city}, ${spot.state}, ${spot.country}`}</p>
        </div>
        <div className="spot-images-container">
          <div className="large-image">
            {spot.SpotImages.length > 0 && (
              <img
                src={`${spot.SpotImages[spot.SpotImages.length - 1].url}`}
                alt="Large Spot"
              />
            )}
          </div>
          <div className="square-images">
            {spot.SpotImages.slice(0, -1).map((image) => (
              <img key={image.id} src={`${image.url}`} alt="Square Spot" />
            ))}
          </div>
        </div>
        <div className="description-card">
          <div className="description">
            <h2>
              Hosted by {spot.Owner.firstName} {spot.Owner.lastname}
            </h2>
            <p>{spot.description}</p>
          </div>
          <div className="price-card">
            <p>
              <span className="price-text">${spot.price}</span> night
            </p>
            <div className="star-rating">
              <i className="fa-solid fa-star"></i>{' '}
              {spot.avgStarRating == 0 ? (
                <p>new</p>
              ) : (
                <>{spot.avgStarRating.toFixed(1)}</>
              )}
            </div>

            <div className="reviews">
              {spot.numReviews} {spot.numReviews > 1 ? 'reviews' : 'review'}
            </div>
            <button
              className="reserve-btn"
              onClick={() => {
                alert('Feature Coming Soon...');
              }}
            >
              Reserve
            </button>
          </div>
        </div>
        {spot.numReviews > 0 ? (
          <>
            <div className="rating-container">
              <div className="star-rating">
                <h2>
                  <i className="fa-solid fa-star"></i>
                  {spot.avgStarRating == 0 ? (
                    <p>new</p>
                  ) : (
                    <>{spot.avgStarRating.toFixed(1)}</>
                  )}
                </h2>
              </div>
              <h2>&nbsp; &#x2022; &nbsp;</h2>
              <div className="reviews">
                <h2>
                  {spot.numReviews} {spot.numReviews > 1 ? 'reviews' : 'review'}
                </h2>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="rating-container">
              <div className="star-rating">
                <h2>
                  <i className="fa-solid fa-star"></i>
                </h2>
              </div>
              <div className="reviews">
                <h2>New</h2>
              </div>
            </div>
          </>
        )}
      </div>
      <div className="container">
        <SpotReviews id={spot.id} />
      </div>
    </>
  );
}

export default SpotDetail;
