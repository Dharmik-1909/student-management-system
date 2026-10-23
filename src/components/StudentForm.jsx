import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addStudent, updateStudent, fetchStudentById, fetchStudents } from '../redux/thunks/studentThunks';
import { clearSelectedStudent, clearStudentError } from '../redux/actions/studentActions';
import { emptyStudent, toFormValues, toPayload, validateStudent } from '../utils/validation';
import { getClasses } from '../utils/studentFilters';

const FIELDS = [
  { name: 'name', label: 'Name', type: 'text', autoComplete: 'off' },
  { name: 'rollNumber', label: 'Roll number', type: 'text', autoComplete: 'off' },
  { name: 'class', label: 'Class', type: 'text', list: 'class-options', autoComplete: 'off' },
  { name: 'grade', label: 'Grade', type: 'text', autoComplete: 'off' },
  { name: 'email', label: 'Email', type: 'email', autoComplete: 'off' },
  { name: 'phone', label: 'Phone', type: 'tel', autoComplete: 'off' },
  { name: 'age', label: 'Age', type: 'number', min: 3, max: 100, step: 1 },
  { name: 'marks', label: 'Marks (0–100)', type: 'number', min: 0, max: 100, step: 'any' },
  { name: 'image', label: 'Image URL (optional)', type: 'url', wide: true, autoComplete: 'off' },
];

export default function StudentForm({ mode }) {
  const isEdit = mode === 'edit';
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { students, loaded, selectedStudent, saving, error } = useSelector((state) => state.students);

  const [values, setValues] = useState(emptyStudent);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    dispatch(clearStudentError());
    if (!loaded) dispatch(fetchStudents()); // needed for the roll-number uniqueness check
    if (isEdit) dispatch(fetchStudentById(id));
    else dispatch(clearSelectedStudent());
    return () => {
      dispatch(clearSelectedStudent());
      dispatch(clearStudentError());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, isEdit, dispatch]);

  const current = isEdit && selectedStudent && String(selectedStudent.id) === id ? selectedStudent : null;

  useEffect(() => {
    if (current) setValues(toFormValues(current));
  }, [current]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((v) => ({ ...v, [name]: value }));
    if (errors[name]) setErrors((errs) => ({ ...errs, [name]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const found = validateStudent(values, students, isEdit ? id : null);
    setErrors(found);
    if (Object.keys(found).length) {
      const first = FIELDS.find((f) => found[f.name]);
      if (first) document.getElementById(`field-${first.name}`)?.focus();
      return;
    }
    const payload = toPayload(values);
    const ok = isEdit
      ? await dispatch(updateStudent(id, { ...current, ...payload }))
      : await dispatch(addStudent(payload));
    if (ok) navigate('/students');
  };

  if (isEdit && !current && error) {
    return (
      <div className="container page-container py-4">
        <div className="alert alert-danger" role="alert">{error}</div>
        <Link to="/students" className="btn btn-outline-secondary">Back to student list</Link>
      </div>
    );
  }

  if (isEdit && !current) {
    return (
      <div className="container page-container py-5 text-center" role="status">
        <div className="spinner-border text-primary" aria-hidden="true" />
        <p className="mt-2 text-muted-sms">Loading student…</p>
      </div>
    );
  }

  return (
    <div className="container page-container py-4">
      <h1 className="h4 mb-3">{isEdit ? 'Edit student' : 'Add student'}</h1>
      <div className="content-card">
        {error && <div className="alert alert-danger" role="alert">{error}</div>}

        <form onSubmit={handleSubmit} noValidate>
          <div className="row g-3">
            {FIELDS.map(({ name, label, wide, ...input }) => (
              <div className={wide ? 'col-12' : 'col-md-6'} key={name}>
                <label htmlFor={`field-${name}`} className="form-label">{label}</label>
                <input
                  id={`field-${name}`}
                  name={name}
                  className={`form-control${errors[name] ? ' is-invalid' : ''}`}
                  value={values[name]}
                  onChange={handleChange}
                  aria-invalid={Boolean(errors[name])}
                  aria-describedby={errors[name] ? `error-${name}` : undefined}
                  {...input}
                />
                {errors[name] && (
                  <div className="invalid-feedback" id={`error-${name}`}>{errors[name]}</div>
                )}
              </div>
            ))}
          </div>
          <datalist id="class-options">
            {getClasses(students).map((c) => <option key={c} value={c} />)}
          </datalist>

          <div className="d-flex gap-2 mt-4">
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving && <span className="spinner-border spinner-border-sm me-2" aria-hidden="true" />}
              {isEdit ? 'Save changes' : 'Add student'}
            </button>
            <Link to="/students" className="btn btn-outline-secondary">Cancel</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
