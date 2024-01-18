import { getSpotById } from '../../store/spots';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './SpotDetail.css'

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

  console.log('spot:', spot);

  return (
    <div className='container'>
      <h1>{spot.name}</h1>
      <div>{`${spot.city}, ${spot.state}, ${spot.country}`}</div>
      <div>
        {spot.SpotImages.length > 0 && (
          <img src={`${spot.SpotImages[0].url}`} alt="" />
        )}
      </div>
      <h2>
        Hosted by {spot.Owner.firstName} {spot.Owner.lastname}
      </h2>
      <p>{spot.description}</p>
    </div>
  );
}

export default SpotDetail;
