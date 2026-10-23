import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/thunks/authThunks';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const close = () => setOpen(false);
  const linkClass = ({ isActive }) => `nav-link${isActive ? ' active' : ''}`;

  const handleLogout = () => {
    dispatch(logout());
    close();
    navigate('/login', { replace: true });
  };

  return (
    <nav className="navbar navbar-expand-md navbar-dark bg-dark">
      <div className="container page-container">
        <Link className="navbar-brand" to={isAuthenticated ? '/students' : '/login'} onClick={close}>
          Student Management System
        </Link>

        {isAuthenticated && (
          <>
            <button
              className="navbar-toggler"
              type="button"
              aria-controls="main-nav"
              aria-expanded={open}
              aria-label="Toggle navigation"
              onClick={() => setOpen((o) => !o)}
            >
              <span className="navbar-toggler-icon" />
            </button>

            <div className={`collapse navbar-collapse${open ? ' show' : ''}`} id="main-nav">
              <ul className="navbar-nav me-auto mb-2 mb-md-0">
                <li className="nav-item">
                  <NavLink to="/students" end className={linkClass} onClick={close}>
                    Student List
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/students/add" className={linkClass} onClick={close}>
                    Add Student
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/profile" className={linkClass} onClick={close}>
                    User Profile
                  </NavLink>
                </li>
              </ul>
              <button type="button" className="btn btn-outline-light btn-sm" onClick={handleLogout}>
                Logout
              </button>
            </div>
          </>
        )}
      </div>
    </nav>
  );
}
