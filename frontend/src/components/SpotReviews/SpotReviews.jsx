import './SpotReviews.css';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getReviewsBySpotId } from '../../store/reviews';
import { getSpotById } from '../../store/spots';
import OpenReviewModalButton from '../OpenReviewModalButton';
import PostReviewModal from '../PostReviewModal';
import OpenDeleteModalButton from '../OpenDeleteModalButton';
import DeleteModal from '../DeleteModal';

function SpotReviews({ id }) {
  const { spotId } = useParams();
  const dispatch = useDispatch();
  const reviews = useSelector((state) => state.reviews.reviewList);
  const sessionUser = useSelector((state) => state.session.user);
  const spot = useSelector((state) => state.spots.spotDetails[spotId]);
  const reviewArray = reviews.Reviews || [];

  useEffect(() => {
    dispatch(getReviewsBySpotId(id));
    dispatch(getSpotById(spotId));
  }, [dispatch, id, spotId]);

  if (!reviews) {
    return <div>Loading...</div>;
  }

  let userHasReview;

  reviewArray.forEach((review) => {
    if (sessionUser && sessionUser.id == review.userId) {
      userHasReview = false;
    } else {
      userHasReview = true;
    }
  });

  const userCreatedSpot = sessionUser && sessionUser.id === spot.ownerId;

  return (
    <>
      {sessionUser && userHasReview && userCreatedSpot && (
        <OpenReviewModalButton
          buttonText="Post Your Review"
          modalComponent={<PostReviewModal spotId={spot.id} />}
        />
      )}
      {reviewArray
        .slice()
        .reverse()
        .map((review) => (
          <>
            <div className="reviews-list" key={review.id}>
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
              {sessionUser && review.userId === sessionUser.id && (
                <OpenDeleteModalButton
                  buttonText="Delete"
                  modalComponent={<DeleteModal reviewId={review.id} />}
                />
              )}
            </div>
          </>
        ))}
    </>
  );
}
export default SpotReviews;
