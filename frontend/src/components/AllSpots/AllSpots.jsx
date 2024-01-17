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
      <h1>All Spots</h1>
      <div className="spot-list">
        {spotArray.map((spot) => {
          return (
            <div key={spot.id} className="tooltip">
              <Link to={`/spots/${spot.id}`}>
                <img alt={spot.name} src={`${spot.previewImage}`} />
              </Link>
              <span className="tooltiptext">{spot.name}</span>
              <div>
                {spot.city}, {spot.state}
              </div>
              <div>${spot.price} night</div>
            </div>
          );
        })}
      </div>
    </>
  );
}

export default AllSpots;
