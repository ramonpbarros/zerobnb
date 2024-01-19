import { csrfFetch } from './csrf';

const LOAD_SPOTS = 'spots/LOAD_SPOTS';
const LOAD_SPOT = 'spots/LOAD_SPOT';

const loadSpots = (spotList) => ({
  type: LOAD_SPOTS,
  payload: spotList,
});

const loadSpot = (spot) => ({
  type: LOAD_SPOT,
  payload: spot,
});

export const getAllSpots = () => async (dispatch) => {
  const response = await csrfFetch('/api/spots');
  if (response.ok) {
    const allSpots = await response.json();
    dispatch(loadSpots(allSpots));
    return allSpots;
  }
};

export const getSpotById = (spotId) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/${spotId}`);

  if (response.ok) {
    const spot = await response.json();
    dispatch(loadSpot(spot));
    return spot;
  }
};

const initialState = {
  spotList: [],
  spotDetails: {},
};

const spotReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOAD_SPOTS:
      return {
        ...state,
        spotList: action.payload,
      };
    case LOAD_SPOT:
      return {
        ...state,
        spotDetails: {
          // ...state.spotDetails,
          [action.payload.id]: action.payload,
        },
      };
    default:
      return state;
  }
};

export default spotReducer;
