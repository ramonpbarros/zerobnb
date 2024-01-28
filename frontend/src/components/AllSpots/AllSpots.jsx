import { getAllSpots } from '../../store/spots';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import './AllSpots.css';

function AllSpots() {
  const allSpots = useSelector((state) => state.spots);
  const dispatch = useDispatch();
  const spotArray = allSpots.spotList.Spots || [];

  useEffect(() => {
    dispatch(getAllSpots());
  }, [dispatch]);

  return (
    <>
      <div className="spot-list">
        {spotArray.map((spot) => {
          return (
            <div key={spot.id} className="tooltip">
              <Link to={`/spots/${spot.id}`}>
                <img alt={spot.name} src={`${spot.previewImage}`} />
              </Link>
              <span className="tooltiptext">{spot.name}</span>
              <div className="card-container">
                <div className="row">
                  <div className="left">
                    <p>
                      {spot.city}, {spot.state}
                    </p>{' '}
                    <p>
                      <strong>${spot.price}</strong> night
                    </p>
                  </div>
                  <div className="right">
                    <div className="star-rating">
                      <i className="fa-solid fa-star"></i>
                      {spot.avgRating == 0 ? (
                        <p>new</p>
                      ) : (
                        <>{spot.avgRating.toFixed(1)}</>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

export default AllSpots;
