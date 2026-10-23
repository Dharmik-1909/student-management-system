import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { expireSession } from '../redux/thunks/authThunks';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, expiresAt } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const location = useLocation();

  const expired = isAuthenticated && expiresAt && expiresAt < Date.now();

  useEffect(() => {
    if (expired) dispatch(expireSession());
  }, [expired, dispatch]);

  if (!isAuthenticated || expired) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  return children;
}
