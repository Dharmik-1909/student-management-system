import { combineReducers } from 'redux';
import studentReducer from './studentReducer';
import authReducer from './authReducer';
import { LOGOUT, SESSION_EXPIRED } from '../actions/authActions';

const appReducer = combineReducers({
  students: studentReducer,
  auth: authReducer,
});

// Drop cached student data whenever the admin signs out or the session expires.
export default function rootReducer(state, action) {
  if (state && (action.type === LOGOUT || action.type === SESSION_EXPIRED)) {
    state = { ...state, students: undefined };
  }
  return appReducer(state, action);
}
