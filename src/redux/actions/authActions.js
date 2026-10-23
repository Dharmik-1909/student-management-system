export const LOGIN_REQUEST = 'LOGIN_REQUEST';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAILURE = 'LOGIN_FAILURE';
export const LOGOUT = 'LOGOUT';
export const SESSION_EXPIRED = 'SESSION_EXPIRED';
export const CLEAR_AUTH_ERROR = 'CLEAR_AUTH_ERROR';

export const loginRequest = () => ({ type: LOGIN_REQUEST });
export const loginSuccess = (session) => ({ type: LOGIN_SUCCESS, payload: session });
export const loginFailure = (error) => ({ type: LOGIN_FAILURE, payload: error });
export const logoutAction = () => ({ type: LOGOUT });
export const sessionExpired = () => ({ type: SESSION_EXPIRED });
export const clearAuthError = () => ({ type: CLEAR_AUTH_ERROR });
