import { csrfFetch } from './csrf';

// Action Types
const LOAD_SPOTS = 'spots/LOAD_SPOTS';

// Action Creators
const loadSpots = (spotList) => ({
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
