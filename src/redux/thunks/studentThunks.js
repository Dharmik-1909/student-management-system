import api from '../../api/client';
import { describeError, isUnauthorized } from '../../utils/errors';
import { expireSession } from './authThunks';
import {
  fetchStudentsRequest,
  fetchStudentsSuccess,
  fetchStudentsFailure,
  fetchStudentRequest,
  fetchStudentSuccess,
  fetchStudentFailure,
  studentMutationRequest,
  studentMutationFailure,
  addStudentSuccess,
  updateStudentSuccess,
  deleteStudentSuccess,
} from '../actions/studentActions';

const url = (id) => `/students/${encodeURIComponent(id)}`;

function handleFailure(dispatch, err, failureAction, fallback) {
  if (isUnauthorized(err)) {
    dispatch(expireSession());
    return;
  }
  dispatch(failureAction(describeError(err, fallback)));
}

export const fetchStudents = () => async (dispatch) => {
  dispatch(fetchStudentsRequest());
  try {
    const { data } = await api.get('/students');
    dispatch(fetchStudentsSuccess(data));
  } catch (err) {
    handleFailure(dispatch, err, fetchStudentsFailure, 'Could not load students.');
  }
};

export const fetchStudentById = (id) => async (dispatch) => {
  dispatch(fetchStudentRequest());
  try {
    const { data } = await api.get(url(id));
    dispatch(fetchStudentSuccess(data));
  } catch (err) {
    handleFailure(dispatch, err, fetchStudentFailure, 'Could not load this student.');
  }
};

// The Redux store is updated only after the API confirms the change.
// Each mutation resolves to true on success so components can navigate.
export const addStudent = (student) => async (dispatch) => {
  dispatch(studentMutationRequest());
  try {
    const { data } = await api.post('/students', student);
    dispatch(addStudentSuccess(data));
    return true;
  } catch (err) {
    handleFailure(dispatch, err, studentMutationFailure, 'Could not add the student.');
    return false;
  }
};

export const updateStudent = (id, student) => async (dispatch) => {
  dispatch(studentMutationRequest());
  try {
    const { data } = await api.put(url(id), student);
    dispatch(updateStudentSuccess(data));
    return true;
  } catch (err) {
    handleFailure(dispatch, err, studentMutationFailure, 'Could not update the student.');
    return false;
  }
};

export const deleteStudent = (id) => async (dispatch) => {
  dispatch(studentMutationRequest());
  try {
    await api.delete(url(id));
    dispatch(deleteStudentSuccess(id));
    return true;
  } catch (err) {
    handleFailure(dispatch, err, studentMutationFailure, 'Could not delete the student.');
    return false;
  }
};
