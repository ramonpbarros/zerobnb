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
    console.log('all spots: ', allSpots, 'spotarray: ', spotArray);
  }, [dispatch]);

  return (
    <>
      <div className="spot-list">
        {spotArray.map((spot) => {
          console.log('spot: ', spot);
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
                    <p><strong>${spot.price}</strong> night</p>
                  </div>
                  <div className="right">
                    <i className="fa-solid fa-star"></i>
                    {spot.avgRating}
                  </div>
                </div>
                {/* <div>
                  {spot.city}, {spot.state}
                </div>
                <div>
                  <i className="fa-solid fa-star"></i>
                  {spot.avgRating}
                </div>
                <div>${spot.price} night</div> */}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

export default AllSpots;
