import api from '../../api/client';
import { saveSession, clearSession } from '../../utils/session';
import { describeError } from '../../utils/errors';
import { loginRequest, loginSuccess, loginFailure, logoutAction, sessionExpired } from '../actions/authActions';

export const login = (username, password) => async (dispatch) => {
  dispatch(loginRequest());
  try {
    const { data } = await api.post('/auth/login', { username, password });
    const session = { token: data.token, user: data.user, expiresAt: data.expiresAt };
    saveSession(session);
    dispatch(loginSuccess(session));
    return true;
  } catch (err) {
    dispatch(loginFailure(describeError(err, 'Could not sign in. Please try again.')));
    return false;
  }
};

export const logout = () => (dispatch) => {
  clearSession();
  dispatch(logoutAction());
};

export const expireSession = () => (dispatch) => {
  clearSession();
  dispatch(sessionExpired());
};
