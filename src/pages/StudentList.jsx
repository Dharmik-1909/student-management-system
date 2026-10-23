import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStudents, deleteStudent } from '../redux/thunks/studentThunks';
import { clearStudentError, clearStudentMessage } from '../redux/actions/studentActions';
import { SORT_OPTIONS, filterAndSortStudents, getClasses } from '../utils/studentFilters';
import StudentRow from '../components/StudentRow';
import ConfirmDialog from '../components/ConfirmDialog';

export default function StudentList() {
  const dispatch = useDispatch();
  const { students, loaded, loading, saving, error, message } = useSelector((state) => state.students);

  const [search, setSearch] = useState('');
  const [className, setClassName] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [toDelete, setToDelete] = useState(null);

  useEffect(() => {
    dispatch(fetchStudents());
    return () => {
      dispatch(clearStudentError());
    };
  }, [dispatch]);

  // Success messages fade out on their own.
  useEffect(() => {
    if (!message) return undefined;
    const timer = setTimeout(() => dispatch(clearStudentMessage()), 4000);
    return () => clearTimeout(timer);
  }, [message, dispatch]);

  const classes = useMemo(() => getClasses(students), [students]);
  const activeClass = classes.includes(className) ? className : '';

  const visible = useMemo(
    () => filterAndSortStudents(students, { search, className: activeClass, sortBy }),
    [students, search, activeClass, sortBy]
  );

  const filtersActive = Boolean(search.trim() || activeClass);
  const clearFilters = () => {
    setSearch('');
    setClassName('');
  };

  const confirmDelete = async () => {
    await dispatch(deleteStudent(toDelete.id));
    setToDelete(null);
  };

  return (
    <div className="container page-container py-4">
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3">
        <div>
          <h1 className="h4 mb-1">Students</h1>
          <span className="text-muted-sms">
            Total students: <strong className="text-body">{students.length}</strong>
            {loaded && filtersActive && <> · Showing {visible.length}</>}
          </span>
        </div>
        <Link to="/students/add" className="btn btn-primary">Add Student</Link>
      </div>

      {message && (
        <div className="alert alert-success d-flex justify-content-between align-items-center" role="status">
          <span>{message}</span>
          <button type="button" className="btn-close" aria-label="Dismiss" onClick={() => dispatch(clearStudentMessage())} />
        </div>
      )}

      {error && (
        <div className="alert alert-danger d-flex justify-content-between align-items-center" role="alert">
          <span>{error}</span>
          <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => dispatch(fetchStudents())}>
            Retry
          </button>
        </div>
      )}

      <div className="content-card mb-3">
        <div className="row g-3">
          <div className="col-md-5">
            <label htmlFor="search" className="form-label mb-1">Search by name</label>
            <input
              id="search"
              type="search"
              className="form-control"
              placeholder="e.g. Aarav"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="col-6 col-md-3">
            <label htmlFor="class-filter" className="form-label mb-1">Class</label>
            <select
              id="class-filter"
              className="form-select"
              value={activeClass}
              onChange={(e) => setClassName(e.target.value)}
            >
              <option value="">All classes</option>
              {classes.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="col-6 col-md-4">
            <label htmlFor="sort" className="form-label mb-1">Sort by</label>
            <select id="sort" className="form-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div className="content-card p-0">
        {loading && !loaded ? (
          <div className="text-center py-5" role="status">
            <div className="spinner-border text-primary" aria-hidden="true" />
            <p className="mt-2 mb-0 text-muted-sms">Loading students…</p>
          </div>
        ) : !loaded ? (
          <p className="text-center py-5 mb-0 text-muted-sms">Students could not be loaded.</p>
        ) : students.length === 0 ? (
          <div className="text-center py-5">
            <p className="mb-2">No students yet.</p>
            <Link to="/students/add" className="btn btn-primary btn-sm">Add the first student</Link>
          </div>
        ) : visible.length === 0 ? (
          <div className="text-center py-5">
            <p className="mb-2">No students match your search or filter.</p>
            <button type="button" className="btn btn-outline-secondary btn-sm" onClick={clearFilters}>
              Clear search and filter
            </button>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead>
                <tr>
                  <th scope="col"><span className="visually-hidden">Photo</span></th>
                  <th scope="col">Roll no.</th>
                  <th scope="col">Name</th>
                  <th scope="col">Class</th>
                  <th scope="col">Email</th>
                  <th scope="col">Phone</th>
                  <th scope="col">Age</th>
                  <th scope="col">Grade</th>
                  <th scope="col">Marks</th>
                  <th scope="col"><span className="visually-hidden">Actions</span></th>
                </tr>
              </thead>
              <tbody>
                {visible.map((student) => (
                  <StudentRow key={student.id} student={student} onDelete={setToDelete} disabled={saving} />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {toDelete && (
        <ConfirmDialog
          title="Delete student"
          busy={saving}
          onConfirm={confirmDelete}
          onCancel={() => setToDelete(null)}
        >
          Delete <strong>{toDelete.name}</strong> (roll {toDelete.rollNumber})? This cannot be undone.
        </ConfirmDialog>
      )}
    </div>
  );
}
