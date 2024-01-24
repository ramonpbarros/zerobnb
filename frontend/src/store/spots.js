import { csrfFetch } from './csrf';

const LOAD_SPOTS = 'spots/LOAD_SPOTS';
const LOAD_SPOT = 'spots/LOAD_SPOT';
const LOAD_SPOTS_CURRENT_USER = 'spots/LOAD_SPOTS_CURRENT_USER';
const CREATE_SPOT = 'spots/CREATE_SPOT';
const ADD_SPOT_IMAGE = 'spots/ADD_SPOT_IMAGE';
const UPDATE_SPOT = 'spots/UPDATE_SPOT';

const loadSpots = (spotList) => ({
  type: LOAD_SPOTS,
  payload: spotList,
});

const loadSpot = (spot) => ({
  type: LOAD_SPOT,
  payload: spot,
});

const loadSpotsCurrentUser = (spots) => ({
  type: LOAD_SPOTS_CURRENT_USER,
  payload: spots,
});

const createSpot = (spot) => ({
  type: CREATE_SPOT,
  payload: spot,
});

const addSpotImage = (image) => ({
  type: ADD_SPOT_IMAGE,
  payload: image,
});

const updateSpot = (spot) => ({
  type: UPDATE_SPOT,
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

export const getSpotsByCurrentUser = () => async (dispatch) => {
  const response = await csrfFetch('/api/spots/current');

  if (response.ok) {
    const spots = await response.json();
    dispatch(loadSpotsCurrentUser(spots));
    return spots;
  }
};

export const createNewSpot =
  ({
    id,
    ownerId,
    address,
    city,
    state,
    country,
    lat,
    lng,
    name,
    description,
    price,
  }) =>
  async (dispatch) => {
    const response = await csrfFetch('/api/spots', {
      method: 'POST',
      body: JSON.stringify({
        id,
        ownerId,
        address,
        city,
        state,
        country,
        lat,
        lng,
        name,
        description,
        price,
      }),
    });

    if (response.ok) {
      const spot = await response.json();
      dispatch(createSpot(spot));
      return spot;
    }
  };

export const addNewSpotImage =
  ({ url, preview }, spotId) =>
  async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${spotId}/images`, {
      method: 'POST',
      body: JSON.stringify({
        url,
        preview,
      }),
    });

    if (response.ok) {
      const image = await response.json();
      dispatch(addSpotImage(image));
      return image;
    }
  };

export const editSpot =
  (
    { address, city, state, country, lat, lng, name, description, price },
    spotId
  ) =>
  async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${spotId}`, {
      method: 'PUT',
      body: JSON.stringify({
        address,
        city,
        state,
        country,
        lat,
        lng,
        name,
        description,
        price,
      }),
    });

    if (response.ok) {
      const spot = await response.json();
      dispatch(updateSpot(spot));
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
          [action.payload.id]: action.payload,
        },
      };
    case LOAD_SPOTS_CURRENT_USER:
      return {
        ...state,
        spots: action.payload,
      };
    case CREATE_SPOT:
      return {
        ...state,
        newSpot: {
          [action.payload.id]: action.payload,
        },
      };
    case ADD_SPOT_IMAGE:
      return {
        ...state,
        newImage: {
          ...state.newImage,
          [action.payload.id]: action.payload,
        },
      };
      case UPDATE_SPOT:
        return {
          ...state,
          updatedSpot: {
            [action.payload.id]: action.payload,
          },
        };
    default:
      return state;
  }
};

export default spotReducer;
