import React from 'react';
import { Link, Navigate, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import StudentDetails from './components/StudentDetails';
import StudentForm from './components/StudentForm';
import Login from './pages/Login';
import StudentList from './pages/StudentList';
import UserProfile from './pages/UserProfile';

function NotFound() {
  return (
    <div className="container page-container py-4">
      <div className="content-card text-center">
        <h1 className="h4">Page not found</h1>
        <p className="text-muted-sms">The page you are looking for does not exist.</p>
        <Link to="/students" className="btn btn-primary">
          Go to student list
        </Link>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Navigate to="/students" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/students" element={<ProtectedRoute><StudentList /></ProtectedRoute>} />
          <Route path="/students/add" element={<ProtectedRoute><StudentForm mode="add" /></ProtectedRoute>} />
          <Route path="/students/:id" element={<ProtectedRoute><StudentDetails /></ProtectedRoute>} />
          <Route path="/students/:id/edit" element={<ProtectedRoute><StudentForm mode="edit" /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </>
  );
}
