import { csrfFetch } from './csrf';

// Action Types
const SET_USER = 'session/SET_USER';
const REMOVE_USER = 'session/REMOVE_USER';

// Action Creators
const setUser = (user) => ({
  type: SET_USER,
  payload: user,
});

const removeUser = () => ({
  type: REMOVE_USER,
});

// Thunk Action to Restore User Session
export const restoreUser = () => async (dispatch) => {
  const response = await csrfFetch("/api/session");
  const data = await response.json();
  dispatch(setUser(data.user));
  return response;
};

// Thunk Action for Login
export const login = ({ credential, password }) => async (dispatch) => {
  const response = await csrfFetch('/api/session', {
    method: 'POST',
    body: JSON.stringify({ credential, password }),
  });

  if (response.ok) {
    const user = await response.json();
    dispatch(setUser(user));
  }
};

// Reducer
const initialState = {
  user: null,
};

export default function sessionReducer(state = initialState, action) {
  switch (action.type) {
    case SET_USER:
      return { ...state, user: action.payload };
    case REMOVE_USER:
      return { ...state, user: null };

    default:
      return state;
  }
}
