import { csrfFetch } from './csrf';

// Action Types
const LOAD_SPOTS = 'spots/LOAD_SPOTS';

// Action Creators
const loadSpots = (spotList) => ({
  type: LOAD_SPOTS,
  payload: spotList,
});

const loadSpot = (spotList) => ({
  type: LOAD_SPOTS,
  payload: spotList,
});

// Thunk Action to Get All Spots
export const getAllSpots = () => async (dispatch) => {
  const response = await csrfFetch('/api/spots');
  if (response.ok) {
    const allSpots = await response.json();
    dispatch(loadSpots(allSpots));
    return allSpots;
  }
};

// Thunk Action to Get Spot by ID
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
};

// Reducer
const spotReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOAD_SPOTS:
      return {
        ...state,
        spotList: action.payload,
      };

    default:
      return state;
  }
};

export default spotReducer;
