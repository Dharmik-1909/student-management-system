import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStudentById, deleteStudent } from '../redux/thunks/studentThunks';
import { clearSelectedStudent, clearStudentError } from '../redux/actions/studentActions';
import ConfirmDialog from './ConfirmDialog';
import StudentThumb from './StudentThumb';

export default function StudentDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { selectedStudent, selectedLoading, saving, error } = useSelector((state) => state.students);
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    dispatch(fetchStudentById(id));
    return () => {
      dispatch(clearSelectedStudent());
      dispatch(clearStudentError());
    };
  }, [id, dispatch]);

  const student = selectedStudent && String(selectedStudent.id) === id ? selectedStudent : null;

  const handleDelete = async () => {
    const ok = await dispatch(deleteStudent(id));
    setConfirming(false);
    if (ok) navigate('/students');
  };

  if (!student && error) {
    return (
      <div className="container page-container py-4">
        <div className="alert alert-danger" role="alert">{error}</div>
        <Link to="/students" className="btn btn-outline-secondary">Back to student list</Link>
      </div>
    );
  }

  if (!student || selectedLoading) {
    return (
      <div className="container page-container py-5 text-center" role="status">
        <div className="spinner-border text-primary" aria-hidden="true" />
        <p className="mt-2 text-muted-sms">Loading student…</p>
      </div>
    );
  }

  const fields = [
    ['Roll number', student.rollNumber],
    ['Class', student.class],
    ['Email', student.email],
    ['Phone', student.phone],
    ['Age', student.age],
    ['Grade', student.grade],
    ['Marks', student.marks],
  ];

  return (
    <div className="container page-container py-4">
      {error && <div className="alert alert-danger" role="alert">{error}</div>}
      <div className="content-card">
        <div className="d-flex align-items-center gap-3 mb-3">
          <StudentThumb student={student} large />
          <div>
            <h1 className="h4 mb-1">{student.name}</h1>
            <span className="text-muted-sms">{student.class} · Roll {student.rollNumber}</span>
          </div>
        </div>

        <dl className="row mb-4">
          {fields.map(([label, value]) => (
            <React.Fragment key={label}>
              <dt className="col-sm-3 text-muted-sms fw-normal">{label}</dt>
              <dd className="col-sm-9">{value === '' || value === undefined ? '—' : value}</dd>
            </React.Fragment>
          ))}
        </dl>

        <div className="d-flex flex-wrap gap-2">
          <Link to={`/students/${encodeURIComponent(student.id)}/edit`} className="btn btn-primary">Edit</Link>
          <button type="button" className="btn btn-outline-danger" onClick={() => setConfirming(true)} disabled={saving}>
            Delete
          </button>
          <Link to="/students" className="btn btn-outline-secondary ms-sm-auto">Back to list</Link>
        </div>
      </div>

      {confirming && (
        <ConfirmDialog
          title="Delete student"
          busy={saving}
          onConfirm={handleDelete}
          onCancel={() => setConfirming(false)}
        >
          Delete <strong>{student.name}</strong> (roll {student.rollNumber})? This cannot be undone.
        </ConfirmDialog>
      )}
    </div>
  );
}
