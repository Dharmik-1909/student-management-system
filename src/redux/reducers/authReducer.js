import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  LOGOUT,
  SESSION_EXPIRED,
  CLEAR_AUTH_ERROR,
} from '../actions/authActions';
import { readSession } from '../../utils/session';

const session = readSession();

const initialState = {
  user: session ? session.user : null,
  expiresAt: session ? session.expiresAt : null,
  isAuthenticated: Boolean(session),
  loading: false,
  error: null,
  notice: null,
};

const signedOut = { user: null, expiresAt: null, isAuthenticated: false, loading: false, error: null, notice: null };

export default function authReducer(state = initialState, action) {
  switch (action.type) {
    case LOGIN_REQUEST:
      return { ...state, loading: true, error: null, notice: null };
    case LOGIN_SUCCESS:
      return {
        ...state,
        loading: false,
        isAuthenticated: true,
        user: action.payload.user,
        expiresAt: action.payload.expiresAt,
        error: null,
      };
    case LOGIN_FAILURE:
      return { ...state, loading: false, isAuthenticated: false, error: action.payload };
    case LOGOUT:
      return signedOut;
    case SESSION_EXPIRED:
      return { ...signedOut, notice: 'Your session has expired. Please sign in again.' };
    case CLEAR_AUTH_ERROR:
      return { ...state, error: null };
    default:
      return state;
  }
}
