import React, { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../redux/thunks/authThunks';
import { clearAuthError } from '../redux/actions/authActions';

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, loading, error, notice } = useSelector((state) => state.auth);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState('');

  useEffect(() => {
    dispatch(clearAuthError());
  }, [dispatch]);

  if (isAuthenticated) return <Navigate to="/students" replace />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password) {
      setFormError('Enter both username and password.');
      return;
    }
    setFormError('');
    const ok = await dispatch(login(username.trim(), password));
    if (ok) navigate('/students', { replace: true });
  };

  const message = formError || error;

  return (
    <div className="container py-5">
      <div className="content-card login-card mx-auto">
        <h1 className="h4 mb-1">Admin sign in</h1>
        <p className="text-muted-sms mb-3">Sign in to manage student records.</p>

        {notice && <div className="alert alert-warning" role="alert">{notice}</div>}
        {message && <div className="alert alert-danger" role="alert">{message}</div>}

        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-3">
            <label htmlFor="username" className="form-label">Username</label>
            <input
              id="username"
              className="form-control"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              autoFocus
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              id="password"
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>
          <button type="submit" className="btn btn-primary w-100" disabled={loading}>
            {loading && <span className="spinner-border spinner-border-sm me-2" aria-hidden="true" />}
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
}
