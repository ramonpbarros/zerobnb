import { csrfFetch } from './csrf';

const LOAD_SPOT_REVIEWS = 'reviews/LOAD_SPOT_REVIEWS';

const loadSpotReviews = (reviewList) => ({
  type: LOAD_SPOT_REVIEWS,
  payload: reviewList,
});

export const getReviewsBySpotId = (spotId) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/${spotId}/reviews`);

  if (response.ok) {
    const reviews = await response.json();
    dispatch(loadSpotReviews(reviews));
    return reviews;
  }
};

const initialState = {
  reviewList: [],
};

const reviewReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOAD_SPOT_REVIEWS:
      return {
        ...state,
        reviewList: action.payload,
      };
    default:
      return state;
  }
};

export default reviewReducer;
