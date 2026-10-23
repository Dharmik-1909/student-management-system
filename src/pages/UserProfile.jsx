import React from 'react';
import { useSelector } from 'react-redux';

export default function UserProfile() {
  const { user, expiresAt } = useSelector((state) => state.auth);
  return (
    <div className="container page-container py-4">
      <h1 className="h4 mb-3">User profile</h1>
      <div className="content-card">
        <dl className="row mb-0">
          <dt className="col-sm-3 text-muted-sms fw-normal">Username</dt>
          <dd className="col-sm-9">{user ? user.username : '—'}</dd>
          <dt className="col-sm-3 text-muted-sms fw-normal">Role</dt>
          <dd className="col-sm-9">Administrator</dd>
          <dt className="col-sm-3 text-muted-sms fw-normal">Session expires</dt>
          <dd className="col-sm-9 mb-0">{expiresAt ? new Date(expiresAt).toLocaleString() : '—'}</dd>
        </dl>
      </div>
    </div>
  );
}
