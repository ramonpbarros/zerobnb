import { csrfFetch } from './csrf';

const LOGIN_USER = 'session/LOGIN_USER';
const LOGOUT_USER = 'session/LOGOUT_USER';

const initialState = {
  user: null,
};

export default function sessionReducer(state = initialState, action) {
  switch (action.type) {
    case LOGIN_USER:
      return { ...state, user: action.payload };
    case LOGOUT_USER:
      return { ...state, user: null };
    default:
      return state;
  }
}

export const loginUser = (user) => ({
  type: LOGIN_USER,
  payload: user,
});

export const logoutUser = () => ({
  type: LOGOUT_USER,
});

export const login =
  ({ credential, password }) =>
  async (dispatch) => {
    const response = await csrfFetch('/api/session', {
      method: 'POST',
      body: JSON.stringify({ credential, password }),
    });

    if (response.ok) {
      const user = await response.json();
      dispatch(loginUser(user));
    }
  };
