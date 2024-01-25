import { csrfFetch } from './csrf';

const LOAD_SPOT_REVIEWS = 'reviews/LOAD_SPOT_REVIEWS';
const CREATE_REVIEW = 'reviews/CREATE_REVIEW';
const DELETE_REVIEW = 'reviews/DELETE_REVIEW';

const loadSpotReviews = (reviewList) => ({
  type: LOAD_SPOT_REVIEWS,
  payload: reviewList,
});

const createReview = (review) => ({
  type: CREATE_REVIEW,
  payload: review,
});

const deleteReview = (reviewId) => ({
  type: DELETE_REVIEW,
  payload: reviewId,
});

export const getReviewsBySpotId = (spotId) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/${spotId}/reviews`);

  if (response.ok) {
    const reviews = await response.json();
    dispatch(loadSpotReviews(reviews));
    return reviews;
  }
};

export const createNewReview =
  ({ review, stars }, spotId) =>
  async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${spotId}/reviews`, {
      method: 'POST',
      body: JSON.stringify({
        review,
        stars,
      }),
    });

    if (response.ok) {
      const review = await response.json();
      dispatch(createReview(review));
      return review;
    }
  };

export const removeReview = (reviewId) => async (dispatch) => {
  const response = await csrfFetch(`/api/reviews/${reviewId}`, {
    method: 'DELETE',
  });

  if (response.ok) {
    return dispatch(deleteReview(response));
  }
};

const initialState = {
  reviewList: [],
  reviews: []
};

let deletedReviewId;
// let updatedReviewList;

const reviewReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOAD_SPOT_REVIEWS:
      return {
        ...state,
        reviewList: action.payload,
      };
    case CREATE_REVIEW:
      return {
        ...state,
        newReview: {
          [action.payload.id]: action.payload,
        },
      };
      case DELETE_REVIEW:
        deletedReviewId = action.payload;
        return {
          ...state,
          reviews: state.reviews.filter((review) => review.id !== deletedReviewId),
        };
    // case DELETE_REVIEW:
    //   return {
    //     ...state,
    //     reviewList: action.payload,
    //   };
    default:
      return state;
  }
};

export default reviewReducer;
