import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { getReviewsBySpotId } from '../../store/reviews';
import './SpotReviews.css';

function SpotReviews({ id }) {
  const dispatch = useDispatch();
  const reviews = useSelector((state) => state.reviews.reviewList);
  const reviewArray = reviews.Reviews || [];

  useEffect(() => {
    dispatch(getReviewsBySpotId(id));
  }, [dispatch, id]);

  if (!reviews) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {reviewArray.map((review) => (
        <>
          <div className="reviews-list">
            <div className="first-name">
              <p>{review.User.firstName}</p>
            </div>
            <div>
              <p className="date">
                {review.createdAt.slice(5, 7) === '01'
                  ? 'January'
                  : review.createdAt.slice(5, 7) === '02'
                  ? 'February'
                  : review.createdAt.slice(5, 7) === '03'
                  ? 'March'
                  : review.createdAt.slice(5, 7) === '04'
                  ? 'April'
                  : review.createdAt.slice(5, 7) === '05'
                  ? 'May'
                  : review.createdAt.slice(5, 7) === '06'
                  ? 'June'
                  : review.createdAt.slice(5, 7) === '07'
                  ? 'July'
                  : review.createdAt.slice(5, 7) === '08'
                  ? 'August'
                  : review.createdAt.slice(5, 7) === '09'
                  ? 'September'
                  : review.createdAt.slice(5, 7) === '10'
                  ? 'October'
                  : review.createdAt.slice(5, 7) === '11'
                  ? 'November'
                  : 'December'}{' '}
                {review.createdAt.slice(0, 4)}{' '}
              </p>
            </div>
            <p>{review.review}</p>
          </div>
        </>
      ))}
    </>
  );
}
export default SpotReviews;
