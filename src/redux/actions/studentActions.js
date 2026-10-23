export const FETCH_STUDENTS_REQUEST = 'FETCH_STUDENTS_REQUEST';
export const FETCH_STUDENTS_SUCCESS = 'FETCH_STUDENTS_SUCCESS';
export const FETCH_STUDENTS_FAILURE = 'FETCH_STUDENTS_FAILURE';

export const FETCH_STUDENT_REQUEST = 'FETCH_STUDENT_REQUEST';
export const FETCH_STUDENT_SUCCESS = 'FETCH_STUDENT_SUCCESS';
export const FETCH_STUDENT_FAILURE = 'FETCH_STUDENT_FAILURE';

export const STUDENT_MUTATION_REQUEST = 'STUDENT_MUTATION_REQUEST';
export const STUDENT_MUTATION_FAILURE = 'STUDENT_MUTATION_FAILURE';

export const ADD_STUDENT_SUCCESS = 'ADD_STUDENT_SUCCESS';
export const UPDATE_STUDENT_SUCCESS = 'UPDATE_STUDENT_SUCCESS';
export const DELETE_STUDENT_SUCCESS = 'DELETE_STUDENT_SUCCESS';

export const CLEAR_STUDENT_ERROR = 'CLEAR_STUDENT_ERROR';
export const CLEAR_STUDENT_MESSAGE = 'CLEAR_STUDENT_MESSAGE';
export const CLEAR_SELECTED_STUDENT = 'CLEAR_SELECTED_STUDENT';

export const fetchStudentsRequest = () => ({ type: FETCH_STUDENTS_REQUEST });
export const fetchStudentsSuccess = (students) => ({ type: FETCH_STUDENTS_SUCCESS, payload: students });
export const fetchStudentsFailure = (error) => ({ type: FETCH_STUDENTS_FAILURE, payload: error });

export const fetchStudentRequest = () => ({ type: FETCH_STUDENT_REQUEST });
export const fetchStudentSuccess = (student) => ({ type: FETCH_STUDENT_SUCCESS, payload: student });
export const fetchStudentFailure = (error) => ({ type: FETCH_STUDENT_FAILURE, payload: error });

export const studentMutationRequest = () => ({ type: STUDENT_MUTATION_REQUEST });
export const studentMutationFailure = (error) => ({ type: STUDENT_MUTATION_FAILURE, payload: error });

export const addStudentSuccess = (student) => ({ type: ADD_STUDENT_SUCCESS, payload: student });
export const updateStudentSuccess = (student) => ({ type: UPDATE_STUDENT_SUCCESS, payload: student });
export const deleteStudentSuccess = (id) => ({ type: DELETE_STUDENT_SUCCESS, payload: id });

export const clearStudentError = () => ({ type: CLEAR_STUDENT_ERROR });
export const clearStudentMessage = () => ({ type: CLEAR_STUDENT_MESSAGE });
export const clearSelectedStudent = () => ({ type: CLEAR_SELECTED_STUDENT });
