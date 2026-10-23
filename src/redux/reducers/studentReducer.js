import {
  FETCH_STUDENTS_REQUEST,
  FETCH_STUDENTS_SUCCESS,
  FETCH_STUDENTS_FAILURE,
  FETCH_STUDENT_REQUEST,
  FETCH_STUDENT_SUCCESS,
  FETCH_STUDENT_FAILURE,
  STUDENT_MUTATION_REQUEST,
  STUDENT_MUTATION_FAILURE,
  ADD_STUDENT_SUCCESS,
  UPDATE_STUDENT_SUCCESS,
  DELETE_STUDENT_SUCCESS,
  CLEAR_STUDENT_ERROR,
  CLEAR_STUDENT_MESSAGE,
  CLEAR_SELECTED_STUDENT,
} from '../actions/studentActions';

const initialState = {
  students: [],
  loaded: false, // true once the list has been fetched at least once
  loading: false, // list request in progress
  selectedStudent: null,
  selectedLoading: false, // single-student request in progress
  saving: false, // add / update / delete in progress
  error: null,
  message: null,
};

export default function studentReducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_STUDENTS_REQUEST:
      return { ...state, loading: true, error: null };
    case FETCH_STUDENTS_SUCCESS:
      return { ...state, loading: false, loaded: true, students: action.payload };
    case FETCH_STUDENTS_FAILURE:
      return { ...state, loading: false, error: action.payload };

    case FETCH_STUDENT_REQUEST:
      return { ...state, selectedLoading: true, selectedStudent: null, error: null };
    case FETCH_STUDENT_SUCCESS:
      return { ...state, selectedLoading: false, selectedStudent: action.payload };
    case FETCH_STUDENT_FAILURE:
      return { ...state, selectedLoading: false, selectedStudent: null, error: action.payload };

    case STUDENT_MUTATION_REQUEST:
      return { ...state, saving: true, error: null };
    case STUDENT_MUTATION_FAILURE:
      return { ...state, saving: false, error: action.payload };

    case ADD_STUDENT_SUCCESS:
      return {
        ...state,
        saving: false,
        students: [...state.students, action.payload],
        message: 'Student added successfully.',
      };
    case UPDATE_STUDENT_SUCCESS:
      return {
        ...state,
        saving: false,
        students: state.students.map((s) =>
          String(s.id) === String(action.payload.id) ? action.payload : s
        ),
        selectedStudent: action.payload,
        message: 'Student updated successfully.',
      };
    case DELETE_STUDENT_SUCCESS:
      return {
        ...state,
        saving: false,
        students: state.students.filter((s) => String(s.id) !== String(action.payload)),
        selectedStudent: null,
        message: 'Student deleted successfully.',
      };

    case CLEAR_STUDENT_ERROR:
      return state.error ? { ...state, error: null } : state;
    case CLEAR_STUDENT_MESSAGE:
      return state.message ? { ...state, message: null } : state;
    case CLEAR_SELECTED_STUDENT:
      return state.selectedStudent ? { ...state, selectedStudent: null } : state;
    default:
      return state;
  }
}
