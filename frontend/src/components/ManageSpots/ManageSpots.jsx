import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getSpotsByCurrentUser } from '../../store/spots';
import { Link } from 'react-router-dom';
import './ManageSpots.css';

export default function ManageSpots() {
  const allSpots = useSelector((state) => state.spots);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getSpotsByCurrentUser());
  }, [dispatch]);

  if (!allSpots.spots) {
    return <div>Loading...</div>;
  }

  const spotArray = allSpots.spots.Spots || [];

  return (
    <>
      <div className="container">
        <h1>Manage Your Spots</h1>
        {!spotArray.length ? (
          <Link to="/spots/new" className="create-spot-btn">
            Create a New Spot
          </Link>
        ) : (
          <div className="spot-list">
            {spotArray.map((spot) => {
              return (
                <div key={spot.id}>
                  <Link to={`/spots/${spot.id}`}>
                    <img
                      className="img-zoom"
                      alt={spot.name}
                      src={`${spot.previewImage}`}
                    />
                  </Link>
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
                        <i className="fa-solid fa-star"></i>
                        {spot.avgRating}
                      </div>
                    </div>
                  </div>
                  <div className="btns">
                    <Link className="update-btn" to={`/spots/${spot.id}/edit`}>
                      Update
                    </Link>
                    <button className="delete-btn">Delete</button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
